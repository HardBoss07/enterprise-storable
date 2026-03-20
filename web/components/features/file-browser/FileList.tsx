"use client";

import { FileNode } from "@/types/api";
import { FileListItem } from "./FileListItem";
import { useMemo, useState, useEffect, useRef } from "react";
import { FileIcon } from "@/components/ui/FileIcon";
import { cn } from "@/lib/utils";

interface FileListProps {
  /** The list of file nodes to display. */
  files: FileNode[];
  /** Callback function when a folder is clicked. */
  onFolderClick: (folderId: number) => void;
  /** Callback function when a node is deleted. */
  onDelete: (nodeId: number) => void;
  /** Callback function when a node is renamed. */
  onRename: (nodeId: number, newName: string) => void;
  /** Callback function when a node is duplicated. */
  onDuplicate: (nodeId: number) => void;
  /** Callback function when a node is moved. */
  onMove: (nodeId: number) => void;
  /** Optional callback function when a node is shared. */
  onShare?: (node: FileNode) => void;
  /** Optional callback function when a node is toggled as favorite. */
  onToggleFavorite?: (nodeId: number, isFavorite: boolean) => void;
  /** Optional callback function to jump to the node's location. */
  onJumpToLocation?: (parentId: number | null) => void;
  /** Whether the UI for creating a new folder should be shown. */
  isCreatingFolder?: boolean;
  /** Callback function when a new folder is created. */
  onCreateFolder?: (name: string) => void;
  /** Callback function when folder creation is cancelled. */
  onCancelCreateFolder?: () => void;
  /** The ID of the node currently being renamed. */
  renamingNodeId?: number | null;
  /** Callback function when renaming is cancelled. */
  onCancelRename?: () => void;
}

/**
 * Organism: Renders a list of files and folders with sorting.
 * Manages the display of multiple FileListItems and the new folder creation state.
 *
 * @param {FileListProps} props - The component props.
 * @returns {JSX.Element} The rendered FileList component.
 */
export function FileList({
  files,
  onFolderClick,
  onDelete,
  onRename,
  onDuplicate,
  onMove,
  onShare,
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

  /**
   * Handles keyboard events for the new folder input.
   * @param {React.KeyboardEvent} event - The keyboard event.
   */
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && newFolderName.trim()) {
      onCreateFolder?.(newFolderName.trim());
    } else if (event.key === "Escape") {
      onCancelCreateFolder?.();
    }
  };

  /**
   * Sorts files: Folders first, then alphabetically.
   * Memoized to prevent unnecessary re-sorts.
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
        <div className="ml-10 min-w-0 flex-1">Name</div>
        <div className="hidden w-40 sm:block">Last Modified</div>
        <div className="w-24 text-right">File Size</div>
      </div>

      {isCreatingFolder && (
        <div className="flex animate-pulse items-center space-x-4 rounded-lg border border-primary/20 bg-primary/10 p-2">
          <div className="flex h-10 w-10 items-center justify-center">
            <FileIcon isFolder={true} size={22} />
          </div>
          <div className="min-w-0 flex-1">
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
          <div className="hidden w-40 sm:block" />
          <div className="w-24 text-right text-text-muted">--</div>
        </div>
      )}

      {sortedFiles.length === 0 && !isCreatingFolder ? (
        <div className="flex h-48 flex-col items-center justify-center text-text-muted">
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
            onShare={onShare}
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

export default FileList;
