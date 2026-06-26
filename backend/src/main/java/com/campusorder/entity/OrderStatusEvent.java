package com.campusorder.entity;

import com.campusorder.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "order_status_events")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderStatusEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Enumerated(EnumType.STRING)
    private OrderStatus previousStatus;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus newStatus;

    @Column(nullable = false)
    private LocalDateTime eventDatetime;

    private Long performedByUserId;

    private String performedByRole;

    @Column(nullable = false)
    private String source;

    private String remarks;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;    
}