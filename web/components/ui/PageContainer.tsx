import React from "react";
import { cn } from "@/lib/utils";

/**
 * Interface for the PageContainer component props.
 */
interface PageContainerProps {
  /** The content to be rendered inside the container. */
  children: React.ReactNode;
  /** Optional additional CSS classes to apply to the container. */
  className?: string;
  /** Optional page title. */
  title?: string;
  /** Optional page description. */
  description?: string;
  /** Optional actions to be rendered alongside the title. */
  actions?: React.ReactNode;
}

/**
 * Standardized page container for consistent layout across the application.
 * Follows Atomic Design System as a UI Atom for page-level structural wrapping.
 *
 * @param {PageContainerProps} props - The component props.
 * @returns {JSX.Element} The rendered PageContainer component.
 */
export const PageContainer = ({
  children,
  className = "",
  title,
  description,
  actions,
}: PageContainerProps) => {
  return (
    <div
      className={cn(
        "flex flex-col h-full w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6",
        className,
      )}
    >
      {(title || description || actions) && (
        <div className="mb-8 flex items-center justify-between">
          <div>
            {title && (
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {title}
              </h1>
            )}
            {description && (
              <p className="mt-2 text-sm text-neutral-400">{description}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>
      )}
      <div className="min-h-0 flex-1">{children}</div>
    </div>
  );
};
