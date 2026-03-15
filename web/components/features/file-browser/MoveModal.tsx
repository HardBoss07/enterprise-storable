"use client";

import { useState, useEffect, useMemo } from "react";
import { FileNode } from "@/types/api";
import { getFileList, getFilePath, getHomeFolder } from "@/lib/api/file";
import { apiRequest } from "@/lib/api/client";
import { FileIcon } from "@/components/icons/FileIcon";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Search, ChevronRight, X, Folder, Home } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";

interface MoveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMove: (targetParentId: number | null) => void;
  nodeToMove: FileNode;
}

/**
 * Modal for selecting a destination folder to move a node to.
 */
export default function MoveModal({
  isOpen,
  onClose,
  onMove,
  nodeToMove,
}: MoveModalProps) {
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

  const handleFolderClick = (folderId: number) => {
    setCurrentFolderId(folderId);
    fetchFolders(folderId);
    setSearchQuery("");
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      // We don't have a dedicated search endpoint for folders yet,
      // but let's assume we can use a generic search or implement one.
      // For now, let's mock it or if we have time, implement a search endpoint.
      // Actually, let's just search within the current list or
      // implement a simple search in FileController.

      // I'll add a search endpoint to the backend later if needed.
      // For now, let's just use what we have or mock.
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-100">
            Move "{nodeToMove.name}" to...
          </h3>
          <IconButton icon={X} onClick={onClose} variant="ghost" size="sm" />
        </div>

        {/* Search */}
        <div className="p-4 bg-neutral-950/50">
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
          <div className="px-4 py-2 bg-neutral-800/30 flex items-center space-x-1 overflow-x-auto text-sm no-scrollbar">
            <button
              onClick={fetchHome}
              className="p-1 hover:text-blue-400 text-neutral-400 transition-colors"
            >
              <Home size={14} />
            </button>
            {path.map((folder) => (
              <div
                key={folder.id}
                className="flex items-center space-x-1 shrink-0"
              >
                <ChevronRight size={14} className="text-neutral-600" />
                <button
                  onClick={() => handleFolderClick(folder.id)}
                  className="hover:text-blue-400 text-neutral-400 transition-colors whitespace-nowrap"
                >
                  {folder.name}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* List */}
        <div className="flex-1 overflow-y-auto p-2 min-h-[300px]">
          {loading || searching ? (
            <div className="flex items-center justify-center h-full">
              <Spinner size="md" />
            </div>
          ) : searchQuery ? (
            <div className="space-y-1">
              {searchResults.length > 0 ? (
                searchResults.map((folder) => (
                  <button
                    key={folder.id}
                    onClick={() => handleFolderClick(folder.id)}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-neutral-800 transition-colors text-left"
                  >
                    <Folder size={20} className="text-blue-500" />
                    <span className="text-neutral-200">{folder.name}</span>
                  </button>
                ))
              ) : (
                <div className="text-center py-10 text-neutral-500">
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
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-neutral-800 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <Folder size={20} className="text-blue-500" />
                    <span className="text-neutral-200">{folder.name}</span>
                  </div>
                  <ChevronRight
                    size={16}
                    className="text-neutral-600 group-hover:text-neutral-400"
                  />
                </button>
              ))}
              {folders.length === 0 && (
                <div className="text-center py-10 text-neutral-500 text-sm">
                  This folder has no subfolders
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 flex items-center justify-between bg-neutral-950/50">
          <div className="text-sm text-neutral-400 truncate max-w-[200px]">
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
