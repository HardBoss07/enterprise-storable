import { apiRequest, getApiBaseUrl, getToken } from "@/lib/api/client";
import { UserDto, GlobalSettingsDto, UpdateUserRolePayload } from "@/types/api";

/**
 * Retrieves all users (ADMIN only).
 */
export async function getUsers(): Promise<UserDto[]> {
  return apiRequest<UserDto[]>("/api/admin/users");
}

/**
 * Deletes a user and their data (ADMIN only).
 */
export async function removeUser(userId: string): Promise<void> {
  const token = getToken();
  const response = await fetch(`${getApiBaseUrl()}/api/admin/users/${userId}`, {
    method: "DELETE",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!response.ok) throw new Error("User deletion failed");
}

/**
 * Updates a user's role (ADMIN only).
 */
export async function changeUserRole(
  payload: UpdateUserRolePayload,
): Promise<void> {
  await apiRequest<void>(`/api/admin/users/${payload.userId}/role`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload.role),
  });
}

/**
 * Retrieves global system settings (ADMIN only).
 */
export async function getSettings(): Promise<GlobalSettingsDto> {
  return apiRequest<GlobalSettingsDto>("/api/admin/settings");
}

/**
 * Updates global system settings (ADMIN only).
 */
export async function updateSettings(
  settings: GlobalSettingsDto,
): Promise<void> {
  await apiRequest<void>("/api/admin/settings", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings),
  });
}

/**
 * Convenience function to update only trash retention (ADMIN only).
 */
export async function updateRetentionDays(days: number): Promise<void> {
  const current = await getSettings();
  await updateSettings({ ...current, trashRetentionDays: days });
}
