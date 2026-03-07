'use client';

import { FileNode } from '@/types/FileNode';
import { FileIcon } from '@/components/icons/FileIcon';
import { format } from 'date-fns';
import { Download } from 'lucide-react';
import { downloadFileUrl } from '@/lib/api';
import { formatBytes, cn } from '@/lib/utils';
import { IconButton } from '@/components/ui/IconButton';

interface FileListItemProps {
  node: FileNode;
  onFolderClick: (folderId: number) => void;
}

/**
 * Renders a single row in the file list.
 * @param node The file or folder data.
 * @param onFolderClick Callback when a folder is clicked.
 */
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
          className={cn("flex items-center space-x-4 p-2 interactive-surface group")}
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
                      <IconButton 
                          icon={Download}
                          onClick={handleDownload}
                          className="download-btn"
                          variant="secondary"
                          size="sm"
                          iconSize={16}
                          title="Download"
                      />
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
