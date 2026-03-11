"use client";

import { useRef } from "react";
import Breadcrumbs from "./Breadcrumbs";
import FileList from "./FileList";
import { Upload, FolderPlus, RefreshCw } from "lucide-react";
import { useFileBrowser } from "@/hooks/useFileBrowser";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Spinner } from "@/components/ui/Spinner";
import { useToast } from "@/context/ToastContext";

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
    isCreatingFolder,
    triggerCreateFolder,
    cancelCreateFolder,
  } = useFileBrowser(initialFolderId);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  return (
    <div className="card-surface">
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
          isCreatingFolder={isCreatingFolder}
          onCreateFolder={createFolder}
          onCancelCreateFolder={cancelCreateFolder}
        />
      )}
    </div>
  );
}
