"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  /** The icon component to display. */
  icon: LucideIcon;
  /** The main title or message. */
  title: string;
  /** Optional secondary description. */
  description?: string;
  /** Optional additional CSS classes. */
  className?: string;
  /** Optional action element or children. */
  children?: React.ReactNode;
}

/**
 * Molecule: A reusable placeholder for empty views or search results.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  className,
  children,
}: EmptyStateProps) {
  return (
    <div className={cn("empty-state-container", className)}>
      <Icon className="mb-4 text-neutral-600" size={48} />
      <p className="text-neutral-400">{title}</p>
      {description && (
        <p className="text-neutral-500 text-sm mt-1">{description}</p>
      )}
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}
