package com.campusorder.controller;

import com.campusorder.dto.LoginRequestDTO;
import com.campusorder.dto.LoginResponseDTO;
import com.campusorder.dto.ForgotPasswordRequestDTO;
import com.campusorder.dto.ResetPasswordRequestDTO;
import com.campusorder.dto.response.ApiResponse;
import com.campusorder.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ApiResponse<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO dto) {
        return new ApiResponse<>(
                true,
                "Login exitoso",
                authService.login(dto)
        );
    }

    @PostMapping("/forgot-password")
    public ApiResponse<Void> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequestDTO dto) {

        authService.forgotPassword(dto.getEmail());

        return new ApiResponse<>(
                true,
                "Si el correo existe, se ha enviado un código de recuperación.",
                null
        );
    }

    @PostMapping("/reset-password")
    public ApiResponse<Void> resetPassword(
            @Valid @RequestBody ResetPasswordRequestDTO dto) {

        authService.resetPassword(
                dto.getEmail(),
                dto.getCode(),
                dto.getNewPassword()
        );

        return new ApiResponse<>(
                true,
                "Contraseña actualizada correctamente.",
                null
        );
    }
}