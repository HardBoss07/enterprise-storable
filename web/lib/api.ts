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
  
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const headers = {
    ...options?.headers,
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  } as HeadersInit;

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    if (response.status === 401 && typeof window !== 'undefined') {
        // Redirect to login if unauthorized and client-side
        window.location.href = '/login';
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `API request failed with status ${response.status}`);
  }

  return response.json();
}

export interface AuthResponse {
    token: string;
    username: string;
    role: string;
}

export async function login(username: string, password: string): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
}

export async function register(username: string, email: string, password: string): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
    });
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
 * Fetches the home folder for the current user.
 * @returns The home folder node.
 */
export async function getHomeFolder(): Promise<FileNode> {
  return apiRequest<FileNode>('/api/files/home');
}

/**
 * Fetches the virtualized path for a given node.
 * @param nodeId The ID of the node.
 * @returns The list of nodes in the virtualized path.
 */
export async function getPath(nodeId: number): Promise<FileNode[]> {
  return apiRequest<FileNode[]>(`/api/files/${nodeId}/path`);
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
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  // If token required for download, passing via query param or using fetch+blob is needed.
  // Standard href download with Bearer token is tricky.
  // For now, let's assume query param or cookie? But API expects Header.
  // Option: Use a short-lived token in query param, or fetch blob in client and create object URL.
  // Let's implement fetch blob in component if needed, or update API to accept token in query param.
  // Updating API to accept token in query param is easiest for "direct download link".
  return `${API_BASE_URL}/api/files/${nodeId}/download`; 
}

// Helper to fetch blob with auth
export async function downloadFileBlob(nodeId: number): Promise<Blob> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const response = await fetch(`${API_BASE_URL}/api/files/${nodeId}/download`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    if (!response.ok) throw new Error('Download failed');
    return response.blob();
}
