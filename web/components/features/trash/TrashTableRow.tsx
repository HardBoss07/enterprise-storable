"use client";

import { format } from "date-fns";
import { RotateCcw, Trash2 } from "lucide-react";
import { TrashItem } from "@/types/api";
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

  return (
    <div className="table-row-grid group">
      <div className="col-span-5 flex items-center space-x-4 min-w-0">
        <div className="flex items-center justify-center w-10 h-10 flex-shrink-0">
          <FileIcon mime={metadata.mime} isFolder={metadata.folder} size={22} />
        </div>
        <span className="text-neutral-100 font-medium truncate">
          {metadata.name}
        </span>
      </div>

      <div className="col-span-3 text-text-muted text-sm">
        {metadata.deletedAt
          ? format(new Date(metadata.deletedAt), "MMM d, yyyy HH:mm")
          : "--"}
      </div>

      <div className="col-span-2 text-text-muted text-sm text-right">
        {!metadata.folder && metadata.size !== null
          ? formatBytes(metadata.size)
          : "--"}
      </div>

      <div className="col-span-2 flex items-center justify-end space-x-2">
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
