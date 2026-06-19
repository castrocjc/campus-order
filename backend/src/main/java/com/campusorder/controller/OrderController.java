package com.campusorder.controller;

import com.campusorder.dto.OrderRequestDTO;
import com.campusorder.dto.OrderResponseDTO;
import com.campusorder.dto.response.ApiResponse;
import com.campusorder.entity.User;
import com.campusorder.enums.OrderStatus;
import com.campusorder.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ApiResponse<OrderResponseDTO> createOrder(@Valid @RequestBody OrderRequestDTO dto) {
        return new ApiResponse<>(true, "Pedido creado correctamente", orderService.createOrder(dto));
    }

    @GetMapping
    public ApiResponse<List<OrderResponseDTO>> getTodayOrders() {
        return new ApiResponse<>(
                true,
                "Lista de pedidos del día",
                orderService.getTodayOrders()
        );
    }

    @GetMapping("/user/{userId}")
    public ApiResponse<List<OrderResponseDTO>> getOrdersByUser(@PathVariable Long userId) {
        return new ApiResponse<>(true, "Pedidos del usuario", orderService.getOrdersByUser(userId));
    }

    @GetMapping("/my-orders")
    public ApiResponse<List<OrderResponseDTO>> getMyOrders() {
        User authenticatedUser = (User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        return new ApiResponse<>(
                true,
                "Mis pedidos",
                orderService.getOrdersByUser(authenticatedUser.getId())
        );
    }    

    @PutMapping("/{orderId}/cancel")
    public ApiResponse<OrderResponseDTO> cancelOrder(@PathVariable Long orderId) {
        return new ApiResponse<>(
                true,
                "Pedido cancelado correctamente",
                orderService.cancelOrder(orderId)
        );
    }    

    @PutMapping("/{orderId}/status")
    public ApiResponse<OrderResponseDTO> updateStatus(
            @PathVariable Long orderId,
            @RequestParam OrderStatus status) {

        return new ApiResponse<>(
                true,
                "Estado actualizado",
                orderService.updateOrderStatus(orderId, status)
        );
    }

    @PutMapping("/operational-close")
    public ApiResponse<Integer> closeDailyOperation() {
        int closedOrders = orderService.closeDailyOperation();

        return new ApiResponse<>(
                true,
                "Cierre operativo diario ejecutado correctamente",
                closedOrders
        );
    }
}