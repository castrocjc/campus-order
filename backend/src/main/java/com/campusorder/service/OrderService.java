package com.campusorder.service;

import com.campusorder.dto.OrderItemResponseDTO;
import com.campusorder.dto.OrderRequestDTO;
import com.campusorder.dto.OrderResponseDTO;
import com.campusorder.entity.Order;
import com.campusorder.entity.OrderItem;
import com.campusorder.entity.Product;
import com.campusorder.entity.User;
import com.campusorder.enums.OrderStatus;
import com.campusorder.exception.BusinessException;
import com.campusorder.entity.CafeteriaSettings;
import com.campusorder.entity.CafeteriaSchedule;
import com.campusorder.repository.CafeteriaSettingsRepository;
import com.campusorder.repository.CafeteriaScheduleRepository;
import com.campusorder.repository.OrderRepository;
import com.campusorder.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.DayOfWeek;

@Service
public class OrderService {

        private final OrderRepository orderRepository;
        private final ProductRepository productRepository;
        private final NotificationService notificationService;

        private final CafeteriaSettingsRepository cafeteriaSettingsRepository;
        private final CafeteriaScheduleRepository cafeteriaScheduleRepository;
        
        public OrderService(
                        OrderRepository orderRepository,
                        ProductRepository productRepository,
                        NotificationService notificationService,
                        CafeteriaSettingsRepository cafeteriaSettingsRepository,
                        CafeteriaScheduleRepository cafeteriaScheduleRepository) {

                this.orderRepository = orderRepository;
                this.productRepository = productRepository;
                this.notificationService = notificationService;
                this.cafeteriaSettingsRepository = cafeteriaSettingsRepository;
                this.cafeteriaScheduleRepository = cafeteriaScheduleRepository;
        }

        public OrderResponseDTO createOrder(OrderRequestDTO dto) {

                validatePickupTime(dto.getPickupTime());

                Order order = new Order();

                User authenticatedUser = (User) SecurityContextHolder
                                .getContext()
                                .getAuthentication()
                                .getPrincipal();

                order.setUserId(authenticatedUser.getId());

                order.setPickupTime(dto.getPickupTime());

                List<OrderItem> items = dto.getItems().stream().map(itemDto -> {

                        Product product = productRepository.findById(itemDto.getProductId())
                                        .orElseThrow(() -> new BusinessException("Producto no encontrado"));

                        // Validar stock
                        if (product.getStock() < itemDto.getQuantity()) {
                                throw new BusinessException(
                                                "Stock insuficiente para el producto: " + product.getName());
                        }

                        // Reducir stock
                        product.setStock(product.getStock() - itemDto.getQuantity());
                        productRepository.save(product);

                        BigDecimal subtotal = product.getPrice()
                                        .multiply(BigDecimal.valueOf(itemDto.getQuantity()));

                        OrderItem item = new OrderItem();
                        item.setProductId(product.getId());
                        item.setProductName(product.getName());
                        item.setQuantity(itemDto.getQuantity());
                        item.setUnitPrice(product.getPrice());
                        item.setSubtotal(subtotal);
                        item.setCustomizationNotes(itemDto.getCustomizationNotes());
                        item.setOrder(order);

                        return item;
                }).toList();

                BigDecimal total = items.stream()
                                .map(OrderItem::getSubtotal)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                order.setItems(items);
                order.setTotalAmount(total);

                Order savedOrder = orderRepository.save(order);

                return mapToDTO(savedOrder);
        }

        public List<OrderResponseDTO> getOrdersByUser(Long userId) {
                return orderRepository.findByUserId(userId)
                                .stream()
                                .map(this::mapToDTO)
                                .toList();
        }

        public List<OrderResponseDTO> getAllOrders() {
                return orderRepository.findAll()
                                .stream()
                                .map(this::mapToDTO)
                                .toList();
        }

        public List<OrderResponseDTO> getTodayOrders() {

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

                LocalDate today = LocalDate.now(cafeteriaZoneId);

                LocalDateTime startOfDay = today.atStartOfDay();
                LocalDateTime endOfDay = today.plusDays(1).atStartOfDay().minusNanos(1);

                return orderRepository
                                .findByPickupTimeBetweenOrderByPickupTimeDesc(
                                                startOfDay,
                                                endOfDay)
                                .stream()
                                .map(this::mapToDTO)
                                .toList();
        }

        public OrderResponseDTO updateOrderStatus(
                Long orderId,
                OrderStatus status) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new BusinessException("Pedido no encontrado"));

        OrderStatus previousStatus = order.getStatus();

        if (
                status == OrderStatus.CANCELLED
                && previousStatus != OrderStatus.CANCELLED
        ) {
                restoreStock(order);
        }

        order.setStatus(status);

        Order savedOrder = orderRepository.save(order);

        if (
                previousStatus != OrderStatus.READY_FOR_PICKUP
                && status == OrderStatus.READY_FOR_PICKUP
                && !Boolean.TRUE.equals(
                        savedOrder.getReadyForPickupNotificationSent())
        ) {

                notificationService
                        .notifyOrderReadyForPickup(savedOrder);
        }

        return mapToDTO(savedOrder);
        }

        @Transactional
        public int closeDailyOperation() {

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

                LocalDate today = LocalDate.now(cafeteriaZoneId);

                LocalDateTime startOfDay = today.atStartOfDay();
                LocalDateTime endOfDay = today.plusDays(1).atStartOfDay().minusNanos(1);

                List<OrderStatus> pendingStatuses = List.of(
                                OrderStatus.RECEIVED,
                                OrderStatus.IN_PREPARATION,
                                OrderStatus.READY_FOR_PICKUP);

                List<Order> pendingOrders = orderRepository
                                .findByPickupTimeBetweenAndStatusIn(
                                                startOfDay,
                                                endOfDay,
                                                pendingStatuses);

                pendingOrders.forEach(order ->
                                order.setStatus(OrderStatus.NOT_ATTENDED));

                orderRepository.saveAll(pendingOrders);

                return pendingOrders.size();
        }

        private OrderResponseDTO mapToDTO(Order order) {

                List<OrderItemResponseDTO> itemDTOs = order.getItems()
                                .stream()
                                .map(item -> new OrderItemResponseDTO(
                                        item.getProductId(),
                                        item.getProductName(),
                                        item.getQuantity(),
                                        item.getUnitPrice(),
                                        item.getSubtotal(),
                                        item.getCustomizationNotes()
                                        ))
                                .toList();

                return new OrderResponseDTO(
                                order.getId(),
                                order.getUserId(),
                                order.getStatus(),
                                order.getPickupTime(),
                                order.getTotalAmount(),
                                order.getCreatedAt(),
                                itemDTOs);
        }

        public OrderResponseDTO cancelOrder(Long orderId) {

                Order order = orderRepository.findById(orderId)
                                .orElseThrow(() -> new BusinessException("Pedido no encontrado"));

                if (order.getStatus() != OrderStatus.RECEIVED) {
                        throw new BusinessException("Solo se puede cancelar un pedido en estado RECEIVED");
                }

                restoreStock(order);

                order.setStatus(OrderStatus.CANCELLED);

                Order cancelledOrder = orderRepository.save(order);

                return mapToDTO(cancelledOrder);
        }

        private void validatePickupTime(LocalDateTime pickupTime) {

                CafeteriaSettings settings = cafeteriaSettingsRepository
                                .findFirstByOrderByIdAsc()
                                .orElseThrow(() -> new BusinessException(
                                                "Configuración de cafetería no encontrada"));

                if (!Boolean.TRUE.equals(settings.getActive())) {
                        throw new BusinessException(
                                        "La cafetería no se encuentra activa para recibir pedidos");
                }

                ZoneId cafeteriaZoneId;

                try {
                        cafeteriaZoneId = ZoneId.of(settings.getTimezone());
                } catch (Exception ex) {
                        throw new BusinessException(
                                        "La zona horaria configurada para la cafetería no es válida");
                }

                Integer minPreparationMinutes = settings.getMinPreparationMinutes();

                if (minPreparationMinutes == null || minPreparationMinutes < 1) {
                        throw new BusinessException(
                                        "El tiempo mínimo de preparación de la cafetería no es válido");
                }

                LocalDateTime minimumAllowed = LocalDateTime
                                .now(cafeteriaZoneId)
                                .plusMinutes(minPreparationMinutes);

                if (pickupTime.isBefore(minimumAllowed)) {
                        throw new BusinessException(
                                        "La hora de recojo debe ser al menos "
                                                        + minPreparationMinutes
                                                        + " minutos posterior a la hora actual");
                }

                DayOfWeek dayOfWeek = pickupTime.getDayOfWeek();
                String dayOfWeekName = dayOfWeek.name();

                CafeteriaSchedule schedule = cafeteriaScheduleRepository
                                .findByCafeteriaSettings_IdAndDayOfWeek(
                                                settings.getId(),
                                                dayOfWeekName)
                                .orElseThrow(() -> new BusinessException(
                                                "No existe horario configurado para el día "
                                                                + dayOfWeekName));

                if (Boolean.TRUE.equals(schedule.getClosed())) {
                        throw new BusinessException(
                                        "La cafetería se encuentra cerrada para el día seleccionado");
                }

                LocalTime requestedTime = pickupTime.toLocalTime();
                LocalTime openingTime = schedule.getOpeningTime();
                LocalTime closingTime = schedule.getClosingTime();

                if (openingTime == null || closingTime == null) {
                        throw new BusinessException(
                                        "El horario de atención configurado para el día seleccionado no es válido");
                }

                if (requestedTime.isBefore(openingTime)
                                || requestedTime.isAfter(closingTime)) {

                        throw new BusinessException(
                                        "La hora de recojo está fuera del horario de atención");
                }
        }

        private void restoreStock(Order order) {

        for (OrderItem item : order.getItems()) {

                Product product = productRepository.findById(item.getProductId())
                        .orElseThrow(() ->
                                new BusinessException(
                                        "Producto no encontrado: "
                                                + item.getProductName()));

                product.setStock(
                        product.getStock() + item.getQuantity()
                );

                productRepository.save(product);
        }
        }        
}