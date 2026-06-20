import { apiRequest } from "./apiClient";

export type CafeteriaSchedule = {
  id?: number;
  dayOfWeek: string;
  openingTime: string;
  closingTime: string;
  closed: boolean;
};

export type CafeteriaSettings = {
  id: number;
  name: string;
  description?: string;
  active: boolean;

  address?: string;
  reference?: string;
  contactPhone?: string;

  timezone: string;
  currency: string;

  minPreparationMinutes: number;
  pickupIntervalMinutes: number;

  schedules: CafeteriaSchedule[];
};

export async function getCafeteriaSettings(): Promise<CafeteriaSettings> {
  try {
    const result = await apiRequest("/api/cafeteria-settings");

    return result.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "No se pudo cargar la configuración de la cafetería."
    );
  }
}

export async function updateCafeteriaSettings(
  settings: CafeteriaSettings
): Promise<CafeteriaSettings> {
  try {
    const result = await apiRequest("/api/cafeteria-settings", {
      method: "PUT",
      body: JSON.stringify(settings),
    });

    return result.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "No se pudo guardar la configuración."
    );
  }
}