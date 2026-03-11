"use client";

import { TrashItem } from "@/lib/api";
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
  const CLASSES = {
    container: "card-surface overflow-hidden",
    header:
      "grid grid-cols-12 gap-4 p-4 text-neutral-400 text-sm font-bold border-b border-neutral-700/50 mb-2",
    body: "divide-y divide-neutral-700/30",
  };

  return (
    <div className={CLASSES.container}>
      <div className={CLASSES.header}>
        <div className="col-span-5 flex items-center ml-10">Name</div>
        <div className="col-span-3">Deleted At</div>
        <div className="col-span-2 text-right">Size</div>
        <div className="col-span-2 text-right">Days Left</div>
      </div>

      <div className={CLASSES.body}>
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
