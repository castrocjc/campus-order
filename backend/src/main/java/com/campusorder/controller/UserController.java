package com.campusorder.controller;

import com.campusorder.dto.UserRequestDTO;
import com.campusorder.dto.UserResponseDTO;
import com.campusorder.dto.VerifyEmailRequestDTO;
import com.campusorder.dto.response.ApiResponse;
import com.campusorder.dto.UserUpdateRequestDTO;
import com.campusorder.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ApiResponse<UserResponseDTO> createUser(@Valid @RequestBody UserRequestDTO dto) {
        UserResponseDTO user = userService.createUser(dto);
        return new ApiResponse<>(true, "Usuario creado correctamente", user);
    }

    @PostMapping("/verify-email")
    public ApiResponse<UserResponseDTO> verifyEmail(@Valid @RequestBody VerifyEmailRequestDTO dto) {
        UserResponseDTO user = userService.verifyEmail(dto);
        return new ApiResponse<>(true, "Correo verificado correctamente", user);
    }

    @PostMapping("/resend-code")
    public ApiResponse<Void> resendCode(@RequestParam String email) {

        userService.resendVerificationCode(email);

        return new ApiResponse<>(
                true,
                "Código de verificación reenviado correctamente",
                null
        );
    }

    @GetMapping
    public ApiResponse<List<UserResponseDTO>> getAllUsers() {
        List<UserResponseDTO> users = userService.getAllUsers();
        return new ApiResponse<>(true, "Lista de usuarios", users);
    }

    @GetMapping("/{id}")
    public ApiResponse<UserResponseDTO> getUserById(@PathVariable Long id) {
        UserResponseDTO user = userService.getUserById(id);
        return new ApiResponse<>(true, "Usuario encontrado", user);
    }

    @PostMapping("/admin")
    public ApiResponse<UserResponseDTO> createAdminUser(@Valid @RequestBody UserRequestDTO dto) {
        UserResponseDTO user = userService.createAdminUser(dto);
        return new ApiResponse<>(true, "Usuario administrativo creado correctamente", user);
    }

    @PutMapping("/{id}")
    public ApiResponse<UserResponseDTO> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserUpdateRequestDTO dto) {

        UserResponseDTO user = userService.updateUser(id, dto);
        return new ApiResponse<>(true, "Usuario actualizado correctamente", user);
    }

    @PatchMapping("/{id}/toggle-active")
    public ApiResponse<UserResponseDTO> toggleUserActive(@PathVariable Long id) {
        UserResponseDTO user = userService.toggleUserActive(id);
        return new ApiResponse<>(true, "Estado del usuario actualizado correctamente", user);
    }

    @PatchMapping("/{id}/reset-password")
    public ApiResponse<String> resetPasswordByAdmin(@PathVariable Long id) {
        String temporaryPassword = userService.resetPasswordByAdmin(id);
        return new ApiResponse<>(true, "Contraseña temporal generada correctamente", temporaryPassword);
    }    
}