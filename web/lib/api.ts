import { FileNode } from '@/types/FileNode';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function getFiles(nodeId: number | null): Promise<FileNode[]> {
  const response = await fetch(`${API_BASE_URL}/api/files/${nodeId || 0}/children`);
  if (!response.ok) {
    throw new Error('Failed to fetch files');
  }
  return response.json();
}

export async function getFileMetadata(nodeId: number): Promise<FileNode> {
    const response = await fetch(`${API_BASE_URL}/api/files/${nodeId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch file metadata');
    }
    return response.json();
}

export async function createFolder(name: string, parentId: number | null): Promise<FileNode> {
    const response = await fetch(`${API_BASE_URL}/api/files/folders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, parentId: parentId || 0 }),
    });
    if (!response.ok) {
        throw new Error('Failed to create folder');
    }
    return response.json();
}

export async function uploadFile(file: File, parentId: number | null): Promise<FileNode> {
    const formData = new FormData();
    formData.append('file', file);
    if (parentId !== null) {
        formData.append('parentId', parentId.toString());
    }

    const response = await fetch(`${API_BASE_URL}/api/files/upload`, {
        method: 'POST',
        body: formData,
    });
    if (!response.ok) {
        throw new Error('Failed to upload file');
    }
    return response.json();
}

export function downloadFileUrl(nodeId: number): string {
    return `${API_BASE_URL}/api/files/${nodeId}/download`;
}
