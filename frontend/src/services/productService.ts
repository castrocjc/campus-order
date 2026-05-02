import { apiRequest } from "./apiClient";

export async function getMenu() {
  const result = await apiRequest("/api/products/menu");
  return result.data;
}

export async function getProductsAdmin() {
  const result = await apiRequest("/api/products/admin");
  return result.data;
}

export async function createProduct(payload: any) {
  const result = await apiRequest("/api/products", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return result.data;
}

export async function updateProduct(productId: number, payload: any) {
  const result = await apiRequest(`/api/products/${productId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  return result.data;
}

export async function toggleProductActive(productId: number) {
  const result = await apiRequest(`/api/products/${productId}/toggle-active`, {
    method: "PATCH",
  });

  return result.data;
}

export async function deleteProduct(productId: number) {
  const result = await apiRequest(`/api/products/${productId}`, {
    method: "DELETE",
  });

  return result.data;
}