import { apiRequest, getApiBaseUrl, getToken } from "@/lib/api/client";
import { TrashItem } from "@/types/api";

/**
 * Fetches all items in the trash for the current user.
 */
export async function getTrashList(): Promise<TrashItem[]> {
  return apiRequest<TrashItem[]>("/api/files/trash");
}

/**
 * Permanently deletes a file node.
 */
export async function deleteNodePermanently(nodeId: number): Promise<void> {
  const token = getToken();
  const response = await fetch(
    `${getApiBaseUrl()}/api/files/${nodeId}/permanent`,
    {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    },
  );
  if (!response.ok) throw new Error("Permanent delete failed");
}

/**
 * Permanently empties the trash for the current user.
 */
export async function emptyTrashBin(): Promise<void> {
  const token = getToken();
  const response = await fetch(`${getApiBaseUrl()}/api/files/trash/empty`, {
    method: "DELETE",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!response.ok) throw new Error("Empty trash failed");
}

/**
 * Retrieves the current global trash retention days.
 */
export async function getTrashRetentionConfig(): Promise<number> {
  const token = getToken();
  const response = await fetch(`${getApiBaseUrl()}/api/files/trash/retention`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!response.ok) throw new Error("Failed to fetch public retention config");
  const data = await response.json();
  return data.days;
}
