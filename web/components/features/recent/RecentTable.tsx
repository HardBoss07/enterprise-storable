"use client";

import { FileNode } from "@/types/api";
import { RecentTableRow } from "./RecentTableRow";
import { cn } from "@/lib/utils";

interface RecentTableProps {
  /** List of recent file nodes to display. */
  files: FileNode[];
  /** Optional callback function to navigate to a folder. */
  onNavigate?: (parentId: number | null) => void;
  /** Optional additional CSS classes to apply to the table container. */
  className?: string;
}

/**
 * Organism: A structured table for displaying recently modified files.
 * Coordinates the display of multiple RecentTableRows.
 *
 * @param {RecentTableProps} props - The component props.
 * @returns {JSX.Element} The rendered RecentTable component.
 */
export function RecentTable({
  files,
  onNavigate,
  className,
}: RecentTableProps) {
  return (
    <div className={cn("card-surface overflow-hidden", className)}>
      <div className="table-header-grid">
        <div className="col-span-6 ml-10 flex items-center">Name</div>
        <div className="col-span-3">Modified</div>
        <div className="col-span-2 text-right">Size</div>
        <div className="col-span-1"></div>
      </div>

      <div className="space-y-1">
        {files.length === 0 ? (
          <div className="py-20 text-center text-text-muted">
            No recent files found.
          </div>
        ) : (
          files.map((file) => (
            <RecentTableRow key={file.id} file={file} onNavigate={onNavigate} />
          ))
        )}
      </div>
    </div>
  );
}

export default RecentTable;
