'use client';

import { Search as SearchIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FileIcon } from '@/components/ui/FileIcon';
import { useSearch } from '@/hooks/useSearch';

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
    <div className="group relative" ref={searchRef}>
      <SearchIcon
        className={cn(
          'text-text-muted absolute top-1/2 left-3 -translate-y-1/2 transition-colors',
          isOpen && 'text-primary',
        )}
        size={18}
      />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.trim() && setIsOpen(true)}
        placeholder="Search files..."
        className="bg-surface-100 border-surface-300 focus:border-primary focus:ring-primary/20 text-text-primary w-64 rounded-xl border py-2 pr-10 pl-10 text-sm transition-all focus:ring-1 focus:outline-none lg:w-96"
      />
      {query && (
        <button
          onClick={handleClear}
          className="text-text-muted absolute top-1/2 right-3 -translate-y-1/2 hover:text-white"
        >
          <X size={16} />
        </button>
      )}

      {isOpen && (
        <div className="bg-surface-200 border-surface-300 animate-in fade-in slide-in-from-top-2 absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-xl border shadow-2xl duration-200">
          {loading ? (
            <div className="text-text-muted p-4 text-center text-sm">Searching...</div>
          ) : results.length > 0 ? (
            <div className="py-2">
              <div className="text-primary px-4 py-1 text-xs font-bold tracking-wider uppercase">
                Files & Folders
              </div>
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleSelect(result)}
                  className="hover:bg-primary/10 flex w-full items-center gap-3 px-4 py-2 text-left transition-colors"
                >
                  <FileIcon
                    isFolder={result.folder}
                    extension={result.name.split('.').pop()}
                    mime={result.mime}
                    size={18}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-text-primary truncate text-sm font-medium">
                      {result.name}
                    </div>
                    <div className="text-text-muted truncate text-xs">
                      {result.folder ? 'Folder' : result.mime}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-text-muted p-4 text-center text-sm">
              No results found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
