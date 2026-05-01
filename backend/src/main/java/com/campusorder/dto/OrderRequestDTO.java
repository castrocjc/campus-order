package com.campusorder.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderRequestDTO {

    @NotNull
    private LocalDateTime pickupTime;

    @NotEmpty
    @Valid
    private List<OrderItemRequestDTO> items;
}