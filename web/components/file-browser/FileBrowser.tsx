'use client';

import { useState, useEffect, useCallback } from 'react';
import { FileNode } from '@/types/FileNode';
import { getFiles, getFileMetadata } from '@/lib/api';
import Breadcrumbs from './Breadcrumbs';
import FileList from './FileList';

interface FileBrowserProps {
    initialFolderId?: number | null;
}

export default function FileBrowser({ initialFolderId = null }: FileBrowserProps) {
    const [files, setFiles] = useState<FileNode[]>([]);
    const [path, setPath] = useState<FileNode[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentFolderId, setCurrentFolderId] = useState<number | null>(initialFolderId);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch children of current folder
            // If currentFolderId is null, we might need a root endpoint or handle it in backend
            // For now, let's assume null = root and the API handles it
            const children = await getFiles(currentFolderId || 0); 
            setFiles(children);

            // Fetch breadcrumbs path
            const pathArr: FileNode[] = [];
            let tempId: number | null = currentFolderId;
            
            while (tempId && tempId !== 0) {
                const node = await getFileMetadata(tempId);
                pathArr.unshift(node);
                tempId = node.parentId;
            }
            
            // Add root to breadcrumbs if not already there
            if (pathArr.length === 0 || pathArr[0].id !== 0) {
                 // We can manually add a "Home" node for root
            }
            
            setPath(pathArr);
        } catch (err) {
            console.error('Error fetching file data:', err);
            setError('Failed to fetch file data.');
        } finally {
            setLoading(false);
        }
    }, [currentFolderId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleFolderClick = (folderId: number) => {
        setCurrentFolderId(folderId);
    };

    const handleBreadcrumbClick = (folderId: number | null) => {
        setCurrentFolderId(folderId);
    };

    return (
        <div className="bg-neutral-800 text-white rounded-lg p-4 shadow-xl border border-neutral-700">
            <div className="mb-4">
                <Breadcrumbs path={path} onBreadcrumbClick={handleBreadcrumbClick} />
            </div>
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            ) : error ? (
                <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-md">
                    {error}
                </div>
            ) : (
                <FileList files={files} onFolderClick={handleFolderClick} />
            )}
        </div>
    );
}
