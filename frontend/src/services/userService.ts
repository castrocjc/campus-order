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
}