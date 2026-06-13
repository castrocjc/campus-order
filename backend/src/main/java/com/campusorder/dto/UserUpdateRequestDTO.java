package com.campusorder.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserUpdateRequestDTO {

    @NotBlank(message = "El nombre es obligatorio")
    private String name;

    @Email(message = "Email inválido")
    @NotBlank(message = "El email es obligatorio")
    private String email;

    @NotBlank(message = "El rol es obligatorio")
    private String role;
}