import { apiRequest } from "./apiClient";

export async function getReportSummary(
  from: string,
  to: string
) {
  const result = await apiRequest(
    `/api/reports/summary?from=${from}&to=${to}`
  );

  return result.data;
}

export async function getSalesByDay(
  from: string,
  to: string
) {
  const result = await apiRequest(
    `/api/reports/sales-by-day?from=${from}&to=${to}`
  );

  return result.data;
}

export async function getOrdersByStatus(
  from: string,
  to: string
) {
  const result = await apiRequest(
    `/api/reports/orders-by-status?from=${from}&to=${to}`
  );

  return result.data;
}

export async function getTopProducts(
  from: string,
  to: string,
  limit = 10
) {
  const result = await apiRequest(
    `/api/reports/top-products?from=${from}&to=${to}&limit=${limit}`
  );

  return result.data;
}

export async function getPeakHours(
  from: string,
  to: string
) {
  const result = await apiRequest(
    `/api/reports/peak-hours?from=${from}&to=${to}`
  );

  return result.data;
}

export async function getOperationalMetrics(
  from: string,
  to: string
) {
  const result = await apiRequest(
    `/api/reports/operational-metrics?from=${from}&to=${to}`
  );

  return result.data;
}