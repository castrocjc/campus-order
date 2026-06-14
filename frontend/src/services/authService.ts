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

export async function forgotPassword(email: string) {
  const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const result = await response.json();

  if (!response.ok || result.success === false) {
    throw new Error(result.message || "Error solicitando recuperación");
  }

  return result;
}

export async function resetPassword(
  email: string,
  code: string,
  newPassword: string
) {
  const response = await fetch(`${API_URL}/api/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      code,
      newPassword,
    }),
  });

  const result = await response.json();

  if (!response.ok || result.success === false) {
    throw new Error(result.message || "Error actualizando contraseña");
  }

  return result;
}

export function saveAuthData(data: any) {
  localStorage.setItem("token", data.token);

  const decodedToken = decodeToken(data.token);
  console.log("TOKEN DECODIFICADO:", decodedToken);
  console.log("DATA LOGIN:", data);

  const userData = {
    ...decodedToken,
    ...data.user,
    name: data.user?.name || data.name || decodedToken?.name || "",
    email: data.user?.email || data.email || decodedToken?.sub || decodedToken?.email || "",
    role: data.user?.role || data.role || decodedToken?.role || "USER",
  };

  localStorage.setItem("user", JSON.stringify(userData));
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