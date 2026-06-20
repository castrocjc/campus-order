package com.campusorder.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class CafeteriaSettingsResponseDTO {

    private Long id;
    private String name;
    private String description;
    private Boolean active;

    private String address;
    private String reference;
    private String contactPhone;

    private String timezone;
    private String currency;

    private Integer minPreparationMinutes;
    private Integer pickupIntervalMinutes;

    private List<CafeteriaScheduleDTO> schedules;
}