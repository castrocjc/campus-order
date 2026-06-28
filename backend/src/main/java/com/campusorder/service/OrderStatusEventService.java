package com.campusorder.service;

import com.campusorder.entity.Order;
import com.campusorder.entity.OrderStatusEvent;
import com.campusorder.entity.User;
import com.campusorder.entity.CafeteriaSettings;
import com.campusorder.exception.BusinessException;
import com.campusorder.repository.CafeteriaSettingsRepository;
import com.campusorder.enums.OrderStatus;
import com.campusorder.repository.OrderStatusEventRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.time.ZoneId;
import java.time.LocalDateTime;

@Service
public class OrderStatusEventService {

    private final OrderStatusEventRepository orderStatusEventRepository;
    private final CafeteriaSettingsRepository cafeteriaSettingsRepository;

    public OrderStatusEventService(
            OrderStatusEventRepository orderStatusEventRepository,
            CafeteriaSettingsRepository cafeteriaSettingsRepository
    ) {
        this.orderStatusEventRepository = orderStatusEventRepository;
        this.cafeteriaSettingsRepository = cafeteriaSettingsRepository;
    }

    public void registerTransition(
            Order order,
            OrderStatus previousStatus,
            OrderStatus newStatus,
            String source,
            String remarks
    ) {
        Long performedByUserId = null;
        String performedByRole = null;

        Object principal = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        if (principal instanceof User user) {
            performedByUserId = user.getId();
            performedByRole = user.getRole();
        }

        CafeteriaSettings settings = cafeteriaSettingsRepository
                .findFirstByOrderByIdAsc()
                .orElseThrow(() -> new BusinessException(
                        "Configuración de cafetería no encontrada"));

        ZoneId cafeteriaZoneId;

        try {
            cafeteriaZoneId = ZoneId.of(settings.getTimezone());
        } catch (Exception ex) {
            throw new BusinessException(
                    "La zona horaria configurada para la cafetería no es válida");
        }

        OrderStatusEvent event = new OrderStatusEvent();
        event.setOrder(order);
        event.setPreviousStatus(previousStatus);
        event.setNewStatus(newStatus);
        event.setEventDatetime(LocalDateTime.now(cafeteriaZoneId));
        event.setPerformedByUserId(performedByUserId);
        event.setPerformedByRole(performedByRole);
        event.setSource(source);
        event.setRemarks(remarks);

        orderStatusEventRepository.save(event);
    }
}