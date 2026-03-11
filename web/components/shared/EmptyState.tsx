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
}

/**
 * Molecule: A reusable placeholder for empty views or search results.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  className,
}: EmptyStateProps) {
  const CLASSES = {
    container:
      "card-surface py-20 flex flex-col items-center justify-center text-neutral-500 italic",
    icon: "mb-4 text-neutral-600",
    title: "text-neutral-400",
    description: "text-neutral-500 text-sm mt-1",
  };

  return (
    <div className={cn(CLASSES.container, className)}>
      <Icon className={CLASSES.icon} size={48} />
      <p className={CLASSES.title}>{title}</p>
      {description && <p className={CLASSES.description}>{description}</p>}
    </div>
  );
}
