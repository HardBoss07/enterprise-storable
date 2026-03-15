"use client";

import { useRef, useState } from "react";
import Breadcrumbs from "./Breadcrumbs";
import FileList from "./FileList";
import { Upload, FolderPlus, RefreshCw } from "lucide-react";
import { useFileBrowser } from "@/hooks/useFileBrowser";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Spinner } from "@/components/ui/Spinner";
import { useToast } from "@/context/ToastContext";
import MoveModal from "./MoveModal";
import { FileNode } from "@/types/api";

interface FileBrowserProps {
  initialFolderId?: number | null;
}

/**
 * The main file browser component.
 * Handles navigation, file listing, folder creation, and file uploads.
 */
export default function FileBrowser({
  initialFolderId = null,
}: FileBrowserProps) {
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
    isCreatingFolder,
    triggerCreateFolder,
    cancelCreateFolder,
  } = useFileBrowser(initialFolderId);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [movingNode, setMovingNode] = useState<FileNode | null>(null);
  const [renamingNodeId, setRenamingNodeId] = useState<number | null>(null);

  const handleCreateFolder = () => {
    triggerCreateFolder();
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await uploadFile(file);
        showToast(`Successfully uploaded ${file.name}`, "success");
      } catch (err) {
        showToast("Failed to upload file", "error");
      }
    }
  };

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

  const handleDuplicate = async (nodeId: number) => {
    try {
      const newNode = await duplicateFile(nodeId);
      showToast("Successfully duplicated", "success");
      // Trigger rename for the new node
      setRenamingNodeId(newNode.id);
    } catch (err) {
      showToast("Failed to duplicate", "error");
    }
  };

  const handleMoveClick = (nodeId: number) => {
    const node = files.find(f => f.id === nodeId);
    if (node) {
      setMovingNode(node);
    }
  };

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
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
            className={loading ? "animate-spin" : ""}
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
        <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-md">
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
    </div>
  );
}
