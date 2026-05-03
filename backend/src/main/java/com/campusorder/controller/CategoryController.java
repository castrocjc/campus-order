package com.campusorder.controller;

import com.campusorder.dto.response.ApiResponse;
import com.campusorder.entity.Category;
import com.campusorder.repository.CategoryRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryRepository categoryRepository;

    public CategoryController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @PostMapping
    public ApiResponse<Category> createCategory(@RequestBody Category category) {
        Category savedCategory = categoryRepository.save(category);
        return new ApiResponse<>(true, "Categoría creada correctamente", savedCategory);
    }

    @GetMapping
    public ApiResponse<List<Category>> getAllCategories() {
        return new ApiResponse<>(true, "Lista de categorías", categoryRepository.findAll());
    }
}