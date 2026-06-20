package com.campusorder.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CustomizationOptionRequestDTO {

    @NotBlank
    private String name;

    private String description;

    private Boolean active;
}