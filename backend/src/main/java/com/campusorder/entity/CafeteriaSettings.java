package com.campusorder.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "cafeteria_settings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CafeteriaSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private Boolean active = true;

    private String address;
    private String reference;
    private String contactPhone;

    private String timezone;
    private String currency;

    private Integer minPreparationMinutes;
    private Integer pickupIntervalMinutes;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "cafeteriaSettings", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CafeteriaSchedule> schedules;
}