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
  return (
    <span
      className={cn(
        "badge",
        isWarning ? "badge-warning" : "badge-neutral",
        className,
      )}
    >
      {label}
    </span>
  );
}
