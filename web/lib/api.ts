import { FileNode } from '@/types/FileNode';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/**
 * A simple wrapper around fetch to handle common API logic.
 * @param endpoint The API endpoint to call.
 * @param options Fetch options.
 * @returns The parsed JSON response.
 */
async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, options);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API request failed with status ${response.status}`);
  }

  return response.json();
}

/**
 * Fetches the children of a given file node.
 * @param nodeId The ID of the parent node, or null for the root.
 * @returns A list of child file nodes.
 */
export async function getFiles(nodeId: number | null): Promise<FileNode[]> {
  return apiRequest<FileNode[]>(`/api/files/${nodeId || 0}/children`);
}

/**
 * Fetches metadata for a single file node.
 * @param nodeId The ID of the node to fetch.
 * @returns The file node metadata.
 */
export async function getFileMetadata(nodeId: number): Promise<FileNode> {
  return apiRequest<FileNode>(`/api/files/${nodeId}`);
}

/**
 * Creates a new folder.
 * @param name The name of the new folder.
 * @param parentId The ID of the parent folder, or null for root.
 * @returns The newly created folder node.
 */
export async function createFolder(name: string, parentId: number | null): Promise<FileNode> {
  return apiRequest<FileNode>('/api/files/folders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, parentId: parentId || 0 }),
  });
}

/**
 * Uploads a file to a specific folder.
 * @param file The file object to upload.
 * @param parentId The ID of the destination folder, or null for root.
 * @returns The newly created file node.
 */
export async function uploadFile(file: File, parentId: number | null): Promise<FileNode> {
  const formData = new FormData();
  formData.append('file', file);
  if (parentId !== null) {
    formData.append('parentId', parentId.toString());
  }

  return apiRequest<FileNode>('/api/files/upload', {
    method: 'POST',
    body: formData,
  });
}

/**
 * Generates the download URL for a file.
 * @param nodeId The ID of the file to download.
 * @returns The full download URL.
 */
export function downloadFileUrl(nodeId: number): string {
  return `${API_BASE_URL}/api/files/${nodeId}/download`;
}
