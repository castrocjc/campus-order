package com.campusorder.repository;

import com.campusorder.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByActiveTrue();
    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);
    List<Product> findAllByOrderByIdDesc();
}