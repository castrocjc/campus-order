package com.campusorder.repository;

import com.campusorder.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserId(Long userId);

    @Query("""
        SELECT DATE(o.createdAt), SUM(o.totalAmount)
        FROM Order o
        WHERE o.status = 'DELIVERED'
        GROUP BY DATE(o.createdAt)
    """)
    List<Object[]> getSalesByDay();
}