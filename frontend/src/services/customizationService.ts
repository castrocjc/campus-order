import { apiRequest } from "./apiClient";

export async function getCustomizationOptions() {
  const result = await apiRequest("/api/customization-options");
  return result.data;
}

export async function getActiveCustomizationOptions() {
  const result = await apiRequest("/api/customization-options/active");
  return result.data;
}

export async function createCustomizationOption(option: {
  name: string;
  description?: string;
}) {
  const result = await apiRequest("/api/customization-options", {
    method: "POST",
    body: JSON.stringify(option),
  });

  return result.data;
}

export async function updateCustomizationOption(
  optionId: number,
  option: {
    name: string;
    description?: string;
  }
) {
  const result = await apiRequest(`/api/customization-options/${optionId}`, {
    method: "PUT",
    body: JSON.stringify(option),
  });

  return result.data;
}

export async function activateCustomizationOption(optionId: number) {
  const result = await apiRequest(
    `/api/customization-options/${optionId}/activate`,
    {
      method: "PATCH",
    }
  );

  return result.data;
}

export async function deactivateCustomizationOption(optionId: number) {
  const result = await apiRequest(
    `/api/customization-options/${optionId}/deactivate`,
    {
      method: "PATCH",
    }
  );

  return result.data;
}