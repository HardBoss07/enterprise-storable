"use client";

import { format } from "date-fns";
import { ExternalLink } from "lucide-react";
import { FileNode } from "@/types/api";
import { FileIcon } from "@/components/icons/FileIcon";
import { IconButton } from "@/components/ui/IconButton";
import { formatBytes } from "@/lib/utils";

interface RecentTableRowProps {
  /** The file node data. */
  file: FileNode;
  /** Optional callback to navigate to the parent folder. */
  onNavigate?: (parentId: number | null) => void;
}

/**
 * Molecule: A single row representing a recently modified file.
 */
export function RecentTableRow({ file, onNavigate }: RecentTableRowProps) {
  return (
    <div className="table-row-grid group">
      <div className="col-span-6 flex items-center space-x-4 min-w-0">
        <div className="flex items-center justify-center w-10 h-10 flex-shrink-0">
          <FileIcon mime={file.mime} isFolder={file.folder} size={22} />
        </div>
        <span className="text-neutral-100 font-medium truncate">
          {file.name}
        </span>
      </div>

      <div className="col-span-3 text-text-muted text-sm">
        {file.modifiedAt
          ? format(new Date(file.modifiedAt), "MMM d, yyyy HH:mm")
          : "--"}
      </div>

      <div className="col-span-2 text-text-muted text-sm text-right">
        {!file.folder && file.size !== null ? formatBytes(file.size) : "--"}
      </div>

      <div className="col-span-1 flex items-center justify-end">
        {onNavigate && (
          <IconButton
            icon={ExternalLink}
            onClick={() => onNavigate(file.parentId)}
            variant="ghost"
            size="sm"
            iconSize={16}
            title="Go to folder"
            className="text-blue-500 hover:bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
          />
        )}
      </div>
    </div>
  );
}
