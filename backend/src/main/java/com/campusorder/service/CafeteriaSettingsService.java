package com.campusorder.service;

import com.campusorder.dto.CafeteriaScheduleDTO;
import com.campusorder.dto.CafeteriaSettingsRequestDTO;
import com.campusorder.dto.CafeteriaSettingsResponseDTO;
import com.campusorder.entity.CafeteriaSchedule;
import com.campusorder.entity.CafeteriaSettings;
import com.campusorder.repository.CafeteriaSettingsRepository;

import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.List;
import java.util.Set;

@Service
public class CafeteriaSettingsService {

    private static final Set<String> VALID_DAYS = Set.of(
            "MONDAY",
            "TUESDAY",
            "WEDNESDAY",
            "THURSDAY",
            "FRIDAY",
            "SATURDAY",
            "SUNDAY"
    );

    private final CafeteriaSettingsRepository cafeteriaSettingsRepository;

    public CafeteriaSettingsService(CafeteriaSettingsRepository cafeteriaSettingsRepository) {
        this.cafeteriaSettingsRepository = cafeteriaSettingsRepository;
    }

    public CafeteriaSettingsResponseDTO getSettings() {
        CafeteriaSettings settings = cafeteriaSettingsRepository.findFirstByOrderByIdAsc()
                .orElseThrow(() -> new RuntimeException("Configuración de cafetería no encontrada"));

        return mapToDTO(settings);
    }

    public CafeteriaSettingsResponseDTO updateSettings(CafeteriaSettingsRequestDTO dto) {
        CafeteriaSettings settings = cafeteriaSettingsRepository.findFirstByOrderByIdAsc()
                .orElseThrow(() -> new RuntimeException("Configuración de cafetería no encontrada"));

        validateSettings(dto);

        settings.setName(dto.getName().trim());
        settings.setDescription(normalize(dto.getDescription()));
        settings.setActive(dto.getActive());

        settings.setAddress(normalize(dto.getAddress()));
        settings.setReference(normalize(dto.getReference()));
        settings.setContactPhone(normalize(dto.getContactPhone()));

        settings.setTimezone(dto.getTimezone().trim());
        settings.setCurrency(dto.getCurrency().trim().toUpperCase());

        settings.setMinPreparationMinutes(dto.getMinPreparationMinutes());
        settings.setPickupIntervalMinutes(dto.getPickupIntervalMinutes());

        settings.getSchedules().clear();

        List<CafeteriaSchedule> schedules = dto.getSchedules()
                .stream()
                .map(scheduleDTO -> mapScheduleEntity(scheduleDTO, settings))
                .toList();

        settings.getSchedules().addAll(schedules);

        CafeteriaSettings updated = cafeteriaSettingsRepository.save(settings);

        return mapToDTO(updated);
    }

    private void validateSettings(CafeteriaSettingsRequestDTO dto) {
        if (dto.getName() == null || dto.getName().trim().isEmpty()) {
            throw new RuntimeException("El nombre de la cafetería es obligatorio.");
        }

        if (dto.getName().trim().length() < 3) {
            throw new RuntimeException("El nombre de la cafetería debe tener al menos 3 caracteres.");
        }

        if (dto.getName().trim().length() > 100) {
            throw new RuntimeException("El nombre de la cafetería no debe superar 100 caracteres.");
        }

        if (dto.getDescription() != null && dto.getDescription().trim().length() > 255) {
            throw new RuntimeException("La descripción no debe superar 255 caracteres.");
        }

        if (dto.getMinPreparationMinutes() == null || dto.getMinPreparationMinutes() < 1) {
            throw new RuntimeException("El tiempo mínimo de preparación debe ser mayor a cero.");
        }

        if (dto.getPickupIntervalMinutes() == null || dto.getPickupIntervalMinutes() < 1) {
            throw new RuntimeException("El intervalo de recojo debe ser mayor a cero.");
        }

        if (dto.getSchedules() == null || dto.getSchedules().size() != 7) {
            throw new RuntimeException("Debe configurar los 7 días de la semana.");
        }

        Set<String> receivedDays = dto.getSchedules()
                .stream()
                .map(schedule -> schedule.getDayOfWeek() != null
                        ? schedule.getDayOfWeek().trim().toUpperCase()
                        : "")
                .collect(java.util.stream.Collectors.toSet());

        if (!receivedDays.equals(VALID_DAYS)) {
            throw new RuntimeException("La configuración debe incluir exactamente los días de lunes a domingo.");
        }

        dto.getSchedules().forEach(this::validateSchedule);
    }

    private void validateSchedule(CafeteriaScheduleDTO schedule) {
        String dayOfWeek = schedule.getDayOfWeek() != null
                ? schedule.getDayOfWeek().trim().toUpperCase()
                : "";

        if (!VALID_DAYS.contains(dayOfWeek)) {
            throw new RuntimeException("Día de semana inválido: " + schedule.getDayOfWeek());
        }

        boolean closed = Boolean.TRUE.equals(schedule.getClosed());

        if (closed) {
            return;
        }

        LocalTime openingTime = schedule.getOpeningTime();
        LocalTime closingTime = schedule.getClosingTime();

        if (openingTime == null || closingTime == null) {
            throw new RuntimeException("Debe indicar hora de apertura y cierre para el día " + dayOfWeek);
        }

        if (!openingTime.isBefore(closingTime)) {
            throw new RuntimeException("La hora de apertura debe ser menor a la hora de cierre para el día " + dayOfWeek);
        }
    }

    private CafeteriaSchedule mapScheduleEntity(
            CafeteriaScheduleDTO dto,
            CafeteriaSettings settings
    ) {
        CafeteriaSchedule schedule = new CafeteriaSchedule();

        boolean closed = Boolean.TRUE.equals(dto.getClosed());

        schedule.setDayOfWeek(dto.getDayOfWeek().trim().toUpperCase());
        schedule.setClosed(closed);
        schedule.setOpeningTime(closed ? LocalTime.of(0, 0) : dto.getOpeningTime());
        schedule.setClosingTime(closed ? LocalTime.of(0, 0) : dto.getClosingTime());
        schedule.setCafeteriaSettings(settings);

        return schedule;
    }

    private CafeteriaSettingsResponseDTO mapToDTO(CafeteriaSettings settings) {
        List<CafeteriaScheduleDTO> schedules = settings.getSchedules()
                .stream()
                .map(schedule -> new CafeteriaScheduleDTO(
                        schedule.getId(),
                        schedule.getDayOfWeek(),
                        schedule.getOpeningTime(),
                        schedule.getClosingTime(),
                        schedule.getClosed()
                ))
                .toList();

        return new CafeteriaSettingsResponseDTO(
                settings.getId(),
                settings.getName(),
                settings.getDescription(),
                settings.getActive(),
                settings.getAddress(),
                settings.getReference(),
                settings.getContactPhone(),
                settings.getTimezone(),
                settings.getCurrency(),
                settings.getMinPreparationMinutes(),
                settings.getPickupIntervalMinutes(),
                schedules
        );
    }

    private String normalize(String value) {
        return value != null ? value.trim() : null;
    }
}