"use client";

import Link from "next/link";
import { User as UserIcon, LogOut, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserMenuProps {
  /** The current user object. */
  user: any; // TODO: Replace with proper User type
  /** Function to handle user logout. */
  onLogout: () => void;
}

/**
 * Molecule: User menu component for displaying user info and actions.
 *
 * @param {UserMenuProps} props - The component props.
 * @returns {JSX.Element} The rendered UserMenu component.
 */
export function UserMenu({ user, onLogout }: UserMenuProps) {
  if (!user) {
    return (
      <Link
        href="/login"
        className="px-4 py-2 text-sm font-bold text-primary hover:bg-primary/10 rounded-lg transition-all border border-primary/20"
      >
        Login
      </Link>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <Link
        href="/settings"
        className="p-2 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
        title="Settings"
      >
        <Settings size={20} />
      </Link>
      <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-100 border border-surface-300 rounded-xl">
        <UserIcon size={16} className="text-primary" />
        <span className="text-sm font-bold text-text-primary">
          {user.username}
        </span>
      </div>
      <button
        onClick={onLogout}
        className="p-2 text-text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
        title="Logout"
      >
        <LogOut size={20} />
      </button>
    </div>
  );
}

export default UserMenu;
