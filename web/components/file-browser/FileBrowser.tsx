'use client';

import { FileNode } from '@/types/FileNode';
import { mockFileTree } from '@/lib/mock-data';
import Breadcrumbs from './Breadcrumbs';
import FileList from './FileList';

interface FileBrowserProps {
  initialPath?: string;
}

export default function FileBrowser({ initialPath }: FileBrowserProps) {
  const currentFolderId = initialPath ? initialPath.split('/').pop() : null;

  const files = mockFileTree.filter(
    (file) => file.parentId === (currentFolderId || null)
  );

  const path: FileNode[] = [];
  let folderId = currentFolderId;
  while (folderId) {
    const folder = mockFileTree.find((f) => f.id === folderId);
    if (folder) {
      path.unshift(folder);
      folderId = folder.parentId;
    } else {
      folderId = null;
    }
  }

  return (
    <div className="bg-gray-800 text-white rounded-lg p-4">
      <Breadcrumbs path={path} />
      <FileList files={files} />
    </div>
  );
}
