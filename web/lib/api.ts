import { FileNode } from '@/types/FileNode';

const API_BASE_URL = 'http://localhost:8080/api';

export async function getFiles(nodeId: number): Promise<FileNode[]> {
  const response = await fetch(`${API_BASE_URL}/files/${nodeId}/children`);
  if (!response.ok) {
    throw new Error('Failed to fetch files');
  }
  return response.json();
}

export async function getFileMetadata(nodeId: number): Promise<FileNode> {
    const response = await fetch(`${API_...
