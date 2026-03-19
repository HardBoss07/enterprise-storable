"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

/**
 * Variants for the StatusBadge component.
 * info: blue (standard context/viewer)
 * warning: red/orange (editor)
 * success: green (owner)
 * neutral: gray (default)
 */
export type StatusBadgeVariant = "info" | "warning" | "success" | "neutral";

export interface StatusBadgeProps {
  /** The content to display in the badge. */
  children: ReactNode;
  /** The visual style of the badge. */
  variant?: StatusBadgeVariant;
  /** Optional additional CSS classes. */
  className?: string;
}

/**
 * Molecule: A small, styled status indicator used for counts, tags, or warnings.
 */
export function StatusBadge({
  children,
  variant = "neutral",
  className,
}: StatusBadgeProps) {
  const variantClasses = {
    neutral: "badge-neutral",
    info: "badge-info",
    warning: "badge-warning",
    success: "badge-success",
  };

  return (
    <span className={cn("badge", variantClasses[variant], className)}>
      {children}
    </span>
  );
}
