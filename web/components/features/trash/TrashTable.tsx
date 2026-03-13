"use client";

import { TrashItem } from "@/types/api";
import { TrashTableRow } from "./TrashTableRow";

interface TrashTableProps {
  /** List of trash items to display. */
  items: TrashItem[];
  /** Callback to restore an item. */
  onRestore: (id: number) => void;
  /** Callback to permanently delete an item. */
  onPermanentDelete: (id: number, name: string) => void;
}

/**
 * Organism: A structured table for displaying and managing multiple trash items.
 */
export function TrashTable({
  items,
  onRestore,
  onPermanentDelete,
}: TrashTableProps) {
  return (
    <div className="card-surface overflow-hidden">
      <div className="table-header-grid">
        <div className="col-span-5 flex items-center ml-10">Name</div>
        <div className="col-span-3">Deleted At</div>
        <div className="col-span-2 text-right">Size</div>
        <div className="col-span-2 text-right">Days Left</div>
      </div>

      <div className="space-y-1">
        {items.map((item) => (
          <TrashTableRow
            key={item.metadata.id}
            item={item}
            onRestore={onRestore}
            onPermanentDelete={onPermanentDelete}
          />
        ))}
      </div>
    </div>
  );
}
