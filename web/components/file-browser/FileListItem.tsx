'use client';

import { FileNode } from '@/types/FileNode';
import { FileIcon } from '@/components/icons/FileIcon';
import { format } from 'date-fns';
import { Download } from 'lucide-react';
import { downloadFileUrl } from '@/lib/api';

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
  const handleClick = (e: React.MouseEvent) => {
    // Prevent click if we're clicking the download button
    if ((e.target as HTMLElement).closest('.download-btn')) {
        return;
    }

    if (node.folder) {
      onFolderClick(node.id);
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
      e.stopPropagation();
      window.open(downloadFileUrl(node.id), '_blank');
  };

  return (
      <div
          className="flex items-center space-x-4 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-all duration-200 group border border-transparent hover:border-neutral-700/50"
          onClick={handleClick}
      >
          <div className="flex items-center justify-center w-10 h-10">
              <FileIcon mime={node.mime} isFolder={node.folder} size={22} />
          </div>
          <div className="flex-1 min-w-0">
              <p className="text-neutral-100 font-medium truncate">{node.name}</p>
          </div>
          
          <div className="flex items-center space-x-2">
              <div className="hidden group-hover:flex px-2">
                  {!node.folder && (
                      <button 
                          onClick={handleDownload}
                          className="download-btn p-1.5 hover:bg-neutral-700 rounded-md text-neutral-400 hover:text-white transition-colors"
                          title="Download"
                      >
                          <Download size={16} />
                      </button>
                  )}
              </div>

              <div className="w-40 text-text-muted text-sm hidden sm:block">
                  {format(new Date(node.modifiedAt), "MMM d, yyyy HH:mm")}
              </div>
              <div className="w-24 text-text-muted text-sm text-right">
                  {!node.folder && node.size !== null ? formatBytes(node.size) : '--'}
              </div>
          </div>
      </div>
  );
}
