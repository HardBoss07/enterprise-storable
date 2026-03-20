"use client";

import { format } from "date-fns";
import { RotateCcw, Trash2 } from "lucide-react";
import { TrashItem } from "@/types/api";
import { FileIcon } from "@/components/ui/FileIcon";
import { IconButton } from "@/components/ui/IconButton";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatBytes } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface TrashTableRowProps {
  /** The trash item data, including metadata and retention info. */
  item: TrashItem;
  /** Callback function to restore the item from trash. */
  onRestore: (id: number) => void;
  /** Callback function to permanently delete the item. */
  onPermanentDelete: (id: number, name: string) => void;
}

/**
 * Molecule: A single row representing a soft-deleted file or folder in the Trash Table.
 * Combines FileIcon (Atom), Name (Text), StatusBadge (Molecule), and Action buttons (Atoms).
 *
 * @param {TrashTableRowProps} props - The component props.
 * @returns {JSX.Element} The rendered TrashTableRow component.
 */
export function TrashTableRow({
  item,
  onRestore,
  onPermanentDelete,
}: TrashTableRowProps) {
  const { metadata, daysRemaining } = item;

  return (
    <div className="group table-row-grid">
      <div className="col-span-4 flex min-w-0 items-center space-x-4">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center">
          <FileIcon
            extension={metadata.name.split(".").pop()}
            mime={metadata.mime}
            isFolder={metadata.folder}
            size={22}
          />
        </div>
        <span className="truncate font-medium text-neutral-100 group-hover:text-primary transition-colors">
          {metadata.name}
        </span>
      </div>

      <div className="col-span-3 text-sm text-text-muted">
        {metadata.deletedAt
          ? format(new Date(metadata.deletedAt), "MMM d, yyyy HH:mm")
          : "--"}
      </div>

      <div className="col-span-2 text-right text-sm text-text-muted">
        {!metadata.folder && metadata.size !== null
          ? formatBytes(metadata.size)
          : "--"}
      </div>

      <div className="col-span-3 flex items-center justify-end space-x-2">
        <StatusBadge variant={daysRemaining <= 5 ? "warning" : "neutral"}>
          {daysRemaining} days left
        </StatusBadge>

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

export default TrashTableRow;
