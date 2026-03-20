"use client";

import { FileNode } from "@/types/api";
import { PrivilegeLevel } from "@/lib/api/sharing";
import {
  X,
  Search,
  User,
  Trash2,
  ShieldCheck,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { Button } from "@/components/ui/Button";
import { useShareModal } from "@/hooks/useShareModal";
import { cn } from "@/lib/utils";

interface ShareModalProps {
  /** The node (file or folder) being shared. */
  node: FileNode;
  /** Callback function when the modal is closed. */
  onClose: () => void;
}

/**
 * Organism: Modal for managing file/folder sharing and permissions.
 * Coordinates user lookups, permission displays, and access management.
 *
 * @param {ShareModalProps} props - The component props.
 * @returns {JSX.Element} The rendered ShareModal component.
 */
export function ShareModal({ node, onClose }: ShareModalProps) {
  const {
    searchQuery,
    searchResults,
    privileges,
    loadingPrivileges,
    searching,
    handleSearchChange,
    handleAddShare,
    handleUpdateLevel,
    handleRemovePrivilege,
  } = useShareModal({ node, onClose });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl animate-in fade-in zoom-in overflow-hidden rounded-3xl border border-surface-300 bg-surface-100 shadow-2xl duration-200">
        <div className="flex items-center justify-between border-b border-surface-300 p-6">
          <div>
            <h2 className="text-xl font-black tracking-tight text-text-primary">
              Share "{node.name}"
            </h2>
            <p className="mt-0.5 text-sm text-text-muted">
              Manage who can access this {node.folder ? "folder" : "file"}.
            </p>
          </div>
          <IconButton
            icon={X}
            onClick={onClose}
            variant="ghost"
            className="text-text-muted hover:text-text-primary"
          />
        </div>

        <div className="space-y-6 p-6">
          {/* Search Box */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-text-muted">
              {searching ? (
                <Loader2 size={18} className="animate-spin text-primary" />
              ) : (
                <Search size={18} />
              )}
            </div>
            <input
              type="text"
              placeholder="Search by username or email..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="input-field h-12 w-full bg-surface-200 pl-12"
              autoFocus
            />

            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-10 mt-2 max-h-60 overflow-y-auto rounded-2xl border border-surface-300 bg-surface-100 shadow-xl">
                {searchResults.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleAddShare(user)}
                    className="flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-surface-200"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <User size={16} />
                    </div>
                    <div>
                      <div className="font-bold text-text-primary">
                        {user.username}
                      </div>
                      <div className="text-xs text-text-muted">
                        {user.email}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Privileges List */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-text-muted">
              Who has access
            </h3>

            {loadingPrivileges ? (
              <div className="flex justify-center py-4">
                <Loader2 size={24} className="animate-spin text-primary" />
              </div>
            ) : (
              <div className="custom-scrollbar max-h-64 overflow-y-auto pr-2 space-y-2">
                {/* Always show owner first */}
                <div className="flex items-center justify-between rounded-2xl border border-surface-300/50 bg-surface-200/50 p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <div className="font-bold text-text-primary">Owner</div>
                      <div className="text-xs text-text-muted">
                        Creator of this item
                      </div>
                    </div>
                  </div>
                  <div className="rounded-full bg-accent/10 px-3 py-1 text-xs font-black uppercase text-accent">
                    Full Control
                  </div>
                </div>

                {privileges.map((p) => (
                  <div
                    key={p.id}
                    className="group flex items-center justify-between rounded-2xl border border-transparent p-3 transition-all hover:border-surface-300 hover:bg-surface-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-black">
                        <User size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-text-primary">
                          {p.username}
                        </div>
                        <div className="text-xs text-text-muted">{p.email}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="group/select relative inline-flex items-center">
                        <select
                          value={p.level}
                          onChange={(e) =>
                            handleUpdateLevel(
                              p.userId,
                              e.target.value as PrivilegeLevel,
                            )
                          }
                          className="appearance-none rounded-full border border-primary/20 bg-primary/10 py-1.5 pl-4 pr-8 text-xs font-bold uppercase tracking-tighter text-primary transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary hover:bg-primary/20"
                        >
                          <option
                            value="VIEW"
                            className="bg-bg-sidebar text-text-primary"
                          >
                            Can view
                          </option>
                          <option
                            value="EDIT"
                            className="bg-bg-sidebar text-text-primary"
                          >
                            Can edit
                          </option>
                          <option
                            value="OWNER"
                            className="bg-bg-sidebar text-text-primary"
                          >
                            Full access
                          </option>
                        </select>
                        <ChevronDown
                          size={12}
                          className="pointer-events-none absolute right-2.5 text-primary/50"
                        />
                      </div>

                      <IconButton
                        icon={Trash2}
                        onClick={() => handleRemovePrivilege(p.userId)}
                        variant="ghost"
                        size="sm"
                        className="text-text-muted hover:text-red-500"
                        title="Remove Access"
                      />
                    </div>
                  </div>
                ))}

                {privileges.length === 0 && !loadingPrivileges && (
                  <div className="py-6 text-center text-sm text-text-muted">
                    Only you can access this item.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end bg-surface-200/50 p-6">
          <Button
            onClick={onClose}
            variant="primary"
            className="px-8 font-black uppercase tracking-tighter"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ShareModal;
