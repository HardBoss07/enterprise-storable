"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Props for the EmptyState component.
 */
interface EmptyStateProps {
  /** The Lucide icon component to display. */
  icon: LucideIcon;
  /** The main title or message to display. */
  title: string;
  /** Optional secondary description text. */
  description?: string;
  /** Optional additional CSS classes to apply to the container. */
  className?: string;
  /** Optional action elements or supplementary content. */
  children?: React.ReactNode;
}

/**
 * Molecule: A reusable placeholder for empty views or no search results.
 * Combines an Icon (Atom), Title (Text), and optional Description/Actions.
 *
 * @param {EmptyStateProps} props - The component props.
 * @returns {JSX.Element} The rendered EmptyState component.
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
        <p className="mt-1 text-sm text-neutral-500">{description}</p>
      )}
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}

export default EmptyState;
