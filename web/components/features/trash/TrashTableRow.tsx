"use client";

import { format } from "date-fns";
import { RotateCcw, Trash2 } from "lucide-react";
import { TrashItem } from "@/lib/api";
import { FileIcon } from "@/components/icons/FileIcon";
import { IconButton } from "@/components/ui/IconButton";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatBytes } from "@/lib/utils";

interface TrashTableRowProps {
  /** The trash item data. */
  item: TrashItem;
  /** Callback to restore the item. */
  onRestore: (id: number) => void;
  /** Callback to permanently delete the item. */
  onPermanentDelete: (id: number, name: string) => void;
}

/**
 * Molecule: A single row representing a soft-deleted file or folder in the Trash Table.
 */
export function TrashTableRow({
  item,
  onRestore,
  onPermanentDelete,
}: TrashTableRowProps) {
  const { metadata, daysRemaining } = item;

  const CLASSES = {
    row: "grid grid-cols-12 gap-4 p-3 items-center group interactive-surface no-hover",
    cellName: "col-span-5 flex items-center min-w-0",
    cellIcon: "flex items-center justify-center w-10 h-10 mr-2 flex-shrink-0",
    cellText: "text-neutral-100 font-medium truncate",
    cellDate: "col-span-3 text-text-muted text-sm",
    cellSize: "col-span-2 text-text-muted text-sm text-right",
    cellActions: "col-span-2 flex items-center justify-end space-x-2",
  };

  return (
    <div className={CLASSES.row}>
      <div className={CLASSES.cellName}>
        <div className={CLASSES.cellIcon}>
          <FileIcon mime={metadata.mime} isFolder={metadata.folder} size={22} />
        </div>
        <span className={CLASSES.cellText}>{metadata.name}</span>
      </div>

      <div className={CLASSES.cellDate}>
        {metadata.deletedAt
          ? format(new Date(metadata.deletedAt), "MMM d, yyyy HH:mm")
          : "--"}
      </div>

      <div className={CLASSES.cellSize}>
        {!metadata.folder && metadata.size !== null
          ? formatBytes(metadata.size)
          : "--"}
      </div>

      <div className={CLASSES.cellActions}>
        <StatusBadge
          label={`${daysRemaining} days left`}
          isWarning={daysRemaining <= 5}
        />

        <IconButton
          icon={RotateCcw}
          onClick={() => onRestore(metadata.id)}
          variant="ghost"
          size="sm"
          iconSize={16}
          title="Restore"
          className="text-blue-500 hover:bg-blue-500/10"
        />

        <IconButton
          icon={Trash2}
          onClick={() => onPermanentDelete(metadata.id, metadata.name)}
          variant="ghost"
          size="sm"
          iconSize={16}
          title="Delete Permanently"
          className="text-red-500 hover:bg-red-500/10"
        />
      </div>
    </div>
  );
}
