"use client";

import React, { useEffect, useState } from "react";
import { Clock, Upload, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileNode } from "@/types/api";
import { getRecentFiles } from "@/lib/api/file";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/Button";
import { RecentTable } from "@/components/features/recent/RecentTable";
import { PageContainer } from "@/components/ui/PageContainer";

/**
 * Recent Page: Displays the 5 most recently modified files for the logged-in user.
 * Design Sync: Matches the 'Trash' page layout, container padding, and typography.
 */
export default function RecentPage() {
  const router = useRouter();
  const [files, setFiles] = useState<FileNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecent() {
      try {
        setLoading(true);
        const data = await getRecentFiles();
        setFiles(data);
        setError(null);
      } catch (err: any) {
        console.error("Failed to fetch recent files:", err);
        setError(err.message || "Failed to load recent files");
      } finally {
        setLoading(false);
      }
    }

    fetchRecent();
  }, []);

  const handleNavigate = (folderId: number | null) => {
    if (folderId) {
      router.push(`/?folderId=${folderId}`);
    } else {
      router.push("/");
    }
  };

  const CLASSES = {
    subtitle: "text-text-muted text-sm mt-1",
    errorBox:
      "bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-md flex items-center",
    footer: "mt-4 text-xs text-neutral-500 text-center",
  };

  if (loading) return <Spinner size="lg" className="h-64" />;

  if (error) {
    return (
      <div className={CLASSES.errorBox}>
        <AlertCircle className="mr-2" />
        {error}
      </div>
    );
  }

  return (
    <PageContainer
      title="Recent Files"
      description="Showing your 5 most recently modified files."
    >
      <div className="mt-8">
        {files.length === 0 ? (
          <EmptyState
            icon={Clock}
            title="No recent files yet."
            description="Files you've recently uploaded or modified will appear here."
          >
            <Link href="/">
              <Button className="flex items-center gap-2">
                <Upload size={18} />
                Upload your first file
              </Button>
            </Link>
          </EmptyState>
        ) : (
          <>
            <RecentTable files={files} onNavigate={handleNavigate} />
            <p className={CLASSES.footer}>
              Showing the 5 most recently modified files
            </p>
          </>
        )}
      </div>
    </PageContainer>
  );
}
