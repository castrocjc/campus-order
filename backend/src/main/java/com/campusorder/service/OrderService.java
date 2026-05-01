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
import com.campusorder.repository.OrderRepository;
import com.campusorder.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.core.context.SecurityContextHolder;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository,
                        ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    public OrderResponseDTO createOrder(OrderRequestDTO dto) {

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
                throw new BusinessException("Stock insuficiente para el producto: " + product.getName());
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

    public OrderResponseDTO updateOrderStatus(Long orderId, OrderStatus status) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new BusinessException("Pedido no encontrado"));

        order.setStatus(status);

        return mapToDTO(orderRepository.save(order));
    }        

    private OrderResponseDTO mapToDTO(Order order) {

        List<OrderItemResponseDTO> itemDTOs = order.getItems()
                .stream()
                .map(item -> new OrderItemResponseDTO(
                        item.getProductId(),
                        item.getProductName(),
                        item.getQuantity(),
                        item.getUnitPrice(),
                        item.getSubtotal()
                ))
                .toList();

        return new OrderResponseDTO(
                order.getId(),
                order.getUserId(),
                order.getStatus(),
                order.getPickupTime(),
                order.getTotalAmount(),
                order.getCreatedAt(),
                itemDTOs
        );
    }

    public OrderResponseDTO cancelOrder(Long orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new BusinessException("Pedido no encontrado"));

        if (order.getStatus() != OrderStatus.RECEIVED) {
            throw new BusinessException("Solo se puede cancelar un pedido en estado RECEIVED");
        }

        order.setStatus(OrderStatus.CANCELLED);

        Order cancelledOrder = orderRepository.save(order);

        return mapToDTO(cancelledOrder);
    }    

    public List<Map<String, Object>> getSalesByDay() {
        return orderRepository.getSalesByDay()
                .stream()
                .map(row -> Map.of(
                        "date", row[0],
                        "total", row[1]
                ))
                .toList();
    }    
}