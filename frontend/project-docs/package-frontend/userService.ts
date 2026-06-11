import { apiRequest } from "./apiClient";

export async function registerUser({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) {
  try {
    const result = await apiRequest("/api/users", {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        password,
        role: "USER",
      }),
    });

    return result.data;

  } catch (error: any) {

    throw new Error(
      error?.response?.data?.message ||
      error?.message ||
      "No se pudo crear la cuenta."
    );
  }
}

export async function verifyEmail({
  email,
  code,
}: {
  email: string;
  code: string;
}) {
  try {
    const result = await apiRequest("/api/users/verify-email", {
      method: "POST",
      body: JSON.stringify({
        email,
        code,
      }),
    });

    return result.data;

  } catch (error: any) {

    throw new Error(
      error?.response?.data?.message ||
      error?.message ||
      "No se pudo verificar el correo."
    );
  }
}

export async function resendVerificationCode(email: string) {
  try {
    const result = await apiRequest(
      `/api/users/resend-code?email=${encodeURIComponent(email)}`,
      {
        method: "POST",
      }
    );

    return result.data;

  } catch (error: any) {

    throw new Error(
      error?.response?.data?.message ||
      error?.message ||
      "No se pudo reenviar el código."
    );
  }
}