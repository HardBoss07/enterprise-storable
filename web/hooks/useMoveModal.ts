import { useState, useEffect } from "react";
import { FileNode } from "@/types/api";
import { getFileList, getFilePath, getHomeFolder } from "@/lib/api/file";
import { apiRequest } from "@/lib/api/client";

interface UseMoveModalProps {
  isOpen: boolean;
  nodeToMove: FileNode;
  onClose: () => void;
}

/**
 * Custom hook for handling move modal logic.
 * Extracts folder navigation and searching from the UI layer.
 *
 * @param {UseMoveModalProps} props - The hook properties.
 * @returns {object} State and handlers for the move modal.
 */
export function useMoveModal({
  isOpen,
  nodeToMove,
  onClose,
}: UseMoveModalProps) {
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
  const [folders, setFolders] = useState<FileNode[]>([]);
  const [path, setPath] = useState<FileNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<FileNode[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchHome();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  /**
   * Fetches the home folder and its children.
   */
  const fetchHome = async () => {
    setLoading(true);
    try {
      const home = await getHomeFolder();
      setCurrentFolderId(home.id);
      await fetchFolders(home.id);
    } catch (err) {
      console.error("Failed to fetch home folder:", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetches folders within a given parent.
   * @param {number | null} folderId - The ID of the folder to fetch.
   */
  const fetchFolders = async (folderId: number | null) => {
    setLoading(true);
    try {
      const children = await getFileList(folderId);
      // Only keep folders, and exclude the node itself (if it's a folder)
      setFolders(children.filter((f) => f.folder && f.id !== nodeToMove.id));

      const pathArr = await getFilePath(folderId || 0);
      setPath(pathArr);
    } catch (err) {
      console.error("Failed to fetch folders:", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles clicking on a folder to navigate deeper.
   * @param {number} folderId - The ID of the folder to navigate into.
   */
  const handleFolderClick = (folderId: number) => {
    setCurrentFolderId(folderId);
    fetchFolders(folderId);
    setSearchQuery("");
  };

  /**
   * Handles searching for folders.
   * @param {string} query - The search query.
   */
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const response = await apiRequest<FileNode[]>(
        `/api/files/search?query=${query}&kind=folder`,
      );
      setSearchResults(response.filter((f) => f.id !== nodeToMove.id));
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setSearching(false);
    }
  };

  return {
    currentFolderId,
    folders,
    path,
    loading,
    searchQuery,
    searchResults,
    searching,
    handleFolderClick,
    handleSearch,
    fetchHome,
  };
}
