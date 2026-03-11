"use client";

import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  /** The main text to display in the badge. */
  label: string;
  /** Whether to show a warning (red) state. */
  isWarning?: boolean;
  /** Optional additional CSS classes. */
  className?: string;
}

/**
 * Molecule: A small, styled status indicator used for counts, tags, or warnings.
 */
export function StatusBadge({ label, isWarning, className }: StatusBadgeProps) {
  const CLASSES = {
    base: "text-xs font-medium px-2 py-1 rounded-full",
    warning: "bg-red-500/10 text-red-500",
    default: "bg-neutral-800 text-neutral-400",
  };

  return (
    <span
      className={cn(
        CLASSES.base,
        isWarning ? CLASSES.warning : CLASSES.default,
        className,
      )}
    >
      {label}
    </span>
  );
}
