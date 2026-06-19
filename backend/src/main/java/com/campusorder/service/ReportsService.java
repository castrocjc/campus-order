package com.campusorder.service;

import com.campusorder.dto.reports.OrdersByStatusDTO;
import com.campusorder.dto.reports.PeakHourDTO;
import com.campusorder.dto.reports.ReportSummaryDTO;
import com.campusorder.dto.reports.SalesByDayDTO;
import com.campusorder.dto.reports.TopProductDTO;
import com.campusorder.enums.OrderStatus;
import com.campusorder.repository.OrderRepository;
import com.campusorder.repository.UserRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReportsService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public ReportsService(
            OrderRepository orderRepository,
            UserRepository userRepository
    ) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    public ReportSummaryDTO getSummary(LocalDate from, LocalDate to) {
        LocalDateTime fromDateTime = from.atStartOfDay();
        LocalDateTime toDateTime = to.plusDays(1).atStartOfDay().minusNanos(1);

        BigDecimal totalSales = orderRepository.getTotalSales(
                OrderStatus.DELIVERED,
                fromDateTime,
                toDateTime
        );

        Long deliveredOrders = orderRepository.countOrdersByStatusAndDateRange(
                OrderStatus.DELIVERED,
                fromDateTime,
                toDateTime
        );

        Long totalOrders = orderRepository.countOrdersByDateRange(
                fromDateTime,
                toDateTime
        );

        Long productsSold = orderRepository.countProductsSold(
                OrderStatus.DELIVERED,
                fromDateTime,
                toDateTime
        );

        BigDecimal averageTicket = BigDecimal.ZERO;

        if (deliveredOrders != null && deliveredOrders > 0) {
            averageTicket = totalSales.divide(
                    BigDecimal.valueOf(deliveredOrders),
                    2,
                    RoundingMode.HALF_UP
            );
        }

        return new ReportSummaryDTO(
                totalSales,
                totalOrders,
                averageTicket,
                productsSold,
                userRepository.count(),
                userRepository.countByActiveTrue()
        );
    }

    public List<SalesByDayDTO> getSalesByDay(
            LocalDate from,
            LocalDate to
    ) {

        return orderRepository.getSalesByDay(
                OrderStatus.DELIVERED,
                from.atStartOfDay(),
                to.plusDays(1).atStartOfDay().minusNanos(1)
        )
        .stream()
        .map(row -> new SalesByDayDTO(
                ((java.sql.Date) row[0]).toLocalDate(),
                (java.math.BigDecimal) row[1]
        ))
        .toList();
    }

    public List<OrdersByStatusDTO> getOrdersByStatus(LocalDate from, LocalDate to) {
        return orderRepository.getOrdersByStatus(
                from.atStartOfDay(),
                to.plusDays(1).atStartOfDay().minusNanos(1)
        );
    }

    public List<TopProductDTO> getTopProducts(
            LocalDate from,
            LocalDate to,
            Integer limit
    ) {
        int safeLimit = limit == null || limit < 1 ? 5 : Math.min(limit, 10);

        return orderRepository.getTopProducts(
                OrderStatus.DELIVERED,
                from.atStartOfDay(),
                to.plusDays(1).atStartOfDay().minusNanos(1),
                PageRequest.of(0, safeLimit)
        );
    }

    public List<PeakHourDTO> getPeakHours(LocalDate from, LocalDate to) {
        return orderRepository.getPeakHours(
                from.atStartOfDay(),
                to.plusDays(1).atStartOfDay().minusNanos(1)
        );
    }
}