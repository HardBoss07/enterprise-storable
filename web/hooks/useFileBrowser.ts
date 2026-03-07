'use client';

import { useState, useEffect, useCallback } from 'react';
import { FileNode } from '@/types/FileNode';
import { getFiles, getFileMetadata, createFolder, uploadFile } from '@/lib/api';

/**
 * Hook for managing the file browser state and operations.
 * @param initialFolderId The ID of the folder to open initially.
 * @returns State and functions for managing files and navigation.
 */
export function useFileBrowser(initialFolderId: number | null = null) {
  const [files, setFiles] = useState<FileNode[]>([]);
  const [path, setPath] = useState<FileNode[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(initialFolderId);

  /**
   * Fetches files and path metadata for the current folder.
   */
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const children = await getFiles(currentFolderId);
      setFiles(children);

      const pathArr: FileNode[] = [];
      let tempId: number | null = currentFolderId;

      while (tempId && tempId !== 0) {
        const node = await getFileMetadata(tempId);
        pathArr.unshift(node);
        tempId = node.parentId;
      }

      setPath(pathArr);
    } catch (err) {
      console.error('Error fetching file data:', err);
      setError('Failed to fetch file data.');
    } finally {
      setLoading(false);
    }
  }, [currentFolderId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /**
   * Navigates to a specific folder.
   * @param folderId The ID of the folder to navigate to.
   */
  const navigateToFolder = (folderId: number | null) => {
    setCurrentFolderId(folderId);
  };

  /**
   * Creates a new folder in the current directory.
   * @param name The name of the new folder.
   */
  const handleCreateFolder = async (name: string) => {
    try {
      await createFolder(name, currentFolderId);
      await fetchData();
    } catch (err) {
      console.error('Failed to create folder:', err);
      throw new Error('Failed to create folder');
    }
  };

  /**
   * Uploads a file to the current directory.
   * @param file The file to upload.
   */
  const handleUploadFile = async (file: File) => {
    try {
      setLoading(true);
      await uploadFile(file, currentFolderId);
      await fetchData();
    } catch (err) {
      console.error('Failed to upload file:', err);
      setLoading(false);
      throw new Error('Failed to upload file');
    }
  };

  return {
    files,
    path,
    loading,
    error,
    currentFolderId,
    navigateToFolder,
    refresh: fetchData,
    createFolder: handleCreateFolder,
    uploadFile: handleUploadFile,
  };
}
