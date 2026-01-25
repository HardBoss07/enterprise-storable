'use client';

import { FileNode } from '@/types/FileNode';
import FileListItem from './FileListItem';

interface FileListProps {
  files: FileNode[];
}

export default function FileList({ files }: FileListProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center p-2 text-gray-400 text-sm font-bold">
        <div className="flex-1 min-w-0 ml-10">Name</div>
        <div className="w-32">Last Modified</div>
        <div className="w-24">File Size</div>
      </div>
      {files.map((file) => (
        <FileListItem key={file.id} node={file} />
      ))}
    </div>
  );
}
