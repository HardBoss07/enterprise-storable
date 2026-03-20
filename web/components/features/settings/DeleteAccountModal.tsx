"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { X, ShieldAlert, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeleteAccountModalProps {
  /** Whether the modal is currently open. */
  isOpen: boolean;
  /** Callback function when the modal is closed. */
  onClose: () => void;
  /** Callback function when account deletion is confirmed. */
  onConfirm: (password: string) => void;
  /** Optional loading state for the confirmation button. */
  isLoading?: boolean;
}

/**
 * Molecule/Organism: Modal for confirming account deletion with a password check.
 * Implements the "Nuclear Option" for account removal.
 *
 * @param {DeleteAccountModalProps} props - The component props.
 * @returns {JSX.Element | null} The rendered DeleteAccountModal component or null if not open.
 */
export function DeleteAccountModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: DeleteAccountModalProps) {
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isOpen) {
      setPassword("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  /**
   * Handles the submission of the deletion confirmation form.
   * @param {React.FormEvent} event - The form submission event.
   */
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (password.trim()) {
      onConfirm(password);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="flex w-full max-w-md animate-in fade-in zoom-in flex-col overflow-hidden rounded-2xl border border-red-500/30 bg-surface-200 shadow-2xl duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-surface-300 bg-red-500/5 p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-500/10 p-2 text-red-500">
              <ShieldAlert size={20} />
            </div>
            <h3 className="text-xl font-bold text-red-500">Nuclear Option</h3>
          </div>
          <IconButton icon={X} onClick={onClose} variant="ghost" size="sm" />
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div className="flex gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
            <AlertTriangle className="shrink-0 text-red-500" size={20} />
            <div className="text-sm leading-relaxed text-red-200/80">
              <p className="mb-1 font-bold text-red-500 uppercase">
                WARNING: IRREVERSIBLE ACTION
              </p>
              Deleting your account will permanently wipe all your files,
              folders, and data. This cannot be undone.
            </div>
          </div>

          <div className="space-y-2">
            <label className="ml-1 text-sm font-bold text-text-secondary">
              Confirm with Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-xl border border-surface-300 bg-surface-100 px-4 py-3 text-text-primary outline-none transition-all focus:ring-2 focus:ring-red-500/50"
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

export default DeleteAccountModal;
