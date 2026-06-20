package com.campusorder.service;

import com.campusorder.dto.CustomizationOptionRequestDTO;
import com.campusorder.dto.CustomizationOptionResponseDTO;
import com.campusorder.entity.CustomizationOption;
import com.campusorder.exception.BusinessException;
import com.campusorder.repository.CustomizationOptionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomizationOptionService {

    private final CustomizationOptionRepository customizationOptionRepository;

    public CustomizationOptionService(CustomizationOptionRepository customizationOptionRepository) {
        this.customizationOptionRepository = customizationOptionRepository;
    }

    public List<CustomizationOptionResponseDTO> getAllOptions() {
        return customizationOptionRepository.findAllByOrderByIdDesc()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    public List<CustomizationOptionResponseDTO> getActiveOptions() {
        return customizationOptionRepository.findByActiveTrueOrderByNameAsc()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    public CustomizationOptionResponseDTO createOption(CustomizationOptionRequestDTO dto) {
        String name = dto.getName().trim();

        if (customizationOptionRepository.existsByNameIgnoreCase(name)) {
            throw new BusinessException("Ya existe una opción de personalización con el nombre: " + name);
        }

        CustomizationOption option = new CustomizationOption();
        option.setName(name);
        option.setDescription(dto.getDescription() != null ? dto.getDescription().trim() : null);
        option.setActive(dto.getActive() == null || Boolean.TRUE.equals(dto.getActive()));

        CustomizationOption saved = customizationOptionRepository.save(option);

        return mapToDTO(saved);
    }

    public CustomizationOptionResponseDTO updateOption(Long optionId, CustomizationOptionRequestDTO dto) {
        CustomizationOption option = customizationOptionRepository.findById(optionId)
                .orElseThrow(() -> new BusinessException("Opción de personalización no encontrada"));

        String name = dto.getName().trim();

        if (customizationOptionRepository.existsByNameIgnoreCaseAndIdNot(name, optionId)) {
            throw new BusinessException("Ya existe otra opción de personalización con el nombre: " + name);
        }

        option.setName(name);
        option.setDescription(dto.getDescription() != null ? dto.getDescription().trim() : null);

        if (dto.getActive() != null) {
            option.setActive(dto.getActive());
        }

        CustomizationOption updated = customizationOptionRepository.save(option);

        return mapToDTO(updated);
    }

    public CustomizationOptionResponseDTO activateOption(Long optionId) {
        CustomizationOption option = customizationOptionRepository.findById(optionId)
                .orElseThrow(() -> new BusinessException("Opción de personalización no encontrada"));

        option.setActive(true);

        CustomizationOption updated = customizationOptionRepository.save(option);

        return mapToDTO(updated);
    }

    public CustomizationOptionResponseDTO deactivateOption(Long optionId) {
        CustomizationOption option = customizationOptionRepository.findById(optionId)
                .orElseThrow(() -> new BusinessException("Opción de personalización no encontrada"));

        option.setActive(false);

        CustomizationOption updated = customizationOptionRepository.save(option);

        return mapToDTO(updated);
    }

    private CustomizationOptionResponseDTO mapToDTO(CustomizationOption option) {
        return new CustomizationOptionResponseDTO(
                option.getId(),
                option.getName(),
                option.getDescription(),
                option.getActive()
        );
    }
}