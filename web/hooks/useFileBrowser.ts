"use client";

import { useState, useEffect, useCallback } from "react";
import { FileNode } from "@/types/api";
import {
  getFileList,
  createFolder,
  uploadFile,
  getFilePath,
  getHomeFolder,
  softDeleteNode,
  renameNode,
  duplicateFile,
  moveNode,
  toggleFavorite,
} from "@/lib/api/file";

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
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(
    initialFolderId,
  );
  const [homeFolderId, setHomeFolderId] = useState<number | null>(null);
  const [isCreatingFolder, setIsCreatingFolder] = useState<boolean>(false);

  /**
   * Fetches the home folder ID.
   */
  useEffect(() => {
    const fetchHome = async () => {
      try {
        const home = await getHomeFolder();
        setHomeFolderId(home.id);
        if (!currentFolderId) {
          setCurrentFolderId(home.id);
        }
      } catch (err) {
        console.error("Failed to fetch home folder:", err);
      }
    };
    fetchHome();
  }, []);

  /**
   * Fetches files and path metadata for the current folder.
   */
  const fetchData = useCallback(async () => {
    if (currentFolderId === null) return;
    setLoading(true);
    setError(null);
    try {
      const children = await getFileList(currentFolderId);
      setFiles(children);

      const pathArr = await getFilePath(currentFolderId);
      setPath(pathArr);
    } catch (err) {
      console.error("Error fetching file data:", err);
      setError("Failed to fetch file data.");
    } finally {
      setLoading(false);
      setIsCreatingFolder(false); // Reset when navigating/refreshing
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
    setCurrentFolderId(folderId || homeFolderId);
  };

  /**
   * Triggers the inline folder creation mode.
   */
  const triggerCreateFolder = () => {
    setIsCreatingFolder(true);
  };

  /**
   * Cancels the inline folder creation.
   */
  const cancelCreateFolder = () => {
    setIsCreatingFolder(false);
  };

  /**
   * Creates a new folder in the current directory.
   * @param name The name of the new folder.
   */
  const handleCreateFolder = async (name: string) => {
    try {
      await createFolder({ name, parentId: currentFolderId });
      setIsCreatingFolder(false);
      await fetchData();
    } catch (err) {
      console.error("Failed to create folder:", err);
      throw new Error("Failed to create folder");
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
      console.error("Failed to upload file:", err);
      setLoading(false);
      throw new Error("Failed to upload file");
    }
  };

  /**
   * Soft deletes a file node.
   * @param nodeId The ID of the node to delete.
   */
  const handleDelete = async (nodeId: number) => {
    try {
      await softDeleteNode(nodeId);
      await fetchData();
    } catch (err) {
      console.error("Failed to delete file:", err);
      throw new Error("Failed to delete file");
    }
  };

  /**
   * Renames a file node.
   * @param nodeId The ID of the node to rename.
   * @param newName The new name.
   */
  const handleRename = async (nodeId: number, newName: string) => {
    try {
      await renameNode(nodeId, newName);
      await fetchData();
    } catch (err) {
      console.error("Failed to rename file:", err);
      throw new Error("Failed to rename file");
    }
  };

  /**
   * Duplicates a file.
   * @param nodeId The ID of the file to duplicate.
   */
  const handleDuplicate = async (nodeId: number) => {
    try {
      const newNode = await duplicateFile(nodeId);
      await fetchData();
      return newNode;
    } catch (err) {
      console.error("Failed to duplicate file:", err);
      throw new Error("Failed to duplicate file");
    }
  };

  /**
   * Moves a node to a new destination.
   * @param nodeId The ID of the node to move.
   * @param targetParentId The ID of the destination folder.
   */
  const handleMove = async (nodeId: number, targetParentId: number | null) => {
    try {
      await moveNode(nodeId, targetParentId);
      await fetchData();
    } catch (err) {
      console.error("Failed to move file:", err);
      throw new Error("Failed to move file");
    }
  };

  /**
   * Toggles the favorite status of a node.
   * @param nodeId The ID of the node to toggle.
   * @param isFavorite The new favorite status.
   */
  const handleToggleFavorite = async (nodeId: number, isFavorite: boolean) => {
    try {
      await toggleFavorite(nodeId, isFavorite);
      // Optimistic update
      setFiles((prev) =>
        prev.map((f) => (f.id === nodeId ? { ...f, isFavorite } : f)),
      );
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
      throw new Error("Failed to toggle favorite");
    }
  };

  return {
    files,
    path,
    loading,
    error,
    currentFolderId,
    isCreatingFolder,
    navigateToFolder,
    triggerCreateFolder,
    cancelCreateFolder,
    refresh: fetchData,
    createFolder: handleCreateFolder,
    uploadFile: handleUploadFile,
    deleteFile: handleDelete,
    renameFile: handleRename,
    duplicateFile: handleDuplicate,
    moveFile: handleMove,
    toggleFavorite: handleToggleFavorite,
  };
}
