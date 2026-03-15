"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Search, User as UserIcon, LogOut } from "lucide-react";

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
          
          <div className="hidden md:flex relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search files..." 
              className="bg-surface-100 border border-surface-300 rounded-xl py-2 pl-10 pr-4 text-sm w-64 lg:w-96 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-text-primary"
            />
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
