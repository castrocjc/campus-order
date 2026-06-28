package com.campusorder.controller;

import com.campusorder.dto.reports.OrdersByStatusDTO;
import com.campusorder.dto.reports.PeakHourDTO;
import com.campusorder.dto.reports.ReportSummaryDTO;
import com.campusorder.dto.reports.SalesByDayDTO;
import com.campusorder.dto.reports.TopProductDTO;
import com.campusorder.dto.reports.OperationalMetricsDTO;
import com.campusorder.dto.response.ApiResponse;
import com.campusorder.service.ReportsService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportsController {

        private final ReportsService reportsService;

        public ReportsController(ReportsService reportsService) {
                this.reportsService = reportsService;
        }

        @GetMapping("/summary")
        public ApiResponse<ReportSummaryDTO> getSummary(
                        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
                        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
                return new ApiResponse<>(
                                true,
                                "Resumen ejecutivo de reportes",
                                reportsService.getSummary(from, to));
        }

        @GetMapping("/sales-by-day")
        public ApiResponse<List<SalesByDayDTO>> getSalesByDay(
                        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
                        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
                return new ApiResponse<>(
                                true,
                                "Ventas por día",
                                reportsService.getSalesByDay(from, to));
        }

        @GetMapping("/orders-by-status")
        public ApiResponse<List<OrdersByStatusDTO>> getOrdersByStatus(
                        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
                        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
                return new ApiResponse<>(
                                true,
                                "Pedidos por estado",
                                reportsService.getOrdersByStatus(from, to));
        }

        @GetMapping("/top-products")
        public ApiResponse<List<TopProductDTO>> getTopProducts(
                        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
                        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
                        @RequestParam(defaultValue = "5") Integer limit) {
                return new ApiResponse<>(
                                true,
                                "Productos más vendidos",
                                reportsService.getTopProducts(from, to, limit));
        }

        @GetMapping("/peak-hours")
        public ApiResponse<List<PeakHourDTO>> getPeakHours(
                        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
                        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
                return new ApiResponse<>(
                                true,
                                "Horas pico",
                                reportsService.getPeakHours(from, to));
        }

        @GetMapping("/operational-metrics")
        public ApiResponse<OperationalMetricsDTO> getOperationalMetrics(
                        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
                        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
                return new ApiResponse<>(
                                true,
                                "Indicadores operativos",
                                reportsService.getOperationalMetrics(from, to));
        }
}