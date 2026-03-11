"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  TrashItem,
  getTrash,
  restore,
  emptyTrash,
  permanentlyDelete,
  updateTrashRetention,
  getPublicTrashRetention,
} from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

/**
 * Custom hook for managing Trash page logic and state.
 * Handles fetching trash items, restoration, permanent deletion, and retention settings.
 */
export function useTrash() {
  const { user } = useAuth();
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
        getTrash(),
        getPublicTrashRetention(),
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
      await restore(id);
      await fetchTrashData();
    } catch (err) {
      alert("Failed to restore item.");
    }
  };

  /**
   * Permanently deletes a single item.
   * @param id - The ID of the node.
   * @param name - The name of the node for confirmation.
   */
  const handlePermanentDelete = async (id: number, name: string) => {
    if (
      confirm(
        `Are you sure you want to permanently delete ${name}? This action cannot be undone.`,
      )
    ) {
      try {
        await permanentlyDelete(id);
        await fetchTrashData();
      } catch (err) {
        alert("Failed to delete item.");
      }
    }
  };

  /**
   * Permanently deletes all items in the user's trash.
   */
  const handleEmptyTrash = async () => {
    if (
      confirm(
        "Are you sure you want to permanently delete ALL items in the trash? This action cannot be undone.",
      )
    ) {
      try {
        await emptyTrash();
        await fetchTrashData();
      } catch (err) {
        alert("Failed to empty trash.");
      }
    }
  };

  /**
   * Updates the global trash retention policy.
   */
  const handleSaveRetention = async () => {
    setIsSavingRetention(true);
    try {
      await updateTrashRetention(retentionDays);
      setIsEditingRetention(false);
      await fetchTrashData();
    } catch (err) {
      alert("Failed to update retention period.");
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
