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

                String productName = dto.getName().trim();

                if (productRepository.existsByNameIgnoreCase(productName)) {
                        throw new RuntimeException(
                                        "Ya existe un producto con el nombre: " + productName);
                }

                Product product = new Product();
                product.setName(productName);
                product.setDescription(
                        dto.getDescription() != null
                                ? dto.getDescription().trim()
                                : null
                );
                product.setPrice(dto.getPrice());
                product.setStock(dto.getStock());
                product.setImageUrl(
                        dto.getImageUrl() != null
                                ? dto.getImageUrl().trim()
                                : null
                );
                product.setCustomizable(
                                Boolean.TRUE.equals(dto.getCustomizable()));
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
                                product.getCategory().getId(),
                                product.getCategory().getName(),
                                product.getActive(),
                                product.getCustomizable());
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

                String productName = dto.getName().trim();

                if (
                productRepository.existsByNameIgnoreCaseAndIdNot(
                        productName,
                        productId
                )
                ) {
                throw new RuntimeException(
                        "Ya existe otro producto con el nombre: " + productName
                );
                }

                product.setName(productName);
                product.setDescription(
                        dto.getDescription() != null
                                ? dto.getDescription().trim()
                                : null
                );
                product.setPrice(dto.getPrice());
                product.setStock(dto.getStock());
                product.setImageUrl(
                        dto.getImageUrl() != null
                                ? dto.getImageUrl().trim()
                                : null
                );
                product.setCustomizable(
                                Boolean.TRUE.equals(dto.getCustomizable()));
                product.setCategory(category);

                Product updated = productRepository.save(product);

                return mapToDTO(updated);
        }

        public List<MenuResponseDTO> getMenu() {

                List<Product> products = productRepository.findByActiveTrue();

                return products.stream()
                                .collect(java.util.stream.Collectors.groupingBy(p -> p.getCategory().getName()))
                                .entrySet()
                                .stream()
                                .map(entry -> new MenuResponseDTO(
                                                entry.getKey(),
                                                entry.getValue().stream().map(this::mapToDTO).toList()))
                                .toList();
        }

        public ProductResponseDTO toggleProductActive(Long productId) {

                Product product = productRepository.findById(productId)
                                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

                product.setActive(!Boolean.TRUE.equals(product.getActive()));

                Product updated = productRepository.save(product);

                return mapToDTO(updated);
        }

        public List<ProductResponseDTO> getAllProductsAdmin() {
                return productRepository.findAllByOrderByIdDesc()
                                .stream()
                                .map(this::mapToDTO)
                                .toList();
        }
}