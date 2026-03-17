"use client";

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
  PrivilegeLevel
} from "@/lib/api/sharing";
import { X, Search, User, Trash2, ShieldCheck, Loader2, ChevronDown } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/lib/utils";

interface ShareModalProps {
  node: FileNode;
  onClose: () => void;
}

/**
 * Modal for managing file/folder sharing and permissions.
 */
export default function ShareModal({ node, onClose }: ShareModalProps) {
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
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
          u => !privileges.some(p => p.userId === u.id) && u.id !== node.ownerId
        );
        setSearchResults(filtered);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setSearching(false);
      }
    }, 500);
  };

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface-100 border border-surface-300 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-surface-300">
          <div>
            <h2 className="text-xl font-black text-text-primary tracking-tight">
              Share "{node.name}"
            </h2>
            <p className="text-sm text-text-muted mt-0.5">
              Manage who can access this {node.folder ? "folder" : "file"}.
            </p>
          </div>
          <IconButton icon={X} onClick={onClose} variant="ghost" className="text-text-muted hover:text-text-primary" />
        </div>

        <div className="p-6 space-y-6">
          {/* Search Box */}
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-text-muted">
              {searching ? <Loader2 size={18} className="animate-spin text-primary" /> : <Search size={18} />}
            </div>
            <input
              type="text"
              placeholder="Search by username or email..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="input-field w-full pl-12 h-12 bg-surface-200"
              autoFocus
            />

            {searchResults.length > 0 && (
              <div className="absolute z-10 top-full left-0 right-0 mt-2 bg-surface-100 border border-surface-300 rounded-2xl shadow-xl max-h-60 overflow-y-auto">
                {searchResults.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleAddShare(user)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-surface-200 transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <User size={16} />
                    </div>
                    <div>
                      <div className="font-bold text-text-primary">{user.username}</div>
                      <div className="text-xs text-text-muted">{user.email}</div>
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
              <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {/* Always show owner first */}
                <div className="flex items-center justify-between p-3 bg-surface-200/50 rounded-2xl border border-surface-300/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <div className="font-bold text-text-primary">Owner</div>
                      <div className="text-xs text-text-muted">Creator of this item</div>
                    </div>
                  </div>
                  <div className="text-xs font-black text-accent bg-accent/10 px-3 py-1 rounded-full uppercase">
                    Full Control
                  </div>
                </div>

                {privileges.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-3 hover:bg-surface-200 rounded-2xl border border-transparent hover:border-surface-300 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                        <User size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-text-primary">{p.username}</div>
                        <div className="text-xs text-text-muted">{p.email}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="relative inline-flex items-center group/select">
                        <select
                          value={p.level}
                          onChange={(e) => handleUpdateLevel(p.userId, e.target.value as PrivilegeLevel)}
                          className="appearance-none bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 text-xs font-bold rounded-full pl-4 pr-8 py-1.5 transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary uppercase tracking-tighter"
                        >
                          <option value="VIEW" className="bg-bg-sidebar text-text-primary">Can view</option>
                          <option value="EDIT" className="bg-bg-sidebar text-text-primary">Can edit</option>
                          <option value="OWNER" className="bg-bg-sidebar text-text-primary">Full access</option>
                        </select>
                        <ChevronDown 
                          size={12} 
                          className="absolute right-2.5 pointer-events-none text-primary/50"
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
                  <div className="text-center py-6 text-text-muted italic text-sm">
                    Only you can access this item.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 bg-surface-200/50 flex justify-end">
          <Button onClick={onClose} variant="primary" className="px-8 font-black uppercase tracking-tighter">
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
