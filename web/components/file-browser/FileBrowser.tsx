'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { FileNode } from '@/types/FileNode';
import { getFiles, getFileMetadata, createFolder, uploadFile } from '@/lib/api';
import Breadcrumbs from './Breadcrumbs';
import FileList from './FileList';
import { Upload, FolderPlus, RefreshCw } from 'lucide-react';

interface FileBrowserProps {
    initialFolderId?: number | null;
}

export default function FileBrowser({ initialFolderId = null }: FileBrowserProps) {
    const [files, setFiles] = useState<FileNode[]>([]);
    const [path, setPath] = useState<FileNode[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentFolderId, setCurrentFolderId] = useState<number | null>(initialFolderId);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const children = await getFiles(currentFolderId); 
            setFiles(children);

            const pathArr: FileNode[] = [];
            let tempId: number | null = currentFolderId;
            
            while (tempId && tempId !== 0) {
                const node = await getFileMetadata(tempId);
                pathArr.unshift(node);
                tempId = node.parentId;
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

    const handleCreateFolder = async () => {
        const name = prompt('Enter folder name:');
        if (name) {
            try {
                await createFolder(name, currentFolderId);
                fetchData();
            } catch (err) {
                alert('Failed to create folder');
            }
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                setLoading(true);
                await uploadFile(file, currentFolderId);
                fetchData();
            } catch (err) {
                alert('Failed to upload file');
                setLoading(false);
            }
        }
    };

    return (
        <div className="bg-neutral-800 text-white rounded-lg p-4 shadow-xl border border-neutral-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <Breadcrumbs path={path} onBreadcrumbClick={handleBreadcrumbClick} />
                
                <div className="flex items-center space-x-2">
                    <button 
                        onClick={handleUploadClick}
                        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                        disabled={loading}
                    >
                        <Upload size={18} />
                        <span>Upload</span>
                    </button>
                    <button 
                        onClick={handleCreateFolder}
                        className="flex items-center space-x-2 bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded-md transition-colors"
                        disabled={loading}
                    >
                        <FolderPlus size={18} />
                        <span>New Folder</span>
                    </button>
                    <button 
                        onClick={() => fetchData()}
                        className="p-2 bg-neutral-700 hover:bg-neutral-600 rounded-md transition-colors"
                        title="Refresh"
                    >
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        className="hidden" 
                    />
                </div>
            </div>

            {loading && files.length === 0 ? (
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
