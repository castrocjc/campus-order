package com.campusorder.service;

import com.campusorder.entity.Category;
import com.campusorder.repository.CategoryRepository;
import com.campusorder.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public CategoryService(
            CategoryRepository categoryRepository,
            ProductRepository productRepository
    ) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    public Category createCategory(Category category) {
        String name = validateAndNormalizeName(category.getName());
        String description = validateAndNormalizeDescription(category.getDescription());

        if (categoryRepository.existsByNameIgnoreCase(name)) {
            throw new RuntimeException("Ya existe una categoría con el nombre: " + name);
        }

        Category newCategory = new Category();
        newCategory.setName(name);
        newCategory.setDescription(description);
        newCategory.setActive(true);

        return categoryRepository.save(newCategory);
    }

    public List<Category> getActiveCategories() {
        return categoryRepository.findByActiveTrueOrderByNameAsc();
    }

    public List<Category> getAllCategoriesAdmin() {
        return categoryRepository.findAllByOrderByNameAsc();
    }

    public Category updateCategory(Long categoryId, Category category) {
        Category existingCategory = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        String name = validateAndNormalizeName(category.getName());
        String description = validateAndNormalizeDescription(category.getDescription());

        if (categoryRepository.existsByNameIgnoreCaseAndIdNot(name, categoryId)) {
            throw new RuntimeException("Ya existe otra categoría con el nombre: " + name);
        }

        existingCategory.setName(name);
        existingCategory.setDescription(description);

        return categoryRepository.save(existingCategory);
    }

    public Category activateCategory(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        category.setActive(true);

        return categoryRepository.save(category);
    }

    public Category deactivateCategory(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        boolean hasActiveProducts = productRepository.existsByCategory_IdAndActiveTrue(categoryId);

        if (hasActiveProducts) {
            throw new RuntimeException(
                    "No se puede desactivar la categoría porque tiene productos activos asociados."
            );
        }

        category.setActive(false);

        return categoryRepository.save(category);
    }

    private String validateAndNormalizeName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new RuntimeException("El nombre de la categoría es obligatorio.");
        }

        String normalizedName = name.trim();

        if (normalizedName.length() < 3) {
            throw new RuntimeException("El nombre de la categoría debe tener al menos 3 caracteres.");
        }

        if (normalizedName.length() > 50) {
            throw new RuntimeException("El nombre de la categoría no debe superar 50 caracteres.");
        }

        return normalizedName;
    }

    private String validateAndNormalizeDescription(String description) {
        if (description == null) {
            return null;
        }

        String normalizedDescription = description.trim();

        if (normalizedDescription.length() > 150) {
            throw new RuntimeException("La descripción de la categoría no debe superar 150 caracteres.");
        }

        return normalizedDescription;
    }
}