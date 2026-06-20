package com.campusorder.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CustomizationOptionResponseDTO {

    private Long id;
    private String name;
    private String description;
    private Boolean active;
}