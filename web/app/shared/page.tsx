"use client";

import { useEffect, useState } from "react";
import { PageContainer } from "@/components/ui/PageContainer";
import { FileNode } from "@/types/api";
import { getSharedWithMe } from "@/lib/api/sharing";
import FileList from "@/components/features/file-browser/FileList";
import EmptyState from "@/components/shared/EmptyState";
import { Users } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";

import { useRouter } from "next/navigation";
import ShareModal from "@/components/features/file-browser/ShareModal";

import { useAuth } from "@/context/AuthContext";

/**
 * Shared with me page.
 */
export default function SharedPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [files, setFiles] = useState<FileNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [sharingNode, setSharingNode] = useState<FileNode | null>(null);

  const fetchSharedFiles = async () => {
    try {
      setLoading(true);
      const data = await getSharedWithMe();
      // Filter out files owned by the current user
      const filtered = data.filter((file) => file.ownerId !== user?.id);
      setFiles(filtered);
    } catch (error) {
      console.error("Failed to fetch shared files:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSharedFiles();
  }, []);

  const handleFolderClick = (id: number) => {
    // Shared folders can be navigated like normal folders if we have permission
    router.push(`/?folderId=${id}`);
  };

  return (
    <PageContainer title="Shared with me">
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : files.length > 0 ? (
        <div className="bg-surface-100 rounded-2xl border border-surface-300 overflow-hidden shadow-sm p-4">
          <FileList
            files={files}
            onFolderClick={handleFolderClick}
            onDelete={() => {}} // Basic view-only for shared items list
            onRename={() => {}}
            onDuplicate={() => {}}
            onMove={() => {}}
            onShare={(node) => setSharingNode(node)}
            onToggleFavorite={() => {}}
          />
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="No shared files"
          description="Files and folders shared with you by others will appear here."
        />
      )}

      {sharingNode && (
        <ShareModal node={sharingNode} onClose={() => setSharingNode(null)} />
      )}
    </PageContainer>
  );
}
