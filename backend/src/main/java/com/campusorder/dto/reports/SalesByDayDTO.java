package com.campusorder.dto.reports;

import java.math.BigDecimal;
import java.time.LocalDate;

public record SalesByDayDTO(
        LocalDate date,
        BigDecimal total
) {
}