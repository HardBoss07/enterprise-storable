'use client';

import { FileNode } from '@/types/FileNode';
import { Home } from 'lucide-react';

interface BreadcrumbsProps {
  path: FileNode[];
  onBreadcrumbClick: (folderId: number | null) => void;
}

export default function Breadcrumbs({ path, onBreadcrumbClick }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-400">
      <button 
        onClick={() => onBreadcrumbClick(null)}
        className="flex items-center hover:text-white transition-colors p-1 rounded hover:bg-gray-700"
        title="Home"
      >
        <Home size={18} />
      </button>
      
      {path.map((node, index) => (
        <div key={node.id} className="flex items-center space-x-2">
          <span className="text-gray-600">/</span>
          {index === path.length - 1 ? (
            <span className="text-gray-100 font-medium px-1">{node.name}</span>
          ) : (
            <button 
              onClick={() => onBreadcrumbClick(node.id)}
              className="hover:text-white hover:underline transition-colors px-1 rounded hover:bg-gray-700"
            >
              {node.name}
            </button>
          )}
        </div>
      ))}
    </nav>
  );
}
