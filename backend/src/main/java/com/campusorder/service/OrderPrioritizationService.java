package com.campusorder.service;

import com.campusorder.entity.Order;
import com.campusorder.enums.OrderStatus;
import com.campusorder.enums.OrderViewType;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class OrderPrioritizationService {

    public List<Order> sort(List<Order> orders, OrderViewType viewType) {
        return orders.stream()
                .sorted(
                        Comparator
                                .comparingInt((Order order) -> getPriority(order.getStatus(), viewType))
                                .thenComparing(Order::getPickupTime)
                                .thenComparing(Order::getCreatedAt)
                )
                .toList();
    }

    private int getPriority(OrderStatus status, OrderViewType viewType) {
        return switch (viewType) {
            case OPERATIONAL -> getOperationalPriority(status);
            case CUSTOMER -> getCustomerPriority(status);
        };
    }

    private int getOperationalPriority(OrderStatus status) {
        return switch (status) {
            case READY_FOR_PICKUP -> 1;
            case IN_PREPARATION -> 2;
            case RECEIVED -> 3;
            case NOT_ATTENDED -> 4;
            case DELIVERED -> 5;
            case CANCELLED -> 6;
        };
    }

    private int getCustomerPriority(OrderStatus status) {
        return switch (status) {
            case READY_FOR_PICKUP -> 1;
            case IN_PREPARATION -> 2;
            case RECEIVED -> 3;
            case NOT_ATTENDED -> 4;
            case DELIVERED -> 5;
            case CANCELLED -> 6;
        };
    }
}