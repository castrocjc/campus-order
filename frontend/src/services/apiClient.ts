const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("Falta configurar EXPO_PUBLIC_API_URL");
}

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  const result = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(
      result?.message || result?.error || `Error en request: ${response.status}`
    );
  }

  return result;
}