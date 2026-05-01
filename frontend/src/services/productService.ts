import { apiRequest } from "./apiClient";

export async function getMenu() {
  const result = await apiRequest("/api/products/menu");

  return result.data; // importante
}