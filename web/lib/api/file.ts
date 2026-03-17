import { apiRequest, getApiBaseUrl, getToken } from "@/lib/api/client";
import { FileNode, CreateFolderPayload } from "@/types/api";

/**
 * Fetches the children of a given file node.
 * @param nodeId The ID of the parent node, or null for the root.
 */
export async function getFileList(nodeId: number | null): Promise<FileNode[]> {
  return apiRequest<FileNode[]>(`/api/files/${nodeId || 0}/children`);
}

/**
 * Fetches metadata for a single file node.
 */
export async function getFileMetadata(nodeId: number): Promise<FileNode> {
  return apiRequest<FileNode>(`/api/files/${nodeId}`);
}

/**
 * Fetches the home folder for the current user.
 */
export async function getHomeFolder(): Promise<FileNode> {
  return apiRequest<FileNode>("/api/files/home");
}

/**
 * Fetches the virtualized path for a given node.
 */
export async function getFilePath(nodeId: number): Promise<FileNode[]> {
  return apiRequest<FileNode[]>(`/api/files/${nodeId}/path`);
}

/**
 * Creates a new folder.
 */
export async function createFolder(
  payload: CreateFolderPayload,
): Promise<FileNode> {
  return apiRequest<FileNode>("/api/files/folders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: payload.name,
      parentId: payload.parentId || 0,
    }),
  });
}

/**
 * Uploads a file to a specific folder.
 */
export async function uploadFile(
  file: File,
  parentId: number | null,
): Promise<FileNode> {
  const formData = new FormData();
  formData.append("file", file);
  if (parentId !== null) {
    formData.append("parentId", parentId.toString());
  }

  return apiRequest<FileNode>("/api/files/upload", {
    method: "POST",
    body: formData,
  });
}

/**
 * Generates the download URL for a file.
 */
export function getDownloadUrl(nodeId: number): string {
  return `${getApiBaseUrl()}/api/files/${nodeId}/download`;
}

/**
 * Fetches a file as a Blob with authorization.
 */
export async function downloadFileAsBlob(nodeId: number): Promise<Blob> {
  const token = getToken();
  const response = await fetch(getDownloadUrl(nodeId), {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!response.ok) throw new Error("Download failed");
  return response.blob();
}

/**
 * Soft deletes a file node (moves to trash).
 */
export async function softDeleteNode(nodeId: number): Promise<void> {
  const token = getToken();
  const response = await fetch(`${getApiBaseUrl()}/api/files/${nodeId}`, {
    method: "DELETE",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!response.ok) throw new Error("Delete failed");
}

/**
 * Restores a file node from trash.
 */
export async function restoreNode(nodeId: number): Promise<void> {
  const token = getToken();
  const response = await fetch(
    `${getApiBaseUrl()}/api/files/${nodeId}/restore`,
    {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    },
  );
  if (!response.ok) throw new Error("Restore failed");
}

/**
 * Renames a file or folder.
 */
export async function renameNode(
  nodeId: number,
  newName: string,
): Promise<FileNode> {
  return apiRequest<FileNode>(`/api/files/${nodeId}/rename`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: newName }),
  });
}

/**
 * Creates a duplicate of a file.
 */
export async function duplicateFile(nodeId: number): Promise<FileNode> {
  return apiRequest<FileNode>(`/api/files/${nodeId}/duplicate`, {
    method: "POST",
  });
}

/**
 * Moves a file or folder to a new destination.
 */
export async function moveNode(
  nodeId: number,
  targetParentId: number | null,
): Promise<FileNode> {
  return apiRequest<FileNode>(`/api/files/${nodeId}/move`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ targetParentId: targetParentId || 0 }),
  });
}

/**
 * Fetches the 5 most recently modified files for the current user.
 */
export async function getRecentFiles(): Promise<FileNode[]> {
  return apiRequest<FileNode[]>("/api/files/recent");
}

/**
 * Fetches all favorite nodes for the current user.
 */
export async function getFavorites(): Promise<FileNode[]> {
  return apiRequest<FileNode[]>("/api/files/favorites");
}

/**
 * Toggles the favorite status of a node.
 */
export async function toggleFavorite(
  nodeId: number,
  isFavorite: boolean,
): Promise<FileNode> {
  return apiRequest<FileNode>(`/api/files/${nodeId}/favorite`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isFavorite }),
  });
}

/**
 * Searches for nodes by name and kind for a specific owner.
 */
export async function searchFiles(
  query: string,
  kind?: string,
): Promise<FileNode[]> {
  const params = new URLSearchParams({ query });
  if (kind) params.append("kind", kind);
  return apiRequest<FileNode[]>(`/api/files/search?${params.toString()}`);
}
