package com.campusorder.service;

import com.campusorder.dto.reports.OperationalMetricsDTO;
import com.campusorder.dto.reports.MetricStatsDTO;
import com.campusorder.entity.OrderStatusEvent;
import com.campusorder.enums.OrderStatus;
import com.campusorder.repository.OrderStatusEventRepository;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.ArrayList;

@Service
public class OperationalMetricsService {

    private final OrderStatusEventRepository orderStatusEventRepository;

    public OperationalMetricsService(
            OrderStatusEventRepository orderStatusEventRepository
    ) {
        this.orderStatusEventRepository = orderStatusEventRepository;
    }

    public OperationalMetricsDTO getOperationalMetrics(LocalDate from, LocalDate to) {
        LocalDateTime fromDateTime = from.atStartOfDay();
        LocalDateTime toDateTime = to.plusDays(1).atStartOfDay().minusNanos(1);

        List<OrderStatusEvent> events =
                orderStatusEventRepository.findEventsForOrdersCreatedBetween(
                        fromDateTime,
                        toDateTime
                );

        Map<Long, List<OrderStatusEvent>> eventsByOrder = events.stream()
                .collect(Collectors.groupingBy(
                        event -> event.getOrder().getId()
                ));

        List<Double> timeToPreparationValues = new ArrayList<>();
        List<Double> preparationValues = new ArrayList<>();
        List<Double> waitingPickupValues = new ArrayList<>();
        List<Double> totalDeliveryValues = new ArrayList<>();

        for (List<OrderStatusEvent> orderEvents : eventsByOrder.values()) {
            Map<OrderStatus, LocalDateTime> firstEventByStatus = new EnumMap<>(OrderStatus.class);

            for (OrderStatusEvent event : orderEvents) {
                firstEventByStatus.putIfAbsent(
                        event.getNewStatus(),
                        event.getEventDatetime()
                );
            }

            LocalDateTime received = firstEventByStatus.get(OrderStatus.RECEIVED);
            LocalDateTime inPreparation = firstEventByStatus.get(OrderStatus.IN_PREPARATION);
            LocalDateTime readyForPickup = firstEventByStatus.get(OrderStatus.READY_FOR_PICKUP);
            LocalDateTime delivered = firstEventByStatus.get(OrderStatus.DELIVERED);

            if (received != null && inPreparation != null) {
                timeToPreparationValues.add(minutesBetween(received, inPreparation));
            }

            if (inPreparation != null && readyForPickup != null) {
                preparationValues.add(minutesBetween(inPreparation, readyForPickup));
            }

            if (readyForPickup != null && delivered != null) {
                waitingPickupValues.add(minutesBetween(readyForPickup, delivered));
            }

            if (received != null && delivered != null) {
                totalDeliveryValues.add(minutesBetween(received, delivered));
            }
        }

        return new OperationalMetricsDTO(
                buildStats(timeToPreparationValues),
                buildStats(preparationValues),
                buildStats(waitingPickupValues),
                buildStats(totalDeliveryValues),
                (long) totalDeliveryValues.size()
        );
    }

    private double minutesBetween(LocalDateTime start, LocalDateTime end) {
        return Duration.between(start, end).toSeconds() / 60.0;
    }

    private MetricStatsDTO buildStats(List<Double> values) {
        if (values == null || values.isEmpty()) {
            return new MetricStatsDTO(0.0, 0.0, 0.0);
        }

        double average = values.stream()
                .mapToDouble(Double::doubleValue)
                .average()
                .orElse(0.0);

        double minimum = values.stream()
                .mapToDouble(Double::doubleValue)
                .min()
                .orElse(0.0);

        double maximum = values.stream()
                .mapToDouble(Double::doubleValue)
                .max()
                .orElse(0.0);

        return new MetricStatsDTO(
                roundOneDecimal(average),
                roundOneDecimal(minimum),
                roundOneDecimal(maximum)
        );
    }
    private Double roundOneDecimal(double value) {
        return Math.round(value * 10.0) / 10.0;
    }    
}