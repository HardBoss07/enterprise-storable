'use client';

import { useState, useEffect } from 'react';
import { FileNode } from '@/types/FileNode';
import { getFiles } from '@/lib/api';
import Breadcrumbs from './Breadcrumbs';
import FileList from './FileList';

interface FileBrowserProps {
    initialPath?: string;
}

export default function FileBrowser({ initialPath }: FileBrowserProps) {
    const [files, setFiles] = useState<FileNode[]>([]);
    const currentFolderId = initialPath ? initialPath.split('/').pop() : '1';

    useEffect(() => {
        getFiles(currentFolderId || '1').then(setFiles);
    }, [currentFolderId]);


    const path: FileNode[] = [];


    return (
        <div className="bg-gray-800 text-white rounded-lg p-4">
            <Breadcrumbs path={path} />
            <FileList files={files} />
        </div>
    );
}
