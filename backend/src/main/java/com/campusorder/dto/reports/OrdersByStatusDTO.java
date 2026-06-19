package com.campusorder.dto.reports;

public record OrdersByStatusDTO(
        String status,
        Long total
) {
}