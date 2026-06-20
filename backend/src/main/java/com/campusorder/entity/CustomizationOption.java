package com.campusorder.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "customization_options")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomizationOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private Boolean active = true;
}