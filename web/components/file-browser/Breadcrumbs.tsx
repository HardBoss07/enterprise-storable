'use client';

import { FileNode } from '@/types/FileNode';
import { Home, ChevronRight } from 'lucide-react';

interface BreadcrumbsProps {
  path: FileNode[];
  onBreadcrumbClick: (folderId: number | null) => void;
}

export default function Breadcrumbs({ path, onBreadcrumbClick }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center flex-wrap bg-neutral-900/40 backdrop-blur-sm border border-neutral-800 rounded-lg px-4 py-2 text-neutral-400">
      <button 
        onClick={() => onBreadcrumbClick(null)}
        className="flex items-center hover:text-white transition-all p-1.5 rounded-md hover:bg-neutral-800 group"
        title="Home"
      >
        <Home size={18} className="group-hover:scale-110 transition-transform" />
      </button>
      
      {path.map((node, index) => (
        <div key={node.id} className="flex items-center">
          <ChevronRight size={16} className="mx-2 text-neutral-600" />
          {index === path.length - 1 ? (
            <span className="text-white font-semibold text-base px-2 py-1 bg-neutral-800/50 rounded-md border border-neutral-700/30">
              {node.name}
            </span>
          ) : (
            <button 
              onClick={() => onBreadcrumbClick(node.id)}
              className="text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all px-2.5 py-1.5 rounded-md text-sm font-medium"
            >
              {node.name}
            </button>
          )}
        </div>
      ))}
      
      {path.length === 0 && (
          <div className="flex items-center">
               <ChevronRight size={16} className="mx-2 text-neutral-600" />
               <span className="text-white font-semibold text-base px-2 py-1 bg-neutral-800/50 rounded-md border border-neutral-700/30">
                  Home
              </span>
          </div>
      )}
    </nav>
  );
}
