import { useState, useEffect, useRef } from "react";
import { FileNode } from "@/types/api";
import {
  lookupUsers,
  getNodePrivileges,
  shareNode,
  updatePrivilege,
  removePrivilege,
  UserLookup,
  AccessPrivilege,
  PrivilegeLevel,
} from "@/lib/api/sharing";
import { useToast } from "@/context/ToastContext";

interface UseShareModalProps {
  node: FileNode;
  onClose: () => void;
}

/**
 * Custom hook for handling share modal logic.
 * Extracts user lookup and privilege management from the UI layer.
 *
 * @param {UseShareModalProps} props - The hook properties.
 * @returns {object} State and handlers for the share modal.
 */
export function useShareModal({ node, onClose }: UseShareModalProps) {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserLookup[]>([]);
  const [privileges, setPrivileges] = useState<AccessPrivilege[]>([]);
  const [loadingPrivileges, setLoadingPrivileges] = useState(true);
  const [searching, setSearching] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchPrivileges();
  }, [node.id]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  /**
   * Fetches the current privileges for the node.
   */
  const fetchPrivileges = async () => {
    try {
      setLoadingPrivileges(true);
      const data = await getNodePrivileges(node.id);
      setPrivileges(data);
    } catch (error) {
      console.error("Failed to fetch privileges:", error);
      showToast("Failed to load sharing permissions", "error");
    } finally {
      setLoadingPrivileges(false);
    }
  };

  /**
   * Handles changes in the search input for users.
   * @param {string} value - The current search query.
   */
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    if (value.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    searchTimeout.current = setTimeout(async () => {
      try {
        const results = await lookupUsers(value);
        // Filter out users who already have access
        const filtered = results.filter(
          (u) =>
            !privileges.some((p) => p.userId === u.id) && u.id !== node.ownerId,
        );
        setSearchResults(filtered);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setSearching(false);
      }
    }, 500);
  };

  /**
   * Adds a new share for a user.
   * @param {UserLookup} user - The user to share with.
   */
  const handleAddShare = async (user: UserLookup) => {
    try {
      await shareNode(node.id, user.id, "VIEW");
      showToast(`Shared ${node.name} with ${user.username}`, "success");
      setSearchQuery("");
      setSearchResults([]);
      fetchPrivileges();
    } catch (error) {
      console.error("Sharing failed:", error);
      showToast("Failed to share file", "error");
    }
  };

  /**
   * Updates the privilege level for a user.
   * @param {string} userId - The ID of the user.
   * @param {PrivilegeLevel} level - The new privilege level.
   */
  const handleUpdateLevel = async (userId: string, level: PrivilegeLevel) => {
    try {
      await updatePrivilege(node.id, userId, level);
      showToast("Permission updated", "success");
      fetchPrivileges();
    } catch (error) {
      console.error("Update failed:", error);
      showToast("Failed to update permission", "error");
    }
  };

  /**
   * Removes access for a user.
   * @param {string} userId - The ID of the user.
   */
  const handleRemovePrivilege = async (userId: string) => {
    try {
      await removePrivilege(node.id, userId);
      showToast("Access removed", "success");
      fetchPrivileges();
    } catch (error) {
      console.error("Removal failed:", error);
      showToast("Failed to remove access", "error");
    }
  };

  return {
    searchQuery,
    searchResults,
    privileges,
    loadingPrivileges,
    searching,
    handleSearchChange,
    handleAddShare,
    handleUpdateLevel,
    handleRemovePrivilege,
  };
}
