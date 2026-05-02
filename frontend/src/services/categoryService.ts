import { apiRequest } from "./apiClient";

export async function getCategories() {
  const result = await apiRequest("/api/categories");
  return result.data;
}