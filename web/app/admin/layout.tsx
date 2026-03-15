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
    <div className="flex flex-col h-full bg-bg-main text-text-primary">
      <header className="p-6 border-b border-surface-300 bg-bg-sidebar">
        <h1 className="text-2xl font-black tracking-tighter">Admin Panel</h1>
        <p className="text-text-muted text-sm mt-1">
          Manage users and system-wide configurations.
        </p>
      </header>

      <nav className="flex px-6 border-b border-surface-300 bg-bg-sidebar">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "px-4 py-3 text-sm font-bold transition-all border-b-2",
              pathname === tab.href
                ? "border-primary text-primary bg-primary/5"
                : "border-transparent text-text-muted hover:text-text-primary hover:bg-surface-100",
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
