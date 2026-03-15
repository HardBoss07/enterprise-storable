import { apiRequest } from "@/lib/api/client";
import { AuthResponse, LoginPayload, RegisterPayload } from "@/types/api";

/**
 * Authenticates a user with username and password.
 */
export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

/**
 * Registers a new user account.
 */
export async function registerUser(
  payload: RegisterPayload,
): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
