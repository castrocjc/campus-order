package com.campusorder.controller;

import com.campusorder.dto.LoginRequestDTO;
import com.campusorder.dto.LoginResponseDTO;
import com.campusorder.dto.response.ApiResponse;
import com.campusorder.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:8082")
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
}