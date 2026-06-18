package com.campusorder.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;

@Data
public class CafeteriaSettingsRequestDTO {

    @NotBlank
    private String name;

    private String description;

    @NotNull
    private Boolean active;

    private String address;
    private String reference;
    private String contactPhone;

    @NotBlank
    private String timezone;

    @NotBlank
    private String currency;

    @NotNull
    @Min(1)
    private Integer minPreparationMinutes;

    @NotNull
    @Min(1)
    private Integer pickupIntervalMinutes;

    @NotNull
    @Size(min = 7, max = 7)
    @Valid
    private List<CafeteriaScheduleDTO> schedules;
}