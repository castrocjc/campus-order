package com.campusorder.service;

import com.campusorder.dto.LoginRequestDTO;
import com.campusorder.dto.LoginResponseDTO;
import com.campusorder.entity.User;
import com.campusorder.exception.BusinessException;
import com.campusorder.repository.UserRepository;
import com.campusorder.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Random;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public AuthService(UserRepository userRepository,
                    JwtService jwtService,
                    PasswordEncoder passwordEncoder,
                    EmailService emailService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    public LoginResponseDTO login(LoginRequestDTO dto) {

        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new BusinessException("Credenciales inválidas"));

        boolean passwordMatches = passwordEncoder.matches(dto.getPassword(), user.getPassword());

        if (!passwordMatches) {
            throw new BusinessException("Credenciales inválidas");
        }

        if (!Boolean.TRUE.equals(user.getEmailVerified())) {
            throw new BusinessException(
                    "Debes verificar tu correo institucional antes de iniciar sesión."
            );
        }

        if (!Boolean.TRUE.equals(user.getActive())) {
            throw new BusinessException(
                    "Tu cuenta se encuentra inactiva."
            );
        }

        return new LoginResponseDTO(
                jwtService.generateToken(user),
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }

    public void forgotPassword(String email) {

        String normalizedEmail = email.trim().toLowerCase();

        userRepository.findByEmail(normalizedEmail).ifPresent(user -> {

            if (!Boolean.TRUE.equals(user.getEmailVerified())) {
                return;
            }
                        
            String code = String.format("%06d", new Random().nextInt(999999));

            user.setPasswordResetCode(code);
            user.setPasswordResetCodeExpiresAt(LocalDateTime.now().plusMinutes(10));

            userRepository.save(user);

            emailService.sendPasswordResetCode(user.getEmail(), code);
        });
    }

    public void resetPassword(String email, String code, String newPassword) {

        String normalizedEmail = email.trim().toLowerCase();

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new BusinessException("Código inválido o expirado."));

        if (user.getPasswordResetCodeExpiresAt() == null ||
                user.getPasswordResetCodeExpiresAt().isBefore(LocalDateTime.now())) {

            throw new BusinessException("Código inválido o expirado.");
        }

        if (user.getPasswordResetCode() == null ||
                !user.getPasswordResetCode().equals(code)) {

            throw new BusinessException("Código inválido o expirado.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));

        user.setPasswordResetCode(null);
        user.setPasswordResetCodeExpiresAt(null);

        userRepository.save(user);
    }    
}