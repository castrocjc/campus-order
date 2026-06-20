package com.campusorder.controller;

import com.campusorder.dto.CustomizationOptionRequestDTO;
import com.campusorder.dto.CustomizationOptionResponseDTO;
import com.campusorder.dto.response.ApiResponse;
import com.campusorder.service.CustomizationOptionService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customization-options")
public class CustomizationOptionController {

    private final CustomizationOptionService customizationOptionService;

    public CustomizationOptionController(CustomizationOptionService customizationOptionService) {
        this.customizationOptionService = customizationOptionService;
    }

    @GetMapping
    public ApiResponse<List<CustomizationOptionResponseDTO>> getAllOptions() {
        return new ApiResponse<>(
                true,
                "Lista de opciones de personalización",
                customizationOptionService.getAllOptions()
        );
    }

    @GetMapping("/active")
    public ApiResponse<List<CustomizationOptionResponseDTO>> getActiveOptions() {
        return new ApiResponse<>(
                true,
                "Lista de opciones activas de personalización",
                customizationOptionService.getActiveOptions()
        );
    }

    @PostMapping
    public ApiResponse<CustomizationOptionResponseDTO> createOption(
            @Valid @RequestBody CustomizationOptionRequestDTO dto) {

        return new ApiResponse<>(
                true,
                "Opción de personalización creada correctamente",
                customizationOptionService.createOption(dto)
        );
    }

    @PutMapping("/{optionId}")
    public ApiResponse<CustomizationOptionResponseDTO> updateOption(
            @PathVariable Long optionId,
            @Valid @RequestBody CustomizationOptionRequestDTO dto) {

        return new ApiResponse<>(
                true,
                "Opción de personalización actualizada correctamente",
                customizationOptionService.updateOption(optionId, dto)
        );
    }

    @PatchMapping("/{optionId}/activate")
    public ApiResponse<CustomizationOptionResponseDTO> activateOption(
            @PathVariable Long optionId) {

        return new ApiResponse<>(
                true,
                "Opción de personalización activada correctamente",
                customizationOptionService.activateOption(optionId)
        );
    }

    @PatchMapping("/{optionId}/deactivate")
    public ApiResponse<CustomizationOptionResponseDTO> deactivateOption(
            @PathVariable Long optionId) {

        return new ApiResponse<>(
                true,
                "Opción de personalización desactivada correctamente",
                customizationOptionService.deactivateOption(optionId)
        );
    }
}