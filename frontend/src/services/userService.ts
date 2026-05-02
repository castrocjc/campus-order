const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function registerUser({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) {
  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
      role: "USER",
    }),
  });

  const result = await response.json();

  if (!response.ok || result.success === false) {
    throw new Error(result.message || "Error al registrar usuario");
  }

  return result.data;
}