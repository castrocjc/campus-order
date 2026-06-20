package com.campusorder.dto.reports;

import java.math.BigDecimal;

public record ReportSummaryDTO(
        BigDecimal totalSales,
        Long totalOrders,
        BigDecimal averageTicket,
        Long productsSold,
        Long registeredUsers,
        Long activeUsers
) {
}