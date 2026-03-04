'use client';

import { FileNode } from '@/types/FileNode';
import FileListItem from './FileListItem';
import { useMemo } from 'react';

interface FileListProps {
  files: FileNode[];
  onFolderClick: (folderId: number) => void;
}

export default function FileList({ files, onFolderClick }: FileListProps) {
  // Sort files: Folders first, then alphabetically
  const sortedFiles = useMemo(() => {
    return [...files].sort((a, b) => {
      // 1. Folders before files
      if (a.folder && !b.folder) return -1;
      if (!a.folder && b.folder) return 1;
      
      // 2. Alphabetical order (case-insensitive)
      return a.name.localeCompare(b.name, undefined, { 
        numeric: true, 
        sensitivity: 'base' 
      });
    });
  }, [files]);

  return (
    <div className="space-y-1">
      <div className="flex items-center p-2 text-neutral-400 text-sm font-bold border-b border-neutral-700/50 mb-2">
        <div className="flex-1 min-w-0 ml-10">Name</div>
        <div className="w-40 hidden sm:block">Last Modified</div>
        <div className="w-24 text-right">File Size</div>
      </div>
      
      {sortedFiles.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-neutral-500">
           <p>This folder is empty</p>
        </div>
      ) : (
        sortedFiles.map((file) => (
          <FileListItem key={file.id} node={file} onFolderClick={onFolderClick} />
        ))
      )}
    </div>
  );
}
