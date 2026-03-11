"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header
      className={cn(
        "bg-neutral-900 text-white shadow-md border-b border-neutral-800",
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight text-white hover:text-neutral-200 transition-colors"
        >
          Storable
        </Link>
        <nav className="flex items-center space-x-6">
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-neutral-400">Hello, {user.username}</span>
              <button
                onClick={logout}
                className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
