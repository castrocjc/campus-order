package com.campusorder.entity;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @Column(unique = true)
    private String email;
    private String phone;
    private String password;
    private String role;
    private Boolean active = true;
    private Boolean emailVerified = false;
    private String verificationCode;
    private LocalDateTime verificationCodeExpiresAt;
    private String passwordResetCode;
    private LocalDateTime passwordResetCodeExpiresAt;
}