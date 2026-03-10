'use client';

import { useState, useEffect, useCallback } from 'react';
import { TrashItem, getTrash, restore, emptyTrash, permanentlyDelete, getTrashRetention, updateTrashRetention, getPublicTrashRetention } from '@/lib/api'; 
import { FileIcon } from '@/components/icons/FileIcon';
import { IconButton } from '@/components/ui/IconButton';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Trash2, RotateCcw, AlertCircle, Info, Settings, Save } from 'lucide-react';
import { formatBytes, cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useAuth } from '@/context/AuthContext';

/**
 * Trash Page for managing soft-deleted files and folders.
 */
export default function TrashPage() {
    const { user } = useAuth();
    const [trashItems, setTrashItems] = useState<TrashItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Admin config state
    const [retentionDays, setRetentionDays] = useState<number>(30);
    const [isEditingRetention, setIsEditingRetention] = useState(false);
    const [isSavingRetention, setIsSavingRetention] = useState(false);

    const isAdmin = user?.role === 'ADMIN';

    const fetchTrash = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getTrash();
            setTrashItems(data);
            
            // Fetch retention days for ALL users so the hint is accurate
            const days = await getPublicTrashRetention();
            setRetentionDays(days);
        } catch (err) {
            console.error('Failed to fetch trash:', err);
            setError('Failed to load trash contents.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTrash();
    }, [fetchTrash]);

    const handleRestore = async (id: number) => {
        try {
            await restore(id);
            await fetchTrash();
        } catch (err) {
            alert('Failed to restore item.');
        }
    };

    const handlePermanentDelete = async (id: number, name: string) => {
        if (confirm(`Are you sure you want to permanently delete ${name}? This action cannot be undone.`)) {
            try {
                await permanentlyDelete(id);
                await fetchTrash();
            } catch (err) {
                alert('Failed to delete item.');
            }
        }
    };

    const handleEmptyTrash = async () => {
        if (confirm('Are you sure you want to permanently delete ALL items in the trash? This action cannot be undone.')) {
            try {
                await emptyTrash();
                await fetchTrash();
            } catch (err) {
                alert('Failed to empty trash.');
            }
        }
    };

    const handleSaveRetention = async () => {
        setIsSavingRetention(true);
        try {
            await updateTrashRetention(retentionDays);
            setIsEditingRetention(false);
            await fetchTrash(); // Refresh to update "days left"
        } catch (err) {
            alert('Failed to update retention period.');
        } finally {
            setIsSavingRetention(false);
        }
    };

    if (loading) return <Spinner size="lg" className="h-64" />;

    if (error) {
        return (
            <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-md flex items-center">
                <AlertCircle className="mr-2" />
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-100 flex items-center">
                        <Trash2 className="mr-2 text-red-500" />
                        Trash
                    </h1>
                    <p className="text-text-muted text-sm mt-1">
                        Items in trash will be permanently deleted after {retentionDays} days.
                    </p>
                </div>

                <div className="flex items-center space-x-3">
                    {isAdmin && (
                        <div className="flex items-center bg-neutral-800/50 rounded-lg p-1 border border-neutral-700">
                            {isEditingRetention ? (
                                <div className="flex items-center space-x-2 px-2">
                                    <Settings size={14} className="text-neutral-500" />
                                    <input 
                                        type="number" 
                                        value={retentionDays}
                                        onChange={(e) => setRetentionDays(parseInt(e.target.value) || 0)}
                                        className="w-16 bg-neutral-900 text-neutral-100 text-xs px-2 py-1 rounded border border-neutral-700 focus:outline-none focus:border-blue-500"
                                        min="0"
                                    />
                                    <span className="text-xs text-neutral-400">days</span>
                                    <IconButton 
                                        icon={Save}
                                        onClick={handleSaveRetention}
                                        variant="secondary"
                                        size="sm"
                                        iconSize={14}
                                        isLoading={isSavingRetention}
                                    />
                                </div>
                            ) : (
                                <Button 
                                    onClick={() => setIsEditingRetention(true)}
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs text-neutral-400 hover:text-neutral-100"
                                >
                                    <Settings size={14} className="mr-2" />
                                    Retention: {retentionDays}d
                                </Button>
                            )}
                        </div>
                    )}

                    {trashItems.length > 0 && (
                        <Button 
                            onClick={handleEmptyTrash}
                            variant="outline"
                            className="text-red-500 border-red-500/30 hover:bg-red-500/10"
                        >
                            Empty Trash
                        </Button>
                    )}
                </div>
            </div>

            {trashItems.length === 0 ? (
                <div className="card-surface py-20 flex flex-col items-center justify-center text-neutral-500 italic">
                    <Info className="mb-4 text-neutral-600" size={48} />
                    <p>Your trash is empty.</p>
                </div>
            ) : (
                <div className="card-surface overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 p-4 text-neutral-400 text-sm font-bold border-b border-neutral-700/50">
                        <div className="col-span-5 flex items-center ml-10">Name</div>
                        <div className="col-span-3">Deleted At</div>
                        <div className="col-span-2 text-right">Size</div>
                        <div className="col-span-2 text-right">Days Left</div>
                    </div>

                    <div className="divide-y divide-neutral-700/30">
                        {trashItems.map((item) => (
                            <div key={item.metadata.id} className="grid grid-cols-12 gap-4 p-3 items-center group interactive-surface no-hover">
                                <div className="col-span-5 flex items-center min-w-0">
                                    <div className="flex items-center justify-center w-10 h-10 mr-2 flex-shrink-0">
                                        <FileIcon mime={item.metadata.mime} isFolder={item.metadata.folder} size={22} />
                                    </div>
                                    <span className="text-neutral-100 font-medium truncate">{item.metadata.name}</span>
                                </div>
                                
                                <div className="col-span-3 text-text-muted text-sm">
                                    {item.metadata.deletedAt ? format(new Date(item.metadata.deletedAt), "MMM d, yyyy HH:mm") : '--'}
                                </div>

                                <div className="col-span-2 text-text-muted text-sm text-right">
                                    {!item.metadata.folder && item.metadata.size !== null ? formatBytes(item.metadata.size) : '--'}
                                </div>

                                <div className="col-span-2 flex items-center justify-end space-x-2">
                                    <span className={cn(
                                        "text-xs font-medium px-2 py-1 rounded-full",
                                        item.daysRemaining <= 5 ? "bg-red-500/10 text-red-500" : "bg-neutral-800 text-neutral-400"
                                    )}>
                                        {item.daysRemaining} days left
                                    </span>
                                    
                                    <IconButton 
                                        icon={RotateCcw}
                                        onClick={() => handleRestore(item.metadata.id)}
                                        variant="ghost"
                                        size="sm"
                                        iconSize={16}
                                        title="Restore"
                                        className="text-blue-500 hover:bg-blue-500/10"
                                    />

                                    <IconButton 
                                        icon={Trash2}
                                        onClick={() => handlePermanentDelete(item.metadata.id, item.metadata.name)}
                                        variant="ghost"
                                        size="sm"
                                        iconSize={16}
                                        title="Delete Permanently"
                                        className="text-red-500 hover:bg-red-500/10"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
