"use client";

import { FileNode } from "@/types/api";
import { FileIcon } from "@/components/ui/FileIcon";
import { format } from "date-fns";
import {
  Download,
  Trash2,
  SquarePen,
  Copy,
  ArrowRightLeft,
  Star,
  ExternalLink,
  Share2,
} from "lucide-react";
import { formatBytes } from "@/lib/utils";
import { IconButton } from "@/components/ui/IconButton";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { cn } from "@/lib/utils";
import { useFileListItem } from "@/hooks/useFileListItem";

interface FileListItemProps {
  /** The file or folder node data. */
  node: FileNode;
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
  /** Whether the node should start in renaming mode. */
  isInitialRenaming?: boolean;
  /** Optional callback when renaming is cancelled. */
  onCancelRename?: () => void;
}

/**
 * Molecule/Organism: Renders a single row in the file list.
 * Combines FileIcon (Atom), Name (Text), StatusBadge (Molecule), and Action buttons (Atoms).
 *
 * @param {FileListItemProps} props - The component props.
 * @returns {JSX.Element} The rendered FileListItem component.
 */
export function FileListItem({
  node,
  onFolderClick,
  onDelete,
  onRename,
  onDuplicate,
  onMove,
  onShare,
  onToggleFavorite,
  onJumpToLocation,
  isInitialRenaming,
  onCancelRename,
}: FileListItemProps) {
  const {
    isRenaming,
    setIsRenaming,
    newName,
    setNewName,
    inputRef,
    handleDownload,
    handleDelete,
    submitRename,
    handleRenameKeyDown,
  } = useFileListItem({
    node,
    onDelete,
    onRename,
    onCancelRename,
    isInitialRenaming,
  });

  /**
   * Handles the click event on the file list item.
   * @param {React.MouseEvent} event - The click event.
   */
  const handleClick = (event: React.MouseEvent) => {
    // Prevent click if we're clicking any action button or renaming
    if ((event.target as HTMLElement).closest(".action-btn") || isRenaming) {
      return;
    }

    if (node.folder) {
      onFolderClick(node.id);
    }
  };

  /**
   * Wrapper for the toggle favorite action to prevent event propagation.
   * @param {React.MouseEvent} event - The click event.
   */
  const handleToggleFavorite = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(node.id, !node.isFavorite);
    }
  };

  /**
   * Wrapper for download action to prevent event propagation.
   * @param {React.MouseEvent} event - The click event.
   */
  const onDownloadClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    handleDownload();
  };

  /**
   * Wrapper for delete action to prevent event propagation.
   * @param {React.MouseEvent} event - The click event.
   */
  const onDeleteClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    handleDelete();
  };

  // Permission checks
  const canEdit = node.privilege === "EDIT" || node.privilege === "OWNER";
  const canManage = node.privilege === "OWNER";
  const isRootLevel = node.parentId === 1;

  // Map privileges to UI labels
  const privilegeLabels = {
    VIEW: "Read Only",
    EDIT: "Editor",
    OWNER: "Owner",
  };

  const privilegeColors = {
    VIEW: "info" as const,
    EDIT: "warning" as const,
    OWNER: "success" as const,
  };

  return (
    <div
      className="group flex items-center space-x-4 p-2 interactive-surface"
      onClick={handleClick}
    >
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center">
        <FileIcon
          extension={node.name.split(".").pop()}
          mime={node.mime}
          isFolder={node.folder}
          size={22}
        />
      </div>
      <div className="flex h-10 flex-1 items-center min-w-0">
        {isRenaming ? (
          <input
            ref={inputRef}
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={handleRenameKeyDown}
            onBlur={submitRename}
            className="input-field h-8 w-full max-w-sm border-primary px-2 py-0 text-sm focus:ring-primary/30"
          />
        ) : (
          <div className="flex items-center space-x-2 truncate">
            <p className="m-0 truncate font-bold leading-none text-text-primary transition-colors group-hover:text-primary">
              {node.name}
            </p>
            {node.privilege && node.privilege !== "OWNER" && (
              <StatusBadge
                variant={privilegeColors[node.privilege]}
                className="h-4 px-1.5 py-0 text-[10px]"
              >
                {privilegeLabels[node.privilege]}
              </StatusBadge>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <div className="hidden space-x-1 px-2 group-hover:flex">
          <IconButton
            icon={Star}
            onClick={handleToggleFavorite}
            className={cn(
              "action-btn",
              node.isFavorite
                ? "text-accent"
                : "text-text-muted hover:text-accent",
            )}
            variant="ghost"
            size="sm"
            iconSize={14}
            title={
              node.isFavorite ? "Remove from Favorites" : "Add to Favorites"
            }
            iconProps={{ fill: node.isFavorite ? "currentColor" : "none" }}
          />
          {!node.folder && (
            <IconButton
              icon={Download}
              onClick={onDownloadClick}
              className="action-btn"
              variant="secondary"
              size="sm"
              iconSize={14}
              title="Download"
            />
          )}
          {canEdit && !isRootLevel && (
            <IconButton
              icon={SquarePen}
              onClick={(e) => {
                e.stopPropagation();
                setIsRenaming(true);
              }}
              className="action-btn"
              variant="ghost"
              size="sm"
              iconSize={14}
              title="Rename"
            />
          )}
          {!node.folder && canEdit && (
            <IconButton
              icon={Copy}
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate(node.id);
              }}
              className="action-btn"
              variant="ghost"
              size="sm"
              iconSize={14}
              title="Create Copy"
            />
          )}
          {canEdit && !isRootLevel && (
            <IconButton
              icon={ArrowRightLeft}
              onClick={(e) => {
                e.stopPropagation();
                onMove(node.id);
              }}
              className="action-btn"
              variant="ghost"
              size="sm"
              iconSize={14}
              title="Move"
            />
          )}
          {canManage && onShare && (
            <IconButton
              icon={Share2}
              onClick={(e) => {
                e.stopPropagation();
                onShare(node);
              }}
              className="action-btn text-primary"
              variant="ghost"
              size="sm"
              iconSize={14}
              title="Share"
            />
          )}
          {canManage && !isRootLevel && (
            <IconButton
              icon={Trash2}
              onClick={onDeleteClick}
              className="action-btn text-red-500 hover:text-red-400"
              variant="ghost"
              size="sm"
              iconSize={14}
              title="Delete"
            />
          )}
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

        <div className="hidden w-40 text-sm text-text-muted sm:block">
          {format(new Date(node.modifiedAt), "MMM d, yyyy HH:mm")}
        </div>
        <div className="w-24 text-right text-sm text-text-muted">
          {!node.folder && node.size !== null ? formatBytes(node.size) : "--"}
        </div>
      </div>
    </div>
  );
}

export default FileListItem;
