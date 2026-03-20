"use client";

import { Search as SearchIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { FileIcon } from "@/components/ui/FileIcon";
import { useSearch } from "@/hooks/useSearch";

/**
 * Global search bar molecule with debouncing and dropdown results.
 * Combines an input, icons, and a results dropdown.
 *
 * @returns {JSX.Element} The rendered SearchBar component.
 */
export function SearchBar() {
  const {
    query,
    setQuery,
    results,
    loading,
    isOpen,
    setIsOpen,
    searchRef,
    handleSelect,
    handleClear,
  } = useSearch();

  return (
    <div className="relative group" ref={searchRef}>
      <SearchIcon
        className={cn(
          "absolute left-3 top-1/2 -translate-y-1/2 text-text-muted transition-colors",
          isOpen && "text-primary",
        )}
        size={18}
      />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.trim() && setIsOpen(true)}
        placeholder="Search files..."
        className="bg-surface-100 border border-surface-300 rounded-xl py-2 pl-10 pr-10 text-sm w-64 lg:w-96 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-text-primary"
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white"
        >
          <X size={16} />
        </button>
      )}

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-surface-200 border border-surface-300 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {loading ? (
            <div className="p-4 text-center text-text-muted text-sm">
              Searching...
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              <div className="px-4 py-1 text-xs font-bold text-primary uppercase tracking-wider">
                Files & Folders
              </div>
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleSelect(result)}
                  className="w-full px-4 py-2 flex items-center gap-3 hover:bg-primary/10 transition-colors text-left"
                >
                  <FileIcon
                    isFolder={result.folder}
                    extension={result.name.split(".").pop()}
                    mime={result.mime}
                    size={18}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-text-primary truncate">
                      {result.name}
                    </div>
                    <div className="text-xs text-text-muted truncate">
                      {result.folder ? "Folder" : result.mime}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-text-muted text-sm">
              No results found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
