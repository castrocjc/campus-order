package com.campusorder.controller;

import com.campusorder.dto.CafeteriaSettingsRequestDTO;
import com.campusorder.dto.CafeteriaSettingsResponseDTO;
import com.campusorder.dto.response.ApiResponse;
import com.campusorder.service.CafeteriaSettingsService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cafeteria-settings")
public class CafeteriaSettingsController {

    private final CafeteriaSettingsService cafeteriaSettingsService;

    public CafeteriaSettingsController(CafeteriaSettingsService cafeteriaSettingsService) {
        this.cafeteriaSettingsService = cafeteriaSettingsService;
    }

    @GetMapping
    public ApiResponse<CafeteriaSettingsResponseDTO> getSettings() {
        return new ApiResponse<>(
                true,
                "Configuración de cafetería obtenida correctamente",
                cafeteriaSettingsService.getSettings()
        );
    }

    @PutMapping
    public ApiResponse<CafeteriaSettingsResponseDTO> updateSettings(
            @Valid @RequestBody CafeteriaSettingsRequestDTO dto
    ) {
        return new ApiResponse<>(
                true,
                "Configuración de cafetería actualizada correctamente",
                cafeteriaSettingsService.updateSettings(dto)
        );
    }
}