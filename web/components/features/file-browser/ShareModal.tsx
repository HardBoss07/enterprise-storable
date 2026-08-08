'use client';

import { FileNode } from '@/types/api';
import { PrivilegeLevel } from '@/lib/api/sharing';
import { X, Search, User, Trash2, ShieldCheck, Loader2, ChevronDown } from 'lucide-react';
import { IconButton } from '@/components/ui/IconButton';
import { Button } from '@/components/ui/Button';
import { useShareModal } from '@/hooks/useShareModal';
import { cn } from '@/lib/utils';

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
      <div className="animate-in fade-in zoom-in border-surface-300 bg-surface-100 w-full max-w-xl overflow-hidden rounded-3xl border shadow-2xl duration-200">
        <div className="border-surface-300 flex items-center justify-between border-b p-6">
          <div>
            <h2 className="text-text-primary text-xl font-black tracking-tight">
              Share "{node.name}"
            </h2>
            <p className="text-text-muted mt-0.5 text-sm">
              Manage who can access this {node.folder ? 'folder' : 'file'}.
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
            <div className="text-text-muted pointer-events-none absolute inset-y-0 left-4 flex items-center">
              {searching ? (
                <Loader2 size={18} className="text-primary animate-spin" />
              ) : (
                <Search size={18} />
              )}
            </div>
            <input
              type="text"
              placeholder="Search by username or email..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="input-field bg-surface-200 h-12 w-full pl-12"
              autoFocus
            />

            {searchResults.length > 0 && (
              <div className="border-surface-300 bg-surface-100 absolute top-full right-0 left-0 z-10 mt-2 max-h-60 overflow-y-auto rounded-2xl border shadow-xl">
                {searchResults.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleAddShare(user)}
                    className="hover:bg-surface-200 flex w-full items-center gap-3 p-3 text-left transition-colors"
                  >
                    <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full">
                      <User size={16} />
                    </div>
                    <div>
                      <div className="text-text-primary font-bold">{user.username}</div>
                      <div className="text-text-muted text-xs">{user.email}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Privileges List */}
          <div className="space-y-4">
            <h3 className="text-text-muted text-xs font-black tracking-wider uppercase">
              Who has access
            </h3>

            {loadingPrivileges ? (
              <div className="flex justify-center py-4">
                <Loader2 size={24} className="text-primary animate-spin" />
              </div>
            ) : (
              <div className="custom-scrollbar max-h-64 space-y-2 overflow-y-auto pr-2">
                {/* Always show owner first */}
                <div className="border-surface-300/50 bg-surface-200/50 flex items-center justify-between rounded-2xl border p-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-accent/10 text-accent flex h-10 w-10 items-center justify-center rounded-full">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <div className="text-text-primary font-bold">Owner</div>
                      <div className="text-text-muted text-xs">Creator of this item</div>
                    </div>
                  </div>
                  <div className="bg-accent/10 text-accent rounded-full px-3 py-1 text-xs font-black uppercase">
                    Full Control
                  </div>
                </div>

                {privileges.map((p) => (
                  <div
                    key={p.id}
                    className="group hover:border-surface-300 hover:bg-surface-200 flex items-center justify-between rounded-2xl border border-transparent p-3 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 text-primary group-hover:bg-primary flex h-10 w-10 items-center justify-center rounded-full transition-colors group-hover:text-black">
                        <User size={20} />
                      </div>
                      <div>
                        <div className="text-text-primary font-bold">{p.username}</div>
                        <div className="text-text-muted text-xs">{p.email}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="group/select relative inline-flex items-center">
                        <select
                          value={p.level}
                          onChange={(e) =>
                            handleUpdateLevel(p.userId, e.target.value as PrivilegeLevel)
                          }
                          className="border-primary/20 bg-primary/10 text-primary focus:ring-primary hover:bg-primary/20 cursor-pointer appearance-none rounded-full border py-1.5 pr-8 pl-4 text-xs font-bold tracking-tighter uppercase transition-all focus:ring-1 focus:outline-none"
                        >
                          <option value="VIEW" className="bg-bg-sidebar text-text-primary">
                            Can view
                          </option>
                          <option value="EDIT" className="bg-bg-sidebar text-text-primary">
                            Can edit
                          </option>
                          <option value="OWNER" className="bg-bg-sidebar text-text-primary">
                            Full access
                          </option>
                        </select>
                        <ChevronDown
                          size={12}
                          className="text-primary/50 pointer-events-none absolute right-2.5"
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
                  <div className="text-text-muted py-6 text-center text-sm">
                    Only you can access this item.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="bg-surface-200/50 flex justify-end p-6">
          <Button
            onClick={onClose}
            variant="primary"
            className="px-8 font-black tracking-tighter uppercase"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ShareModal;
