"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { User as UserIcon, LogOut } from "lucide-react";
import SearchBar from "./SearchBar";
import { usePathname } from "next/navigation";

/**
 * Standardized application header with branding, search, and user controls.
 */
export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const pathname = usePathname();

  const isAuthPage = pathname === "/login" || pathname === "/register";
  const showSidebarLayout = isAuthenticated && !isAuthPage;

  return (
    <header className="app-header">
      <div className="flex h-16 items-center">
        {showSidebarLayout ? (
          <>
            {/* Logo Area - Aligned with Sidebar */}
            <div className="w-64 h-full flex items-center px-6">
              <Link href="/" className="flex items-center gap-2 group">
                <Image
                  src="/logo/logo.svg"
                  alt="Storable Logo"
                  width={130}
                  height={30}
                  className="group-hover:opacity-80 transition-opacity"
                  priority
                />
              </Link>
            </div>

            {/* Content Area - Aligned with Main Content */}
            <div className="flex-1 flex items-center justify-between px-6 lg:px-8">
              <div className="flex items-center gap-8">
                {user && (
                  <div className="hidden md:flex">
                    <SearchBar />
                  </div>
                )}
              </div>

              <nav className="flex items-center space-x-6">
                <UserMenu user={user} onLogout={logout} />
              </nav>
            </div>
          </>
        ) : (
          /* Simplified Layout for Auth Pages / Landing */
          <div className="flex-1 flex items-center justify-between px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-2 group">
              <Image
                src="/logo/logo.svg"
                alt="Storable Logo"
                width={130}
                height={30}
                className="group-hover:opacity-80 transition-opacity"
                priority
              />
            </Link>

            <nav className="flex items-center space-x-6">
              <UserMenu user={user} onLogout={logout} />
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

function UserMenu({ user, onLogout }: { user: any; onLogout: () => void }) {
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
