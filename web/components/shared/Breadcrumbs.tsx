"use client";

import { FileNode } from "@/types/api";
import { Home, ChevronRight } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { cn } from "@/lib/utils";

interface BreadcrumbsProps {
  /** The list of parent folder nodes representing the current path. */
  path: FileNode[];
  /** Callback function when a breadcrumb item is clicked. */
  onBreadcrumbClick: (folderId: number | null) => void;
}

/**
 * Molecule: Breadcrumbs component for navigating through folder structures.
 * Combines Home icon (Atom), Chevron icons (Atom), and folder names (Text).
 *
 * @param {BreadcrumbsProps} props - The component props.
 * @returns {JSX.Element} The rendered Breadcrumbs component.
 */
export function Breadcrumbs({ path, onBreadcrumbClick }: BreadcrumbsProps) {
  return (
    <nav className="breadcrumb-nav flex items-center">
      <IconButton
        icon={Home}
        onClick={() => onBreadcrumbClick(null)}
        variant="ghost"
        title="Home"
        iconSize={18}
        className="hover:scale-110 transition-transform"
      />

      {path.map((node, index) => {
        const isLast = index === path.length - 1;

        return (
          <div key={node.id} className="flex items-center">
            <ChevronRight
              size={16}
              className="mx-1 text-neutral-600 shrink-0"
            />
            {isLast ? (
              <span className="breadcrumb-item-active max-w-[150px] truncate sm:max-w-[250px]">
                {node.name}
              </span>
            ) : (
              <button
                onClick={() => onBreadcrumbClick(node.id)}
                className="breadcrumb-item max-w-[100px] truncate sm:max-w-[150px]"
              >
                {node.name}
              </button>
            )}
          </div>
        );
      })}
    </nav>
  );
}

export default Breadcrumbs;
