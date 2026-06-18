package com.campusorder.controller;

import com.campusorder.dto.UserRequestDTO;
import com.campusorder.dto.UserResponseDTO;
import com.campusorder.dto.VerifyEmailRequestDTO;
import com.campusorder.dto.response.ApiResponse;
import com.campusorder.dto.UserUpdateRequestDTO;
import com.campusorder.dto.UserProfileUpdateRequestDTO;
import com.campusorder.dto.ChangePasswordRequestDTO;
import com.campusorder.service.UserService;
import com.campusorder.entity.User;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;
import jakarta.validation.Valid;

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

    @GetMapping("/me")
    public ApiResponse<UserResponseDTO> getMyProfile(@AuthenticationPrincipal User authenticatedUser) {

        UserResponseDTO user = userService.getMyProfile(authenticatedUser.getEmail());
        return new ApiResponse<>(true, "Perfil del usuario", user);
    }

    @PutMapping("/me/profile")
    public ApiResponse<UserResponseDTO> updateMyProfile(
            @AuthenticationPrincipal User authenticatedUser,
            @Valid @RequestBody UserProfileUpdateRequestDTO dto) {

        UserResponseDTO user = userService.updateMyProfile(authenticatedUser.getEmail(), dto);
        return new ApiResponse<>(true, "Perfil actualizado correctamente", user);
    }

    @PutMapping("/me/password")
    public ApiResponse<Void> changeMyPassword(
            @AuthenticationPrincipal User authenticatedUser,
            @Valid @RequestBody ChangePasswordRequestDTO dto) {

        userService.changeMyPassword(authenticatedUser.getEmail(), dto);
        return new ApiResponse<>(true, "Contraseña actualizada correctamente", null);
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