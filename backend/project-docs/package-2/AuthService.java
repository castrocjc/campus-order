package com.campusorder.service;

import com.campusorder.dto.LoginRequestDTO;
import com.campusorder.dto.LoginResponseDTO;
import com.campusorder.entity.User;
import com.campusorder.exception.BusinessException;
import com.campusorder.repository.UserRepository;
import com.campusorder.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository,
                       JwtService jwtService,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
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
}