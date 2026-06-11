package com.campusorder.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ResetPasswordRequestDTO {
    @Email
    @NotBlank
    private String email;
    @NotBlank
    private String code;
    @NotBlank
    private String newPassword;
}