"use client";

import { TrashItem } from "@/types/api";
import { TrashTableRow } from "./TrashTableRow";
import { cn } from "@/lib/utils";

interface TrashTableProps {
  /** List of trash items to display. */
  items: TrashItem[];
  /** Callback to restore an item. */
  onRestore: (id: number) => void;
  /** Callback to permanently delete an item. */
  onPermanentDelete: (id: number, name: string) => void;
  /** Optional additional CSS classes to apply to the table container. */
  className?: string;
}

/**
 * Organism: A structured table for displaying and managing multiple trash items.
 * Coordinates the display of multiple TrashTableRows.
 *
 * @param {TrashTableProps} props - The component props.
 * @returns {JSX.Element} The rendered TrashTable component.
 */
export function TrashTable({
  items,
  onRestore,
  onPermanentDelete,
  className,
}: TrashTableProps) {
  return (
    <div className={cn("card-surface overflow-hidden", className)}>
      <div className="table-header-grid">
        <div className="col-span-4 ml-10 flex items-center">Name</div>
        <div className="col-span-3">Deleted At</div>
        <div className="col-span-2 text-right">Size</div>
        <div className="col-span-3 text-right">Days Left</div>
      </div>

      <div className="space-y-1">
        {items.length === 0 ? (
          <div className="py-20 text-center text-text-muted">
            Trash is empty.
          </div>
        ) : (
          items.map((item) => (
            <TrashTableRow
              key={item.metadata.id}
              item={item}
              onRestore={onRestore}
              onPermanentDelete={onPermanentDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default TrashTable;
