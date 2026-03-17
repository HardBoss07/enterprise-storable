"use client";

import { FileNode } from "@/types/api";
import { FileIcon } from "@/components/icons/FileIcon";
import { format } from "date-fns";
import {
  Download,
  Trash2,
  SquarePen,
  Copy,
  ArrowRightLeft,
  Star,
  ExternalLink,
} from "lucide-react";
import { downloadFileAsBlob } from "@/lib/api/file";
import { formatBytes } from "@/lib/utils";
import { IconButton } from "@/components/ui/IconButton";
import { useToast } from "@/context/ToastContext";
import { useConfirm } from "@/context/ConfirmContext";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface FileListItemProps {
  node: FileNode;
  onFolderClick: (folderId: number) => void;
  onDelete: (nodeId: number) => void;
  onRename: (nodeId: number, newName: string) => void;
  onDuplicate: (nodeId: number) => void;
  onMove: (nodeId: number) => void;
  onToggleFavorite?: (nodeId: number, isFavorite: boolean) => void;
  onJumpToLocation?: (parentId: number | null) => void;
  isInitialRenaming?: boolean;
  onCancelRename?: () => void;
}

/**
 * Renders a single row in the file list.
 * @param node The file or folder data.
 * @param onFolderClick Callback when a folder is clicked.
 * @param onDelete Callback when the delete button is clicked.
 */
export default function FileListItem({
  node,
  onFolderClick,
  onDelete,
  onRename,
  onDuplicate,
  onMove,
  onToggleFavorite,
  onJumpToLocation,
  isInitialRenaming,
  onCancelRename,
}: FileListItemProps) {
  const { showToast } = useToast();
  const { confirm } = useConfirm();
  const [isRenaming, setIsRenaming] = useState(isInitialRenaming || false);
  const [newName, setNewName] = useState(node.name);
  const inputRef = useRef<HTMLInputElement>(null);

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
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isRenaming, node.name, node.folder]);

  const handleClick = (e: React.MouseEvent) => {
    // Prevent click if we're clicking any action button or renaming
    if ((e.target as HTMLElement).closest(".action-btn") || isRenaming) {
      return;
    }

    if (node.folder) {
      onFolderClick(node.id);
    }
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const handleRenameClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRenaming(true);
  };

  const handleDuplicateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDuplicate(node.id);
  };

  const handleMoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMove(node.id);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(node.id, !node.isFavorite);
    }
  };

  const submitRename = () => {
    if (newName.trim() && newName.trim() !== node.name) {
      onRename(node.id, newName.trim());
    }
    setIsRenaming(false);
    onCancelRename?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      submitRename();
    } else if (e.key === "Escape") {
      setIsRenaming(false);
      setNewName(node.name);
      onCancelRename?.();
    }
  };

  return (
    <div
      className="flex items-center space-x-4 p-2 interactive-surface group"
      onClick={handleClick}
    >
      <div className="flex items-center justify-center w-10 h-10 flex-shrink-0">
        <FileIcon 
          extension={node.name.split(".").pop()} 
          mime={node.mime} 
          isFolder={node.folder} 
          size={22} 
        />
      </div>
      <div className="flex-1 min-w-0 flex items-center h-10">
        {isRenaming ? (
          <input
            ref={inputRef}
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={submitRename}
            className="input-field w-full max-w-sm h-8 py-0 px-2 text-sm border-primary focus:ring-primary/30"
          />
        ) : (
          <p className="text-text-primary font-bold m-0 truncate leading-none group-hover:text-primary transition-colors">
            {node.name}
          </p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <div className="hidden group-hover:flex px-2 space-x-1">
          <IconButton
            icon={Star}
            onClick={handleToggleFavorite}
            className={cn("action-btn", node.isFavorite ? "text-accent" : "text-text-muted hover:text-accent")}
            variant="ghost"
            size="sm"
            iconSize={14}
            title={node.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            iconProps={{ fill: node.isFavorite ? "currentColor" : "none" }}
          />
          {!node.folder && (
            <IconButton
              icon={Download}
              onClick={handleDownload}
              className="action-btn"
              variant="secondary"
              size="sm"
              iconSize={14}
              title="Download"
            />
          )}
          <IconButton
            icon={SquarePen}
            onClick={handleRenameClick}
            className="action-btn"
            variant="ghost"
            size="sm"
            iconSize={14}
            title="Rename"
          />
          {!node.folder && (
            <IconButton
              icon={Copy}
              onClick={handleDuplicateClick}
              className="action-btn"
              variant="ghost"
              size="sm"
              iconSize={14}
              title="Create Copy"
            />
          )}
          <IconButton
            icon={ArrowRightLeft}
            onClick={handleMoveClick}
            className="action-btn"
            variant="ghost"
            size="sm"
            iconSize={14}
            title="Move"
          />
          <IconButton
            icon={Trash2}
            onClick={handleDelete}
            className="action-btn text-red-500 hover:text-red-400"
            variant="ghost"
            size="sm"
            iconSize={14}
            title="Delete"
          />
          {onJumpToLocation && (
            <IconButton
              icon={ExternalLink}
              onClick={(e) => {
                e.stopPropagation();
                onJumpToLocation(node.parentId);
              }}
              className="action-btn text-blue-500"
              variant="ghost"
              size="sm"
              iconSize={14}
              title="Jump to Location"
            />
          )}
        </div>

        <div className="w-40 text-text-muted text-sm hidden sm:block">
          {format(new Date(node.modifiedAt), "MMM d, yyyy HH:mm")}
        </div>
        <div className="w-24 text-text-muted text-sm text-right">
          {!node.folder && node.size !== null ? formatBytes(node.size) : "--"}
        </div>
      </div>
    </div>
  );
}
