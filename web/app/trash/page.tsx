"use client";

import { useTrash } from "@/hooks/useTrash";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
import { Trash2, AlertCircle, Info } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { TrashTable } from "@/components/features/trash/TrashTable";
import { RetentionSettings } from "@/components/features/trash/RetentionSettings";

/**
 * Trash Page: Implements the purely declarative UI layer for the soft-delete system.
 * Architecture: Uses Atomic Organisms and custom hooks for business logic.
 */
export default function TrashPage() {
  const {
    trashItems,
    loading,
    error,
    retentionDays,
    isEditingRetention,
    isSavingRetention,
    isAdmin,
    setRetentionDays,
    setIsEditingRetention,
    handleRestore,
    handlePermanentDelete,
    handleEmptyTrash,
    handleSaveRetention,
  } = useTrash();

  const CLASSES = {
    container: "space-y-6",
    header: "flex items-center justify-between mb-8",
    titleSection: "flex flex-col",
    title: "text-2xl font-bold text-neutral-100 flex items-center",
    subtitle: "text-text-muted text-sm mt-1",
    actions: "flex items-center space-x-3",
    emptyTrashBtn: "text-red-500 border-red-500/30 hover:bg-red-500/10",
    errorBox:
      "bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-md flex items-center",
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
    <div className={CLASSES.container}>
      <div className={CLASSES.header}>
        <div className={CLASSES.titleSection}>
          <h1 className={CLASSES.title}>
            <Trash2 className="mr-2 text-red-500" />
            Trash
          </h1>
          <p className={CLASSES.subtitle}>
            Items in trash will be permanently deleted after {retentionDays}{" "}
            days.
          </p>
        </div>

        <div className={CLASSES.actions}>
          {isAdmin && (
            <RetentionSettings
              days={retentionDays}
              isEditing={isEditingRetention}
              isSaving={isSavingRetention}
              onDaysChange={setRetentionDays}
              onEditToggle={setIsEditingRetention}
              onSave={handleSaveRetention}
            />
          )}

          {trashItems.length > 0 && (
            <Button
              onClick={handleEmptyTrash}
              variant="outline"
              className={CLASSES.emptyTrashBtn}
            >
              Empty Trash
            </Button>
          )}
        </div>
      </div>

      {trashItems.length === 0 ? (
        <EmptyState icon={Info} title="Your trash is empty." />
      ) : (
        <TrashTable
          items={trashItems}
          onRestore={handleRestore}
          onPermanentDelete={handlePermanentDelete}
        />
      )}
    </div>
  );
}
