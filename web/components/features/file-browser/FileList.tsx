"use client";

import { FileNode } from "@/types/api";
import FileListItem from "./FileListItem";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

import { FileIcon } from "@/components/icons/FileIcon";
import { useState, useEffect, useRef } from "react";

interface FileListProps {
  files: FileNode[];
  onFolderClick: (folderId: number) => void;
  onDelete: (nodeId: number) => void;
  onRename: (nodeId: number, newName: string) => void;
  onDuplicate: (nodeId: number) => void;
  onMove: (nodeId: number) => void;
  onToggleFavorite?: (nodeId: number, isFavorite: boolean) => void;
  onJumpToLocation?: (parentId: number | null) => void;
  isCreatingFolder?: boolean;
  onCreateFolder?: (name: string) => void;
  onCancelCreateFolder?: () => void;
  renamingNodeId?: number | null;
  onCancelRename?: () => void;
}

/**
 * Renders a list of files and folders with sorting.
 * @param files The list of file nodes to display.
 * @param onFolderClick Callback when a folder is clicked.
 * @param onDelete Callback when a node is deleted.
 */
export default function FileList({
  files,
  onFolderClick,
  onDelete,
  onRename,
  onDuplicate,
  onMove,
  onToggleFavorite,
  onJumpToLocation,
  isCreatingFolder,
  onCreateFolder,
  onCancelCreateFolder,
  renamingNodeId,
  onCancelRename,
}: FileListProps) {
  const [newFolderName, setNewFolderName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCreatingFolder) {
      setNewFolderName("");
      inputRef.current?.focus();
    }
  }, [isCreatingFolder]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newFolderName.trim()) {
      onCreateFolder?.(newFolderName.trim());
    } else if (e.key === "Escape") {
      onCancelCreateFolder?.();
    }
  };

  /**
   * Sorts files: Folders first, then alphabetically.
   */
  const sortedFiles = useMemo(() => {
    return [...files].sort((a, b) => {
      // 1. Folders before files
      if (a.folder && !b.folder) return -1;
      if (!a.folder && b.folder) return 1;

      // 2. Alphabetical order (case-insensitive)
      return a.name.localeCompare(b.name, undefined, {
        numeric: true,
        sensitivity: "base",
      });
    });
  }, [files]);

  return (
    <div className="space-y-1">
      <div className="list-header">
        <div className="flex-1 min-w-0 ml-10">Name</div>
        <div className="w-40 hidden sm:block">Last Modified</div>
        <div className="w-24 text-right">File Size</div>
      </div>

      {isCreatingFolder && (
        <div className="flex items-center space-x-4 p-2 bg-primary/10 border border-primary/20 rounded-lg animate-pulse">
          <div className="flex items-center justify-center w-10 h-10">
            <FileIcon isFolder={true} size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <input
              ref={inputRef}
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => !newFolderName.trim() && onCancelCreateFolder?.()}
              placeholder="Folder name..."
              className="input-field w-full max-w-sm"
            />
          </div>
          <div className="hidden sm:block w-40" />
          <div className="w-24 text-right text-text-muted">--</div>
        </div>
      )}

      {sortedFiles.length === 0 && !isCreatingFolder ? (
        <div className="flex flex-col items-center justify-center h-48 text-text-muted italic">
          <p>This folder is empty</p>
        </div>
      ) : (
        sortedFiles.map((file) => (
          <FileListItem
            key={file.id}
            node={file}
            onFolderClick={onFolderClick}
            onDelete={onDelete}
            onRename={onRename}
            onDuplicate={onDuplicate}
            onMove={onMove}
            onToggleFavorite={onToggleFavorite}
            onJumpToLocation={onJumpToLocation}
            isInitialRenaming={renamingNodeId === file.id}
            onCancelRename={onCancelRename}
          />
        ))
      )}
    </div>
  );
}
