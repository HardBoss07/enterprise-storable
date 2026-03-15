"use client";

import { FileNode } from "@/types/api";
import { RecentTableRow } from "./RecentTableRow";

interface RecentTableProps {
  /** List of recent files to display. */
  files: FileNode[];
  /** Optional callback to navigate to the parent folder. */
  onNavigate?: (parentId: number | null) => void;
}

/**
 * Organism: A structured table for displaying recently modified files.
 */
export function RecentTable({ files, onNavigate }: RecentTableProps) {
  return (
    <div className="card-surface overflow-hidden">
      <div className="table-header-grid">
        <div className="col-span-6 flex items-center ml-10">Name</div>
        <div className="col-span-3">Modified</div>
        <div className="col-span-2 text-right">Size</div>
        <div className="col-span-1"></div>
      </div>

      <div className="space-y-1">
        {files.map((file) => (
          <RecentTableRow key={file.id} file={file} onNavigate={onNavigate} />
        ))}
      </div>
    </div>
  );
}
