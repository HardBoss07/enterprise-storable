'use client';

import { FileNode } from '@/types/FileNode';
import { Home, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IconButton } from '@/components/ui/IconButton';

interface BreadcrumbsProps {
  path: FileNode[];
  onBreadcrumbClick: (folderId: number | null) => void;
}

/**
 * Renders a breadcrumb navigation bar for the current file path.
 * @param path The list of parent folder nodes.
 * @param onBreadcrumbClick Callback when a breadcrumb is clicked.
 */
export default function Breadcrumbs({ path, onBreadcrumbClick }: BreadcrumbsProps) {
  return (
    <nav className={cn(
      "flex items-center flex-wrap glass-nav px-2 py-1 text-neutral-400"
    )}>
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
            <ChevronRight size={16} className="mx-1 text-neutral-600 shrink-0" />
            {isLast ? (
              <span className="text-white font-semibold text-sm px-2 py-1 bg-neutral-800/50 rounded-md border border-neutral-700/30 truncate max-w-[150px] sm:max-w-[250px]">
                {node.name}
              </span>
            ) : (
              <button 
                onClick={() => onBreadcrumbClick(node.id)}
                className="text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all px-2.5 py-1.5 rounded-md text-sm font-medium truncate max-w-[100px] sm:max-w-[150px]"
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
