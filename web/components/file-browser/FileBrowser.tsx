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
        <div className="bg-bg-sidebar text-white rounded-xl p-6 shadow-2xl border border-neutral-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <Breadcrumbs path={path} onBreadcrumbClick={handleBreadcrumbClick} />
                
                <div className="flex items-center space-x-3">
                    <button 
                        onClick={handleUploadClick}
                        className="flex items-center space-x-2 bg-primary-accent hover:brightness-110 text-white px-5 py-2.5 rounded-lg transition-all shadow-lg shadow-blue-500/20 font-medium"
                        disabled={loading}
                    >
                        <Upload size={18} strokeWidth={2.5} />
                        <span>Upload</span>
                    </button>
                    <button 
                        onClick={handleCreateFolder}
                        className="flex items-center space-x-2 bg-transparent border border-neutral-700 hover:border-neutral-500 hover:bg-white/5 text-neutral-200 px-5 py-2.5 rounded-lg transition-all font-medium"
                        disabled={loading}
                    >
                        <FolderPlus size={18} strokeWidth={2} />
                        <span>New Folder</span>
                    </button>
                    <button 
                        onClick={() => fetchData()}
                        className="p-2.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg transition-all text-neutral-400 hover:text-white"
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
