package com.campusorder.service;

import com.campusorder.entity.Order;
import com.campusorder.entity.User;
import com.campusorder.repository.OrderRepository;
import com.campusorder.repository.UserRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final EmailService emailService;

    public NotificationService(
            UserRepository userRepository,
            OrderRepository orderRepository,
            EmailService emailService) {

        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.emailService = emailService;
    }

    public void notifyOrderReadyForPickup(Order order) {

        try {

            if (Boolean.TRUE.equals(order.getReadyForPickupNotificationSent())) {
                return;
            }

            User user = userRepository.findById(order.getUserId())
                    .orElseThrow(() -> new RuntimeException(
                            "Usuario no encontrado para pedido "
                                    + order.getId()));

            emailService.sendOrderReadyForPickupEmail(
                    user.getEmail(),
                    user.getName(),
                    order.getId(),
                    order.getPickupTime(),
                    order.getTotalAmount());

            order.setReadyForPickupNotificationSent(true);

            orderRepository.save(order);

            logger.info(
                    "Notificación READY_FOR_PICKUP enviada para pedido {}",
                    order.getId());

        } catch (Exception ex) {

            logger.error(
                    "Error enviando notificación READY_FOR_PICKUP para pedido {}",
                    order.getId(),
                    ex);

        }
    }
}