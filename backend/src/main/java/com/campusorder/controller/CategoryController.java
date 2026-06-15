package com.campusorder.controller;

import com.campusorder.dto.response.ApiResponse;
import com.campusorder.entity.Category;
import com.campusorder.service.CategoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping
    public ApiResponse<Category> createCategory(@RequestBody Category category) {
        return new ApiResponse<>(
                true,
                "Categoría creada correctamente",
                categoryService.createCategory(category)
        );
    }

    @GetMapping
    public ApiResponse<List<Category>> getActiveCategories() {
        return new ApiResponse<>(
                true,
                "Lista de categorías activas",
                categoryService.getActiveCategories()
        );
    }

    @GetMapping("/admin")
    public ApiResponse<List<Category>> getAllCategoriesAdmin() {
        return new ApiResponse<>(
                true,
                "Lista completa de categorías",
                categoryService.getAllCategoriesAdmin()
        );
    }

    @PutMapping("/{categoryId}")
    public ApiResponse<Category> updateCategory(
            @PathVariable Long categoryId,
            @RequestBody Category category
    ) {
        return new ApiResponse<>(
                true,
                "Categoría actualizada correctamente",
                categoryService.updateCategory(categoryId, category)
        );
    }

    @PatchMapping("/{categoryId}/activate")
    public ApiResponse<Category> activateCategory(@PathVariable Long categoryId) {
        return new ApiResponse<>(
                true,
                "Categoría activada correctamente",
                categoryService.activateCategory(categoryId)
        );
    }

    @PatchMapping("/{categoryId}/deactivate")
    public ApiResponse<Category> deactivateCategory(@PathVariable Long categoryId) {
        return new ApiResponse<>(
                true,
                "Categoría desactivada correctamente",
                categoryService.deactivateCategory(categoryId)
        );
    }
}