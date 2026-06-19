package com.campusorder.dto.reports;

import java.math.BigDecimal;

public record TopProductDTO(
        Long productId,
        String productName,
        Long quantitySold,
        BigDecimal revenue
) {
}