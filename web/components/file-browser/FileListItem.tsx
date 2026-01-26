'use client';

import { FileNode } from '@/types/FileNode';
import { FileIcon } from '@/components/icons/FileIcon';
import { FolderIcon } from '@/components/icons/FolderIcon';
import { useRouter } from 'next/navigation';
import {format} from 'date-fns';

interface FileListItemProps {
  node: FileNode;
  onFolderClick: (folderId: number) => void;
}

function formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export default function FileListItem({ node, onFolderClick }: FileListItemProps) {
  const router = useRouter();

  const handleClick = () => {
    if (node.isFolder) {
      onFolderClick(node.id);
      router.push(`/browse/${node.id}`);
    }
  };

  return (
      <div
          className="flex items-center space-x-4 p-2 rounded-md hover:bg-gray-800 cursor-pointer"
          onClick={handleClick}
      >
          <div className="w-6 h-6">
              {node.isFolder ? <FolderIcon /> : <FileIcon />}
          </div>
          <div className="flex-1 min-w-0">
              <p className="text-white truncate">{node.name}</p>
          </div>
          <div className="w-32 text-gray-400 text-sm">
              {format(new Date(node.modifiedAt), "MMM d, yyyy")}
          </div>
          <div className="w-24 text-gray-400 text-sm">
              {!node.isFolder && node.size && formatBytes(node.size)}
          </div>
      </div>
  );
}
