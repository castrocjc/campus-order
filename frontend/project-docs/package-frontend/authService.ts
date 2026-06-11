const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("Falta configurar EXPO_PUBLIC_API_URL");
}

export async function loginUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const result = await response.json();

  if (!response.ok || result.success === false) {
    throw new Error(result.message || "Error en login");
  }

  return result.data;
}

export function saveAuthData(data: any) {
  localStorage.setItem("token", data.token);

  const decodedToken = decodeToken(data.token);
  console.log("TOKEN DECODIFICADO:", decodedToken);

  if (decodedToken) {
    localStorage.setItem("user", JSON.stringify(decodedToken));
  }
}

export function getToken() {
  return localStorage.getItem("token");
}

export function getUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function decodeToken(token: string) {
  try {
    const payload = token.split(".")[1];
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error("Error decodificando token", error);
    return null;
  }
}
