import { useState, useEffect, useRef } from "react";
import { FileNode } from "@/types/api";
import { searchFiles } from "@/lib/api/file";
import { useRouter } from "next/navigation";

/**
 * Custom hook for handling search functionality.
 * Extracts search logic from the UI layer.
 *
 * @returns {object} Search state and handlers.
 */
export function useSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FileNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchFiles(query);
        setResults(data.slice(0, 8)); // Show top 8 results
        setIsOpen(true);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  /**
   * Handles selection of a search result.
   * @param {FileNode} node - The selected file node.
   */
  const handleSelect = (node: FileNode) => {
    if (node.folder) {
      router.push(`/?folderId=${node.id}`);
    } else {
      router.push(`/?folderId=${node.parentId}`);
    }
    setIsOpen(false);
    setQuery("");
  };

  /**
   * Clears the search query.
   */
  const handleClear = () => {
    setQuery("");
  };

  return {
    query,
    setQuery,
    results,
    loading,
    isOpen,
    setIsOpen,
    searchRef,
    handleSelect,
    handleClear,
  };
}
