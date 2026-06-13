package com.campusorder.service;

import com.campusorder.dto.UserRequestDTO;
import com.campusorder.dto.UserResponseDTO;
import com.campusorder.dto.VerifyEmailRequestDTO;
import com.campusorder.dto.UserUpdateRequestDTO;
import com.campusorder.entity.User;
import com.campusorder.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.beans.factory.annotation.Value;
import java.util.List;
import java.time.LocalDateTime;
import java.util.Random;

@Service
public class UserService {

        @Value("${app.institution.email-domain}")
        private String institutionEmailDomain;

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;

        private final EmailService emailService;

        public UserService(UserRepository userRepository,
                        PasswordEncoder passwordEncoder,
                        EmailService emailService) {
                this.userRepository = userRepository;
                this.passwordEncoder = passwordEncoder;
                this.emailService = emailService;
        }

        public UserResponseDTO createUser(UserRequestDTO dto) {

                String email = dto.getEmail().trim().toLowerCase();
                String allowedDomain = institutionEmailDomain.trim().toLowerCase();

                if (!email.endsWith(allowedDomain)) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Solo se permiten correos institucionales con dominio "
                                                        + institutionEmailDomain);
                }

                if (userRepository.findByEmail(email).isPresent()) {
                        throw new ResponseStatusException(
                                        HttpStatus.CONFLICT,
                                        "El correo ya se encuentra registrado.");
                }

                User user = new User();
                user.setName(dto.getName());
                user.setEmail(email);
                user.setPassword(passwordEncoder.encode(dto.getPassword()));
                user.setRole(dto.getRole() != null ? dto.getRole() : "USER");

                String code = String.format("%06d", new Random().nextInt(999999));

                user.setActive(false);
                user.setEmailVerified(false);
                user.setVerificationCode(code);
                user.setVerificationCodeExpiresAt(LocalDateTime.now().plusMinutes(10));

                User savedUser = userRepository.save(user);

                emailService.sendVerificationCode(email, code);

                return mapToResponseDTO(savedUser);
        }

        public List<UserResponseDTO> getAllUsers() {
                return userRepository.findAll()
                                .stream()
                                .map(this::mapToResponseDTO)
                                .toList();
        }

        public UserResponseDTO verifyEmail(VerifyEmailRequestDTO dto) {

                String email = dto.getEmail().trim().toLowerCase();

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND,
                                                "Usuario no encontrado."));

                if (Boolean.TRUE.equals(user.getEmailVerified())) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "El correo ya fue verificado.");
                }

                if (user.getVerificationCodeExpiresAt() == null ||
                                user.getVerificationCodeExpiresAt().isBefore(LocalDateTime.now())) {

                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "El código de verificación ha expirado.");
                }

                if (!user.getVerificationCode().equals(dto.getCode())) {

                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Código de verificación inválido.");
                }

                user.setEmailVerified(true);
                user.setActive(true);

                user.setVerificationCode(null);
                user.setVerificationCodeExpiresAt(null);

                User savedUser = userRepository.save(user);

                return mapToResponseDTO(savedUser);
        }

        public void resendVerificationCode(String email) {

                String normalizedEmail = email.trim().toLowerCase();

                User user = userRepository.findByEmail(normalizedEmail)
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND,
                                                "Usuario no encontrado."));

                if (Boolean.TRUE.equals(user.getEmailVerified())) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "El correo ya fue verificado.");
                }

                String code = String.format("%06d", new Random().nextInt(999999));

                user.setVerificationCode(code);
                user.setVerificationCodeExpiresAt(
                                LocalDateTime.now().plusMinutes(10));

                userRepository.save(user);

                emailService.sendVerificationCode(
                                user.getEmail(),
                                code);
        }

        public UserResponseDTO getUserById(Long id) {
        User user = findUserById(id);
        return mapToResponseDTO(user);
        }

        public UserResponseDTO createAdminUser(UserRequestDTO dto) {

        String email = dto.getEmail().trim().toLowerCase();

        if (userRepository.findByEmail(email).isPresent()) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "El correo ya se encuentra registrado."
                );
        }

        String role = normalizeAndValidateRole(dto.getRole());

        User user = new User();
        user.setName(dto.getName());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(role);
        user.setActive(true);
        user.setEmailVerified(true);
        user.setVerificationCode(null);
        user.setVerificationCodeExpiresAt(null);
        user.setPasswordResetCode(null);
        user.setPasswordResetCodeExpiresAt(null);

        User savedUser = userRepository.save(user);

        return mapToResponseDTO(savedUser);
        }

        public UserResponseDTO updateUser(Long id, UserUpdateRequestDTO dto) {

        User user = findUserById(id);

        String email = dto.getEmail().trim().toLowerCase();

        userRepository.findByEmail(email).ifPresent(existingUser -> {
                if (!existingUser.getId().equals(id)) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "El correo ya se encuentra registrado por otro usuario."
                );
                }
        });

        user.setName(dto.getName());
        user.setEmail(email);
        user.setRole(normalizeAndValidateRole(dto.getRole()));

        User savedUser = userRepository.save(user);

        return mapToResponseDTO(savedUser);
        }

        public UserResponseDTO toggleUserActive(Long id) {

        User user = findUserById(id);

        user.setActive(!Boolean.TRUE.equals(user.getActive()));

        User savedUser = userRepository.save(user);

        return mapToResponseDTO(savedUser);
        }

        public String resetPasswordByAdmin(Long id) {

        User user = findUserById(id);

        String temporaryPassword = "Temp" + String.format("%06d", new Random().nextInt(999999));

        user.setPassword(passwordEncoder.encode(temporaryPassword));
        user.setPasswordResetCode(null);
        user.setPasswordResetCodeExpiresAt(null);

        userRepository.save(user);

        return temporaryPassword;
        }

        private User findUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Usuario no encontrado."
                ));
        }

        private String normalizeAndValidateRole(String role) {

        if (role == null || role.isBlank()) {
                return "USER";
        }

        String normalizedRole = role.trim().toUpperCase();

        if (!normalizedRole.equals("USER") &&
                !normalizedRole.equals("ADMIN") &&
                !normalizedRole.equals("WORKER")) {

                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Rol inválido. Valores permitidos: USER, ADMIN, WORKER."
                );
        }

        return normalizedRole;
        }        
        private UserResponseDTO mapToResponseDTO(User user) {
                return new UserResponseDTO(
                                user.getId(),
                                user.getName(),
                                user.getEmail(),
                                user.getRole(),
                                user.getActive(),
                                user.getEmailVerified(),
                                user.getVerificationCode(),
                                user.getPasswordResetCode());
        }
}