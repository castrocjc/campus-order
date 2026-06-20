package com.campusorder.repository;

import com.campusorder.entity.CafeteriaSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CafeteriaScheduleRepository extends JpaRepository<CafeteriaSchedule, Long> {

    List<CafeteriaSchedule> findByCafeteriaSettings_IdOrderByIdAsc(Long cafeteriaSettingsId);

    Optional<CafeteriaSchedule> findByCafeteriaSettings_IdAndDayOfWeek(
            Long cafeteriaSettingsId,
            String dayOfWeek
    );

    Optional<CafeteriaSchedule> findByDayOfWeek(String dayOfWeek);
}