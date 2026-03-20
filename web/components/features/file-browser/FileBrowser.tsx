"use client";

import { useRef, useState } from "react";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { FileList } from "./FileList";
import { Upload, FolderPlus, RefreshCw } from "lucide-react";
import { useFileBrowser } from "@/hooks/useFileBrowser";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Spinner } from "@/components/ui/Spinner";
import { useToast } from "@/context/ToastContext";
import { MoveModal } from "./MoveModal";
import { ShareModal } from "./ShareModal";
import { FileNode } from "@/types/api";
import { cn } from "@/lib/utils";

interface FileBrowserProps {
  /** Optional ID of the initial folder to display. */
  initialFolderId?: number | null;
}

/**
 * Organism: The main file browser component.
 * Handles navigation, file listing, folder creation, and file uploads.
 * Coordinates multiple molecules and atoms to provide a full file management experience.
 *
 * @param {FileBrowserProps} props - The component props.
 * @returns {JSX.Element} The rendered FileBrowser component.
 */
export function FileBrowser({ initialFolderId = null }: FileBrowserProps) {
  const { showToast } = useToast();
  const {
    files,
    path,
    loading,
    error,
    navigateToFolder,
    refresh,
    createFolder,
    uploadFile,
    deleteFile,
    renameFile,
    duplicateFile,
    moveFile,
    toggleFavorite,
    isCreatingFolder,
    triggerCreateFolder,
    cancelCreateFolder,
  } = useFileBrowser(initialFolderId);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [movingNode, setMovingNode] = useState<FileNode | null>(null);
  const [sharingNode, setSharingNode] = useState<FileNode | null>(null);
  const [renamingNodeId, setRenamingNodeId] = useState<number | null>(null);

  /**
   * Triggers the folder creation UI.
   */
  const handleCreateFolder = () => {
    triggerCreateFolder();
  };

  /**
   * Triggers the file upload dialog.
   */
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  /**
   * Handles the file input change event for uploads.
   * @param {React.ChangeEvent<HTMLInputElement>} event - The change event.
   */
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await uploadFile(file);
        showToast(`Successfully uploaded ${file.name}`, "success");
      } catch (err) {
        showToast("Failed to upload file", "error");
      }
    }
  };

  /**
   * Handles the renaming of a file or folder.
   * @param {number} nodeId - The ID of the node to rename.
   * @param {string} newName - The new name for the node.
   */
  const handleRename = async (nodeId: number, newName: string) => {
    try {
      await renameFile(nodeId, newName);
      showToast("Successfully renamed", "success");
    } catch (err) {
      showToast("Failed to rename", "error");
    } finally {
      setRenamingNodeId(null);
    }
  };

  /**
   * Handles the duplication of a file or folder.
   * @param {number} nodeId - The ID of the node to duplicate.
   */
  const handleDuplicate = async (nodeId: number) => {
    try {
      const newNode = await duplicateFile(nodeId);
      showToast("Successfully duplicated", "success");
      // Trigger rename for the new node to allow immediate customization
      setRenamingNodeId(newNode.id);
    } catch (err) {
      showToast("Failed to duplicate", "error");
    }
  };

  /**
   * Prepares a node for moving.
   * @param {number} nodeId - The ID of the node to move.
   */
  const handleMoveClick = (nodeId: number) => {
    const node = files.find((f) => f.id === nodeId);
    if (node) {
      setMovingNode(node);
    }
  };

  /**
   * Confirms and executes the move operation.
   * @param {number | null} targetParentId - The ID of the target folder.
   */
  const handleMoveConfirm = async (targetParentId: number | null) => {
    if (!movingNode) return;
    try {
      await moveFile(movingNode.id, targetParentId);
      showToast(`Moved ${movingNode.name} successfully`, "success");
    } catch (err) {
      showToast("Failed to move item", "error");
    } finally {
      setMovingNode(null);
    }
  };

  return (
    <div className="card-surface relative">
      <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center justify-between">
        <Breadcrumbs path={path} onBreadcrumbClick={navigateToFolder} />

        <div className="flex items-center space-x-3">
          <Button
            onClick={handleUploadClick}
            variant="primary"
            isLoading={loading && files.length > 0}
          >
            <Upload size={18} className="mr-2" strokeWidth={2.5} />
            Upload
          </Button>

          <Button
            onClick={handleCreateFolder}
            variant="outline"
            disabled={loading}
          >
            <FolderPlus size={18} className="mr-2" strokeWidth={2} />
            New Folder
          </Button>

          <IconButton
            icon={RefreshCw}
            onClick={() => refresh()}
            variant="secondary"
            title="Refresh"
            className={cn(loading && "animate-spin")}
            isLoading={loading}
          />

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      {loading && files.length === 0 ? (
        <Spinner size="lg" className="h-64" />
      ) : error ? (
        <div className="rounded-md border border-red-500 bg-red-900/50 p-4 text-red-200">
          {error}
        </div>
      ) : (
        <FileList
          files={files}
          onFolderClick={navigateToFolder}
          onDelete={deleteFile}
          onRename={handleRename}
          onDuplicate={handleDuplicate}
          onMove={handleMoveClick}
          onShare={(node) => setSharingNode(node)}
          onToggleFavorite={toggleFavorite}
          isCreatingFolder={isCreatingFolder}
          onCreateFolder={createFolder}
          onCancelCreateFolder={cancelCreateFolder}
          renamingNodeId={renamingNodeId}
          onCancelRename={() => setRenamingNodeId(null)}
        />
      )}

      {movingNode && (
        <MoveModal
          isOpen={!!movingNode}
          nodeToMove={movingNode}
          onClose={() => setMovingNode(null)}
          onMove={handleMoveConfirm}
        />
      )}
      {sharingNode && (
        <ShareModal node={sharingNode} onClose={() => setSharingNode(null)} />
      )}
    </div>
  );
}

export default FileBrowser;
