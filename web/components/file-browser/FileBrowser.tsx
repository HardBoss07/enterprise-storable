'use client';

import { useState, useEffect } from 'react';
import { FileNode } from '@/types/FileNode';
import { getFiles, getFileMetadata } from '@/lib/api';
import Breadcrumbs from './Breadcrumbs';
import FileList from './FileList';

interface FileBrowserProps {
    initialPath?: string;
}

export default function FileBrowser({ initialPath }: FileBrowserProps) {
    const [files, setFiles] = useState<FileNode[]>([]);
    const [path, setPath] = useState<FileNode[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const currentFolderId = initialPath ? parseInt(initialPath.split('/').pop() || '1', 10) : 1;

    useEffect(() => {
        setLoading(true);
        setError(null);

        const fetchFilesAndPath = async () => {
            try {
                const files = await getFiles(currentFolderId || 1);
                setFiles(files);

                const pathArr: FileNode[] = [];
                let currentId: number | null = currentFolderId;
                while (currentId) {
                    const node = await getFileMetadata(currentId);
                    pathArr.unshift(node);
                    currentId = node.parentId;
                }
                setPath(pathArr);

            } catch (error) {
                setError('Failed to fetch file data.');
            } finally {
                setLoading(false);
            }
        };

        fetchFilesAndPath();
    }, [currentFolderId]);


    return (
        <div className="bg-gray-800 text-white rounded-lg p-4">
            <Breadcrumbs path={path} />
            {loading && <div>Loading...</div>}
            {error && <div className="text-red-500">{error}</div>}
            {!loading && !error && <FileList files={files} />}
        </div>
    );
}
