"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { User as UserIcon, LogOut } from "lucide-react";
import SearchBar from "./SearchBar";

/**
 * Standardized application header with branding, search, and user controls.
 */
export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="app-header">
      <div className="flex h-16 items-center justify-between px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-2xl font-black tracking-tighter text-white hover:text-primary transition-all flex items-center gap-2 group"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-primary/20">
              <div className="w-4 h-4 bg-black rounded-sm" />
            </div>
            <span>Storable</span>
          </Link>
          
          <div className="hidden md:flex">
            <SearchBar />
          </div>
        </div>

        <nav className="flex items-center space-x-6">
          {user ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-100 border border-surface-300 rounded-xl">
                <UserIcon size={16} className="text-primary" />
                <span className="text-sm font-bold text-text-primary">{user.username}</span>
              </div>
              <button
                onClick={logout}
                className="p-2 text-text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-bold text-primary hover:bg-primary/10 rounded-lg transition-all border border-primary/20"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
