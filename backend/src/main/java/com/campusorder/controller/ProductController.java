package com.campusorder.controller;

import com.campusorder.dto.MenuResponseDTO;
import com.campusorder.dto.ProductRequestDTO;
import com.campusorder.dto.ProductResponseDTO;
import com.campusorder.dto.response.ApiResponse;
import com.campusorder.service.ProductService;
import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;

import java.util.List;

@CrossOrigin(origins = "http://localhost:8082")
@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping
    public ApiResponse<ProductResponseDTO> createProduct(@Valid @RequestBody ProductRequestDTO dto) {
        return new ApiResponse<>(true, "Producto creado correctamente",
                productService.createProduct(dto));
    }

    @GetMapping
    public ApiResponse<List<ProductResponseDTO>> getAllProducts() {
        return new ApiResponse<>(true, "Lista de productos",
                productService.getAllProducts());
    }

    @DeleteMapping("/{productId}")
    public ApiResponse<String> deleteProduct(@PathVariable Long productId) {

        productService.deleteProduct(productId);

        return new ApiResponse<>(true, "Producto eliminado correctamente", null);
    }    

    @GetMapping("/paged")
    public ApiResponse<Page<ProductResponseDTO>> getProductsPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        return new ApiResponse<>(
                true,
                "Lista paginada de productos",
                productService.getProductsPaged(page, size)
        );
    }    

    @GetMapping("/search")
    public ApiResponse<Page<ProductResponseDTO>> searchProducts(
            @RequestParam String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        return new ApiResponse<>(
                true,
                "Resultados de búsqueda",
                productService.searchProducts(name, page, size)
        );
    }

    @PutMapping("/{productId}")
    public ApiResponse<ProductResponseDTO> updateProduct(
            @PathVariable Long productId,
            @Valid @RequestBody ProductRequestDTO dto) {

        return new ApiResponse<>(
                true,
                "Producto actualizado correctamente",
                productService.updateProduct(productId, dto)
        );
    }    

    @GetMapping("/menu")
    public ApiResponse<List<MenuResponseDTO>> getMenu() {

        return new ApiResponse<>(
                true,
                "Menú disponible",
                productService.getMenu()
        );
    }    
}