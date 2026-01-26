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
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const currentFolderId = initialPath ? initialPath.split('/').pop() : '1';

    useEffect(() => {
        setLoading(true);
        setError(null);
        getFiles(currentFolderId || '1')
            .then(setFiles)
            .catch(() => setError('Failed to fetch files.'))
            .finally(() => setLoading(false));
    }, [currentFolderId]);


    const path: FileNode[] = [];


    return (
        <div className="bg-gray-800 text-white rounded-lg p-4">
            <Breadcrumbs path={path} />
            {loading && <div>Loading...</div>}
            {error && <div className="text-red-500">{error}</div>}
            {!loading && !error && <FileList files={files} />}
        </div>
    );
}
