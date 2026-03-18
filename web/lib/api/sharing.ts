import { apiRequest } from "@/lib/api/client";
import { FileNode } from "@/types/api";

export type PrivilegeLevel = "VIEW" | "EDIT" | "OWNER";

export interface AccessPrivilege {
  id: number;
  nodeId: number;
  userId: string;
  username: string;
  email: string;
  level: PrivilegeLevel;
}

export interface UserLookup {
  id: string;
  username: string;
  email: string;
}

/**
 * Fetches all nodes shared with the current user.
 */
export async function getSharedWithMe(): Promise<FileNode[]> {
  return apiRequest<FileNode[]>("/api/sharing/shared-with-me");
}

/**
 * Looks up users by email or username.
 */
export async function lookupUsers(query: string): Promise<UserLookup[]> {
  return apiRequest<UserLookup[]>(
    `/api/sharing/users?query=${encodeURIComponent(query)}`,
  );
}

/**
 * Fetches all privileges for a node.
 */
export async function getNodePrivileges(
  nodeId: number,
): Promise<AccessPrivilege[]> {
  return apiRequest<AccessPrivilege[]>(
    `/api/sharing/nodes/${nodeId}/privileges`,
  );
}

/**
 * Shares a node with another user.
 */
export async function shareNode(
  nodeId: number,
  targetUserId: string,
  level: PrivilegeLevel,
): Promise<AccessPrivilege> {
  return apiRequest<AccessPrivilege>(`/api/sharing/nodes/${nodeId}/share`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ targetUserId, level }),
  });
}

/**
 * Updates an existing privilege.
 */
export async function updatePrivilege(
  nodeId: number,
  targetUserId: string,
  level: PrivilegeLevel,
): Promise<AccessPrivilege> {
  return apiRequest<AccessPrivilege>(
    `/api/sharing/nodes/${nodeId}/privileges/${targetUserId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetUserId, level }),
    },
  );
}

/**
 * Removes a privilege.
 */
export async function removePrivilege(
  nodeId: number,
  targetUserId: string,
): Promise<void> {
  return apiRequest<void>(
    `/api/sharing/nodes/${nodeId}/privileges/${targetUserId}`,
    {
      method: "DELETE",
    },
  );
}
