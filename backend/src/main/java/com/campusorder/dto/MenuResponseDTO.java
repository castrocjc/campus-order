package com.campusorder.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class MenuResponseDTO {

    private String category;
    private List<ProductResponseDTO> products;
}