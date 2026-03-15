"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isAuthenticated && user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== "ADMIN") {
    return null;
  }

  const tabs = [
    { name: "User Management", href: "/admin/users" },
    { name: "Global Settings", href: "/admin/settings" },
  ];

  return (
    <div className="flex flex-col h-full bg-neutral-900 text-neutral-100">
      <header className="p-6 border-b border-neutral-800">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <p className="text-neutral-400 text-sm mt-1">
          Manage users and system-wide configurations.
        </p>
      </header>

      <nav className="flex px-6 border-b border-neutral-800 bg-neutral-900/50">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "px-4 py-3 text-sm font-medium transition-colors border-b-2",
              pathname === tab.href
                ? "border-primary-accent text-primary-accent"
                : "border-transparent text-neutral-400 hover:text-neutral-200",
            )}
          >
            {tab.name}
          </Link>
        ))}
      </nav>

      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
}
