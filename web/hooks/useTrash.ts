"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  TrashItem,
} from "@/types/api";
import {
  getTrashList,
  deleteNodePermanently,
  emptyTrashBin,
  getTrashRetentionConfig,
} from "@/lib/api/trash";
import { restoreNode } from "@/lib/api/file";
import { updateRetentionDays } from "@/lib/api/admin";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { useConfirm } from "@/context/ConfirmContext";

/**
 * Custom hook for managing Trash page logic and state.
 * Handles fetching trash items, restoration, permanent deletion, and retention settings.
 */
export function useTrash() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { confirm } = useConfirm();
  const [trashItems, setTrashItems] = useState<TrashItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Admin config state
  const [retentionDays, setRetentionDays] = useState<number>(30);
  const [isEditingRetention, setIsEditingRetention] = useState(false);
  const [isSavingRetention, setIsSavingRetention] = useState(false);

  const isAdmin = useMemo(() => user?.role === "ADMIN", [user]);

  /**
   * Fetches trash items and global retention settings.
   */
  const fetchTrashData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [items, days] = await Promise.all([
        getTrashList(),
        getTrashRetentionConfig(),
      ]);
      setTrashItems(items);
      setRetentionDays(days);
    } catch (err) {
      console.error("Failed to fetch trash:", err);
      setError("Failed to load trash contents.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrashData();
  }, [fetchTrashData]);

  /**
   * Restores a soft-deleted item.
   * @param id - The ID of the node to restore.
   */
  const handleRestore = async (id: number) => {
    try {
      await restoreNode(id);
      showToast("Item restored successfully.", "success");
      await fetchTrashData();
    } catch (err) {
      showToast("Failed to restore item.", "error");
    }
  };

  /**
   * Permanently deletes a single item.
   * @param id - The ID of the node.
   * @param name - The name of the node for confirmation.
   */
  const handlePermanentDelete = async (id: number, name: string) => {
    const confirmed = await confirm({
      title: "Delete Permanently",
      message: `Are you sure you want to permanently delete ${name}? This action cannot be undone.`,
      confirmLabel: "Delete Permanently",
      variant: "danger",
    });

    if (confirmed) {
      try {
        await deleteNodePermanently(id);
        showToast(`Permanently deleted ${name}.`, "success");
        await fetchTrashData();
      } catch (err) {
        showToast("Failed to delete item.", "error");
      }
    }
  };

  /**
   * Permanently deletes all items in the user's trash.
   */
  const handleEmptyTrash = async () => {
    const confirmed = await confirm({
      title: "Empty Trash",
      message: "Are you sure you want to permanently delete ALL items in the trash? This action cannot be undone.",
      confirmLabel: "Empty Trash",
      variant: "danger",
    });

    if (confirmed) {
      try {
        await emptyTrashBin();
        showToast("Trash emptied successfully.", "success");
        await fetchTrashData();
      } catch (err) {
        showToast("Failed to empty trash.", "error");
      }
    }
  };

  /**
   * Updates the global trash retention policy.
   */
  const handleSaveRetention = async () => {
    setIsSavingRetention(true);
    try {
      await updateRetentionDays(retentionDays);
      setIsEditingRetention(false);
      showToast("Retention period updated successfully.", "success");
      await fetchTrashData();
    } catch (err) {
      showToast("Failed to update retention period.", "error");
    } finally {
      setIsSavingRetention(false);
    }
  };

  return {
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
    refresh: fetchTrashData,
  };
}
