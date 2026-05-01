package com.campusorder.service;

import com.campusorder.dto.MenuResponseDTO;
import com.campusorder.dto.ProductRequestDTO;
import com.campusorder.dto.ProductResponseDTO;
import com.campusorder.entity.Category;
import com.campusorder.entity.Product;
import com.campusorder.repository.CategoryRepository;
import com.campusorder.repository.ProductRepository;

import org.springframework.stereotype.Service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductService(ProductRepository productRepository,
                          CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    public ProductResponseDTO createProduct(ProductRequestDTO dto) {

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        Product product = new Product();
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setStock(dto.getStock());
        product.setImageUrl(dto.getImageUrl());
        product.setCategory(category);

        Product saved = productRepository.save(product);

        return mapToDTO(saved);
    }

    public List<ProductResponseDTO> getAllProducts() {
        return productRepository.findByActiveTrue()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    private ProductResponseDTO mapToDTO(Product product) {
        return new ProductResponseDTO(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getStock(),
                product.getImageUrl(),
                product.getCategory().getName()
        );
    }

    public void deleteProduct(Long productId) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        product.setActive(false);
        productRepository.save(product);
    }    

    public Page<ProductResponseDTO> getProductsPaged(int page, int size) {

        Pageable pageable = PageRequest.of(page, size);

        return productRepository.findAll(pageable)
                .map(this::mapToDTO);
    }    

    public Page<ProductResponseDTO> searchProducts(String name, int page, int size) {

        Pageable pageable = PageRequest.of(page, size);

        return productRepository.findByNameContainingIgnoreCase(name, pageable)
                .map(this::mapToDTO);
    }    

    public ProductResponseDTO updateProduct(Long productId, ProductRequestDTO dto) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setStock(dto.getStock());
        product.setImageUrl(dto.getImageUrl());
        product.setCategory(category);

        Product updated = productRepository.save(product);

        return mapToDTO(updated);
    }    

    public List<MenuResponseDTO> getMenu() {

        List<Product> products = productRepository.findAll();

        return products.stream()
                .collect(java.util.stream.Collectors.groupingBy(p -> p.getCategory().getName()))
                .entrySet()
                .stream()
                .map(entry -> new MenuResponseDTO(
                        entry.getKey(),
                        entry.getValue().stream().map(this::mapToDTO).toList()
                ))
                .toList();
    }
}