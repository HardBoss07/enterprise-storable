import { useState, useEffect, useRef } from "react";
import { FileNode } from "@/types/api";
import { downloadFileAsBlob } from "@/lib/api/file";
import { useToast } from "@/context/ToastContext";
import { useConfirm } from "@/context/ConfirmContext";
import { useAuth } from "@/context/AuthContext";

interface UseFileListItemProps {
  node: FileNode;
  onDelete: (nodeId: number) => void;
  onRename: (nodeId: number, newName: string) => void;
  onCancelRename?: () => void;
  isInitialRenaming?: boolean;
}

/**
 * Custom hook for handling file list item logic.
 * Extracts download, delete, and rename functionality from the UI layer.
 *
 * @param {UseFileListItemProps} props - The hook properties.
 * @returns {object} State and handlers for the file list item.
 */
export function useFileListItem({
  node,
  onDelete,
  onRename,
  onCancelRename,
  isInitialRenaming,
}: UseFileListItemProps) {
  const { showToast } = useToast();
  const { confirm } = useConfirm();
  const { user } = useAuth();
  const [isRenaming, setIsRenaming] = useState(isInitialRenaming || false);
  const [newName, setNewName] = useState(node.name);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check if current user is owner
  const isOwner = user?.id === node.ownerId;

  useEffect(() => {
    if (isInitialRenaming) {
      setIsRenaming(true);
    }
  }, [isInitialRenaming]);

  useEffect(() => {
    if (isRenaming) {
      // Strip extension for base name editing if it's a file
      if (!node.folder) {
        const lastDotIndex = node.name.lastIndexOf(".");
        setNewName(
          lastDotIndex !== -1
            ? node.name.substring(0, lastDotIndex)
            : node.name,
        );
      } else {
        setNewName(node.name);
      }
      // Delay focus to ensure the element is rendered
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isRenaming, node.name, node.folder]);

  /**
   * Handles the file download operation.
   */
  const handleDownload = async () => {
    try {
      const blob = await downloadFileAsBlob(node.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = node.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showToast(`Started downloading ${node.name}`, "success");
    } catch (error) {
      console.error("Download failed:", error);
      showToast("Failed to download file. Please try again.", "error");
    }
  };

  /**
   * Handles the file deletion operation with confirmation.
   */
  const handleDelete = async () => {
    const confirmed = await confirm({
      title: "Delete Item",
      message: `Are you sure you want to delete ${node.name}? It will be moved to the trash.`,
      confirmLabel: "Delete",
      variant: "danger",
    });

    if (confirmed) {
      onDelete(node.id);
    }
  };

  /**
   * Submits the rename operation.
   */
  const submitRename = () => {
    if (newName.trim() && newName.trim() !== node.name) {
      onRename(node.id, newName.trim());
    }
    setIsRenaming(false);
    onCancelRename?.();
  };

  /**
   * Handles keyboard events for the rename input.
   * @param {React.KeyboardEvent} event - The keyboard event.
   */
  const handleRenameKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      submitRename();
    } else if (event.key === "Escape") {
      setIsRenaming(false);
      setNewName(node.name);
      onCancelRename?.();
    }
  };

  return {
    isRenaming,
    setIsRenaming,
    newName,
    setNewName,
    inputRef,
    isOwner,
    handleDownload,
    handleDelete,
    submitRename,
    handleRenameKeyDown,
  };
}
