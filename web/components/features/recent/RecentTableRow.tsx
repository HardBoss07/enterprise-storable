"use client";

import { format } from "date-fns";
import { ExternalLink } from "lucide-react";
import { FileNode } from "@/types/api";
import { FileIcon } from "@/components/ui/FileIcon";
import { IconButton } from "@/components/ui/IconButton";
import { formatBytes } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface RecentTableRowProps {
  /** The file node data. */
  file: FileNode;
  /** Optional callback function to navigate to the parent folder. */
  onNavigate?: (parentId: number | null) => void;
}

/**
 * Molecule: A single row representing a recently modified file.
 * Combines FileIcon (Atom), Name (Text), and Navigation (Atom).
 *
 * @param {RecentTableRowProps} props - The component props.
 * @returns {JSX.Element} The rendered RecentTableRow component.
 */
export function RecentTableRow({ file, onNavigate }: RecentTableRowProps) {
  return (
    <div className="group table-row-grid">
      <div className="col-span-6 flex min-w-0 items-center space-x-4">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center">
          <FileIcon
            extension={file.name.split(".").pop()}
            mime={file.mime}
            isFolder={file.folder}
            size={22}
          />
        </div>
        <span className="truncate font-medium text-neutral-100 group-hover:text-primary transition-colors">
          {file.name}
        </span>
      </div>

      <div className="col-span-3 text-sm text-text-muted">
        {file.modifiedAt
          ? format(new Date(file.modifiedAt), "MMM d, yyyy HH:mm")
          : "--"}
      </div>

      <div className="col-span-2 text-right text-sm text-text-muted">
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
            className="text-blue-500 opacity-0 transition-opacity hover:bg-blue-500/10 group-hover:opacity-100"
          />
        )}
      </div>
    </div>
  );
}

export default RecentTableRow;
