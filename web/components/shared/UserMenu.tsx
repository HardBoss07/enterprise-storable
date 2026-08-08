'use client';

import Link from 'next/link';
import { User as UserIcon, LogOut, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

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
        className="text-primary hover:bg-primary/10 border-primary/20 rounded-lg border px-4 py-2 text-sm font-bold transition-all"
      >
        Login
      </Link>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <Link
        href="/settings"
        className="text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg p-2 transition-all"
        title="Settings"
      >
        <Settings size={20} />
      </Link>
      <div className="bg-surface-100 border-surface-300 flex items-center gap-2 rounded-xl border px-3 py-1.5">
        <UserIcon size={16} className="text-primary" />
        <span className="text-text-primary text-sm font-bold">{user.username}</span>
      </div>
      <button
        onClick={onLogout}
        className="text-text-muted rounded-lg p-2 transition-all hover:bg-red-500/10 hover:text-red-500"
        title="Logout"
      >
        <LogOut size={20} />
      </button>
    </div>
  );
}

export default UserMenu;
