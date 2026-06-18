package com.campusorder.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.time.LocalTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "cafeteria_schedules")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CafeteriaSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String dayOfWeek;

    private LocalTime openingTime;
    private LocalTime closingTime;

    private Boolean closed = false;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "cafeteria_settings_id")
    private CafeteriaSettings cafeteriaSettings;
}