package com.campusorder.repository;

import com.campusorder.entity.CustomizationOption;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CustomizationOptionRepository extends JpaRepository<CustomizationOption, Long> {

    List<CustomizationOption> findAllByOrderByIdDesc();

    List<CustomizationOption> findByActiveTrueOrderByNameAsc();

    boolean existsByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);
}