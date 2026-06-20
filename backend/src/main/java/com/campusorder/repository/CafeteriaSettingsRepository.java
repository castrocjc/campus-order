package com.campusorder.repository;

import com.campusorder.entity.CafeteriaSettings;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CafeteriaSettingsRepository extends JpaRepository<CafeteriaSettings, Long> {

    Optional<CafeteriaSettings> findFirstByOrderByIdAsc();
}