"use client";

import { useEffect, useState } from "react";
import { FileNode } from "@/types/api";
import { getFavorites, toggleFavorite, softDeleteNode, renameNode, duplicateFile } from "@/lib/api/file";
import { PageContainer } from "@/components/ui/PageContainer";
import FileList from "@/components/features/file-browser/FileList";
import { Spinner } from "@/components/ui/Spinner";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";
import MoveModal from "@/components/features/file-browser/MoveModal";
import { moveNode } from "@/lib/api/file";
import { Star } from "lucide-react";
import EmptyState from "@/components/shared/EmptyState";
import ShareModal from "@/components/features/file-browser/ShareModal";

/**
 * Favorites page component.
 * Displays all files and folders marked as favorites.
 */
export default function FavoritesPage() {
  const [files, setFiles] = useState<FileNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [movingNode, setMovingNode] = useState<FileNode | null>(null);
  const [sharingNode, setSharingNode] = useState<FileNode | null>(null);
  const { showToast } = useToast();
  const router = useRouter();


  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const data = await getFavorites();
      setFiles(data);
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
      showToast("Failed to load favorites", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleFolderClick = (folderId: number) => {
    router.push(`/?folderId=${folderId}`);
  };

  const handleToggleFavorite = async (nodeId: number, isFavorite: boolean) => {
    try {
      await toggleFavorite(nodeId, isFavorite);
      if (!isFavorite) {
        setFiles((prev) => prev.filter((f) => f.id !== nodeId));
      } else {
        fetchFavorites();
      }
      showToast(isFavorite ? "Added to favorites" : "Removed from favorites", "success");
    } catch (error) {
      showToast("Failed to update favorite status", "error");
    }
  };

  const handleDelete = async (nodeId: number) => {
    try {
      await softDeleteNode(nodeId);
      setFiles((prev) => prev.filter((f) => f.id !== nodeId));
      showToast("Moved to trash", "success");
    } catch (error) {
      showToast("Failed to delete item", "error");
    }
  };

  const handleRename = async (nodeId: number, newName: string) => {
    try {
      await renameNode(nodeId, newName);
      fetchFavorites();
      showToast("Renamed successfully", "success");
    } catch (error) {
      showToast("Failed to rename item", "error");
    }
  };

  const handleDuplicate = async (nodeId: number) => {
    try {
      await duplicateFile(nodeId);
      fetchFavorites();
      showToast("Duplicated successfully", "success");
    } catch (error) {
      showToast("Failed to duplicate item", "error");
    }
  };

  const handleMoveClick = (nodeId: number) => {
    const node = files.find((f) => f.id === nodeId);
    if (node) {
      setMovingNode(node);
    }
  };

  const handleMoveConfirm = async (targetParentId: number | null) => {
    if (!movingNode) return;
    try {
      await moveNode(movingNode.id, targetParentId);
      fetchFavorites();
      showToast("Moved successfully", "success");
    } catch (error) {
      showToast("Failed to move item", "error");
    } finally {
      setMovingNode(null);
    }
  };

  const handleJumpToLocation = (parentId: number | null) => {
    if (parentId) {
      router.push(`/?folderId=${parentId}`);
    } else {
      router.push("/");
    }
  };

  return (
    <PageContainer title="Favorites" description="Manage your most important files and folders.">
      <div className="card-surface">
        {loading ? (
          <Spinner size="lg" className="h-64" />
        ) : files.length === 0 ? (
          <EmptyState
            icon={Star}
            title="No Favorites Yet"
            description="Star your important files to see them here."
          />
        ) : (
          <FileList
            files={files}
            onFolderClick={handleFolderClick}
            onDelete={handleDelete}
            onRename={handleRename}
            onDuplicate={handleDuplicate}
            onMove={handleMoveClick}
            onShare={(node) => setSharingNode(node)}
            onToggleFavorite={handleToggleFavorite}
            onJumpToLocation={handleJumpToLocation}
          />
        )}
      </div>

      {movingNode && (
        <MoveModal
          isOpen={!!movingNode}
          nodeToMove={movingNode}
          onClose={() => setMovingNode(null)}
          onMove={handleMoveConfirm}
        />
      )}

      {sharingNode && (
        <ShareModal
          node={sharingNode}
          onClose={() => setSharingNode(null)}
        />
      )}
    </PageContainer>
  );
}
