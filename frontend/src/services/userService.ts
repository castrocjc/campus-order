import { apiRequest } from "./apiClient";

export type UserRole = "USER" | "ADMIN" | "WORKER";

export type UserAdmin = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  emailVerified: boolean;
  verificationCode?: string | null;
  passwordResetCode?: string | null;
};

export type UserFormPayload = {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
};

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

export async function getUsers(): Promise<UserAdmin[]> {
  try {
    const result = await apiRequest("/api/users", {
      method: "GET",
    });

    return result.data || [];
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "No se pudo cargar la lista de usuarios."
    );
  }
}

export async function createAdminUser(payload: UserFormPayload): Promise<UserAdmin> {
  try {
    const result = await apiRequest("/api/users/admin", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return result.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "No se pudo crear el usuario."
    );
  }
}

export async function updateUser(
  id: number,
  payload: Omit<UserFormPayload, "password">
): Promise<UserAdmin> {
  try {
    const result = await apiRequest(`/api/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    return result.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "No se pudo actualizar el usuario."
    );
  }
}

export async function toggleUserActive(id: number): Promise<UserAdmin> {
  try {
    const result = await apiRequest(`/api/users/${id}/toggle-active`, {
      method: "PATCH",
    });

    return result.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "No se pudo cambiar el estado del usuario."
    );
  }
}

export async function resetUserPassword(id: number): Promise<string> {
  try {
    const result = await apiRequest(`/api/users/${id}/reset-password`, {
      method: "PATCH",
    });

    return result.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "No se pudo resetear la contraseña."
    );
  }
}