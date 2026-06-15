import { apiRequest } from "./apiClient";

export async function getCategories() {
  const result = await apiRequest("/api/categories");
  return result.data;
}

export async function getCategoriesAdmin() {
  const result = await apiRequest("/api/categories/admin");
  return result.data;
}

export async function createCategory(category: {
  name: string;
  description?: string;
}) {
  const result = await apiRequest("/api/categories", {
    method: "POST",
    body: JSON.stringify(category),
  });

  return result.data;
}

export async function updateCategory(
  categoryId: number,
  category: {
    name: string;
    description?: string;
  }
) {
  const result = await apiRequest(`/api/categories/${categoryId}`, {
    method: "PUT",
    body: JSON.stringify(category),
  });

  return result.data;
}

export async function activateCategory(categoryId: number) {
  const result = await apiRequest(
    `/api/categories/${categoryId}/activate`,
    {
      method: "PATCH",
    }
  );

  return result.data;
}

export async function deactivateCategory(categoryId: number) {
  const result = await apiRequest(
    `/api/categories/${categoryId}/deactivate`,
    {
      method: "PATCH",
    }
  );

  return result.data;
}