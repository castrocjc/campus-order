const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("Falta configurar EXPO_PUBLIC_API_URL");
}

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");

const isPublicEndpoint =
  endpoint === "/api/users" ||
  endpoint === "/api/auth/login" ||
  endpoint === "/api/users/verify-email" ||
  endpoint.startsWith("/api/users/resend-code");

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(!isPublicEndpoint && token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const text = await response.text();

  let result = null;

  try {
    result = text ? JSON.parse(text) : null;
  } catch (e) {
    result = { error: text || "Error desconocido" };
  }

  if (!response.ok) {

    console.log("API ERROR:", result);

    throw new Error(
      result?.message ||
      result?.error ||
      result?.details ||
      result?.reason ||
      text ||
      `Error en request: ${response.status}`
    );
  }

  return result;
}