package com.campusorder.repository;

import com.campusorder.entity.OrderStatusEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderStatusEventRepository
        extends JpaRepository<OrderStatusEvent, Long> {

        @Query("""
        SELECT e
        FROM OrderStatusEvent e
        JOIN FETCH e.order o
        WHERE o.createdAt BETWEEN :from AND :to
        ORDER BY o.id, e.eventDatetime, e.id
        """)
        List<OrderStatusEvent> findEventsForOrdersCreatedBetween(
                LocalDateTime from,
                LocalDateTime to
        );
}