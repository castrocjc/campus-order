package com.campusorder.repository;

import com.campusorder.dto.reports.OrdersByStatusDTO;
import com.campusorder.dto.reports.PeakHourDTO;
import com.campusorder.dto.reports.SalesByDayDTO;
import com.campusorder.dto.reports.TopProductDTO;
import com.campusorder.entity.Order;
import com.campusorder.enums.OrderStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

        List<Order> findByUserId(Long userId);

        List<Order> findByPickupTimeBetweenOrderByPickupTimeDesc(
                        LocalDateTime start,
                        LocalDateTime end);

        @Query("""
                            SELECT DATE(o.createdAt),
                                COALESCE(SUM(o.totalAmount), 0)
                            FROM Order o
                            WHERE o.status = :status
                            AND o.createdAt BETWEEN :from AND :to
                            GROUP BY DATE(o.createdAt)
                            ORDER BY DATE(o.createdAt)
                        """)
        List<Object[]> getSalesByDay(
                        OrderStatus status,
                        LocalDateTime from,
                        LocalDateTime to);

        @Query("""
                            SELECT new com.campusorder.dto.reports.OrdersByStatusDTO(
                                CAST(o.status AS string),
                                COUNT(o)
                            )
                            FROM Order o
                            WHERE o.createdAt BETWEEN :from AND :to
                            GROUP BY o.status
                        """)
        List<OrdersByStatusDTO> getOrdersByStatus(
                        LocalDateTime from,
                        LocalDateTime to);

        @Query("""
                            SELECT new com.campusorder.dto.reports.TopProductDTO(
                                item.productId,
                                item.productName,
                                SUM(item.quantity),
                                COALESCE(SUM(item.subtotal), 0)
                            )
                            FROM Order o
                            JOIN o.items item
                            WHERE o.status = :status
                              AND o.createdAt BETWEEN :from AND :to
                            GROUP BY item.productId, item.productName
                            ORDER BY SUM(item.quantity) DESC, SUM(item.subtotal) DESC
                        """)
        List<TopProductDTO> getTopProducts(
                        OrderStatus status,
                        LocalDateTime from,
                        LocalDateTime to,
                        Pageable pageable);

        @Query("""
                            SELECT new com.campusorder.dto.reports.PeakHourDTO(
                                HOUR(o.createdAt),
                                COUNT(o)
                            )
                            FROM Order o
                            WHERE o.createdAt BETWEEN :from AND :to
                            GROUP BY HOUR(o.createdAt)
                            ORDER BY COUNT(o) DESC
                        """)
        List<PeakHourDTO> getPeakHours(
                        LocalDateTime from,
                        LocalDateTime to);

        @Query("""
                            SELECT COALESCE(SUM(o.totalAmount), 0)
                            FROM Order o
                            WHERE o.status = :status
                              AND o.createdAt BETWEEN :from AND :to
                        """)
        BigDecimal getTotalSales(
                        OrderStatus status,
                        LocalDateTime from,
                        LocalDateTime to);

        @Query("""
                            SELECT COUNT(o)
                            FROM Order o
                            WHERE o.createdAt BETWEEN :from AND :to
                        """)
        Long countOrdersByDateRange(
                        LocalDateTime from,
                        LocalDateTime to);

        @Query("""
                            SELECT COUNT(o)
                            FROM Order o
                            WHERE o.status = :status
                              AND o.createdAt BETWEEN :from AND :to
                        """)
        Long countOrdersByStatusAndDateRange(
                        OrderStatus status,
                        LocalDateTime from,
                        LocalDateTime to);

        @Query("""
                            SELECT COALESCE(SUM(item.quantity), 0)
                            FROM Order o
                            JOIN o.items item
                            WHERE o.status = :status
                              AND o.createdAt BETWEEN :from AND :to
                        """)
        Long countProductsSold(
                        OrderStatus status,
                        LocalDateTime from,
                        LocalDateTime to);

        List<Order> findByPickupTimeBetweenAndStatusIn(
                LocalDateTime start,
                LocalDateTime end,
                List<OrderStatus> statuses);
}