'use client';

import { FileNode } from '@/types/FileNode';
import { FileIcon } from '@/components/icons/FileIcon';
import { FolderIcon } from '@/components/icons/FolderIcon';
import { format } from 'date-fns';

interface FileListItemProps {
  node: FileNode;
  onFolderClick: (folderId: number) => void;
}

function formatBytes(bytes: number, decimals = 2) {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export default function FileListItem({ node, onFolderClick }: FileListItemProps) {
  const handleClick = () => {
    if (node.folder) {
      onFolderClick(node.id);
    }
  };

  return (
      <div
          className="flex items-center space-x-4 p-2 rounded-md hover:bg-neutral-700/50 cursor-pointer transition-colors"
          onClick={handleClick}
      >
          <div className="flex items-center justify-center w-8 h-8 text-blue-400">
              {node.folder ? <FolderIcon /> : <FileIcon />}
          </div>
          <div className="flex-1 min-w-0">
              <p className="text-neutral-100 font-medium truncate">{node.name}</p>
          </div>
          <div className="w-40 text-neutral-400 text-sm hidden sm:block">
              {format(new Date(node.modifiedAt), "MMM d, yyyy HH:mm")}
          </div>
          <div className="w-24 text-neutral-400 text-sm text-right">
              {!node.folder && node.size !== null ? formatBytes(node.size) : '--'}
          </div>
      </div>
  );
}
