package com.campusorder.dto.reports;

public record PeakHourDTO(
        Integer hour,
        Long totalOrders
) {
}