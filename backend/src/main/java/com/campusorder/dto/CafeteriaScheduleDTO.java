package com.campusorder.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CafeteriaScheduleDTO {

    private Long id;
    private String dayOfWeek;
    private LocalTime openingTime;
    private LocalTime closingTime;
    private Boolean closed;
}