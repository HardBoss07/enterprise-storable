"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { X, ShieldAlert, AlertTriangle } from "lucide-react";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
  isLoading?: boolean;
}

/**
 * Modal for confirming account deletion with a password check.
 */
export default function DeleteAccountModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading
}: DeleteAccountModalProps) {
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isOpen) {
      setPassword("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) {
      onConfirm(password);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-surface-200 border border-red-500/30 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-6 border-b border-surface-300 flex items-center justify-between bg-red-500/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <ShieldAlert size={20} className="text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-red-500">
              Nuclear Option
            </h3>
          </div>
          <IconButton icon={X} onClick={onClose} variant="ghost" size="sm" />
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex gap-3">
            <AlertTriangle className="text-red-500 shrink-0" size={20} />
            <div className="text-sm text-red-200/80 leading-relaxed">
              <p className="font-bold text-red-500 mb-1">WARNING: IRREVERSIBLE ACTION</p>
              Deleting your account will permanently wipe all your files, folders, and data. This cannot be undone.
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-text-secondary ml-1">
              Confirm with Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full bg-surface-100 border border-surface-300 rounded-xl px-4 py-3 text-text-primary focus:ring-2 focus:ring-red-500/50 outline-none transition-all"
              autoFocus
              required
            />
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Button
              variant="danger"
              type="submit"
              isLoading={isLoading}
              disabled={!password || isLoading}
              className="w-full py-4 text-lg font-black uppercase tracking-wider"
            >
              DELETE EVERYTHING
            </Button>
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={isLoading}
              type="button"
              className="w-full text-text-muted hover:text-text-primary"
            >
              Cancel and Keep My Data
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
