"use client";

import { FileNode } from "@/types/api";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Search, ChevronRight, X, Folder, Home } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
import { useMoveModal } from "@/hooks/useMoveModal";
import { cn } from "@/lib/utils";

interface MoveModalProps {
  /** Whether the modal is currently open. */
  isOpen: boolean;
  /** Callback function when the modal is closed. */
  onClose: () => void;
  /** Callback function when the move is confirmed. */
  onMove: (targetParentId: number | null) => void;
  /** The node (file or folder) that is being moved. */
  nodeToMove: FileNode;
}

/**
 * Organism: Modal for selecting a destination folder to move a node to.
 * Coordinates folder navigation, searching, and confirmation of move operations.
 *
 * @param {MoveModalProps} props - The component props.
 * @returns {JSX.Element | null} The rendered MoveModal component or null if not open.
 */
export function MoveModal({
  isOpen,
  onClose,
  onMove,
  nodeToMove,
}: MoveModalProps) {
  const {
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
  } = useMoveModal({ isOpen, nodeToMove, onClose });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[80vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 p-4">
          <h3 className="text-lg font-semibold text-neutral-100">
            Move "{nodeToMove.name}" to...
          </h3>
          <IconButton icon={X} onClick={onClose} variant="ghost" size="sm" />
        </div>

        {/* Search */}
        <div className="bg-neutral-950/50 p-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
              size={18}
            />
            <input
              type="text"
              placeholder="Search folders..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="input-field w-full pl-10"
            />
          </div>
        </div>

        {/* Breadcrumbs */}
        {!searchQuery && (
          <div className="no-scrollbar flex items-center space-x-1 overflow-x-auto bg-neutral-800/30 px-4 py-2 text-sm">
            <button
              onClick={fetchHome}
              className="p-1 text-neutral-400 transition-colors hover:text-blue-400"
            >
              <Home size={14} />
            </button>
            {path.map((folder) => (
              <div
                key={folder.id}
                className="flex shrink-0 items-center space-x-1"
              >
                <ChevronRight size={14} className="text-neutral-600" />
                <button
                  onClick={() => handleFolderClick(folder.id)}
                  className="whitespace-nowrap text-neutral-400 transition-colors hover:text-blue-400"
                >
                  {folder.name}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* List */}
        <div className="min-h-[300px] flex-1 overflow-y-auto p-2">
          {loading || searching ? (
            <div className="flex h-full items-center justify-center">
              <Spinner size="md" />
            </div>
          ) : searchQuery ? (
            <div className="space-y-1">
              {searchResults.length > 0 ? (
                searchResults.map((folder) => (
                  <button
                    key={folder.id}
                    onClick={() => handleFolderClick(folder.id)}
                    className="flex w-full items-center space-x-3 rounded-lg p-3 text-left transition-colors hover:bg-neutral-800"
                  >
                    <Folder size={20} className="text-blue-500" />
                    <span className="text-neutral-200">{folder.name}</span>
                  </button>
                ))
              ) : (
                <div className="py-10 text-center text-neutral-500">
                  No folders found matching "{searchQuery}"
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-1">
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => handleFolderClick(folder.id)}
                  className="group flex w-full items-center justify-between rounded-lg p-3 transition-colors hover:bg-neutral-800"
                >
                  <div className="flex items-center space-x-3">
                    <Folder size={20} className="text-accent" />
                    <span className="text-neutral-200">{folder.name}</span>
                  </div>
                  <ChevronRight
                    size={16}
                    className="text-neutral-600 group-hover:text-neutral-400"
                  />
                </button>
              ))}
              {folders.length === 0 && (
                <div className="py-10 text-center text-sm text-neutral-500">
                  This folder has no subfolders
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-neutral-800 bg-neutral-950/50 p-4">
          <div className="max-w-[200px] truncate text-sm text-neutral-400">
            Target:{" "}
            <span className="text-neutral-200">
              {path[path.length - 1]?.name || "Home"}
            </span>
          </div>
          <div className="flex space-x-3">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => onMove(currentFolderId)}
              disabled={loading || currentFolderId === nodeToMove.parentId}
            >
              Move Here
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MoveModal;
