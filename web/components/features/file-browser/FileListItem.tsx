"use client";

import { FileNode } from "@/types/api";
import { FileIcon } from "@/components/icons/FileIcon";
import { format } from "date-fns";
import { Download, Trash2 } from "lucide-react";
import { downloadFileAsBlob } from "@/lib/api/file";
import { formatBytes } from "@/lib/utils";
import { IconButton } from "@/components/ui/IconButton";
import { useToast } from "@/context/ToastContext";
import { useConfirm } from "@/context/ConfirmContext";

interface FileListItemProps {
  node: FileNode;
  onFolderClick: (folderId: number) => void;
  onDelete: (nodeId: number) => void;
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
}: FileListItemProps) {
  const { showToast } = useToast();
  const { confirm } = useConfirm();

  const handleClick = (e: React.MouseEvent) => {
    // Prevent click if we're clicking the download button or delete button
    if (
      (e.target as HTMLElement).closest(".download-btn") ||
      (e.target as HTMLElement).closest(".delete-btn")
    ) {
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

  return (
    <div
      className="flex items-center space-x-4 p-2 interactive-surface group"
      onClick={handleClick}
    >
      <div className="flex items-center justify-center w-10 h-10 flex-shrink-0">
        <FileIcon mime={node.mime} isFolder={node.folder} size={22} />
      </div>
      <div className="flex-1 min-w-0 flex items-center h-10">
        <p className="text-neutral-100 font-medium m-0 truncate leading-none">
          {node.name}
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <div className="hidden group-hover:flex px-2 space-x-2">
          {!node.folder && (
            <IconButton
              icon={Download}
              onClick={handleDownload}
              className="download-btn"
              variant="secondary"
              size="sm"
              iconSize={16}
              title="Download"
            />
          )}
          <IconButton
            icon={Trash2}
            onClick={handleDelete}
            className="delete-btn text-red-500 hover:text-red-400"
            variant="ghost"
            size="sm"
            iconSize={16}
            title="Delete"
          />
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
