"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

/**
 * Renders the sidebar with navigation links.
 */
export default function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "My Files" },
    { href: "/recent", label: "Recent" },
    { href: "/trash", label: "Trash" },
  ];

  if (user?.role === "ADMIN") {
    navLinks.push({ href: "/admin", label: "Admin" });
  }

  return (
    <aside className="app-sidebar">
      <nav className="flex flex-col space-y-2">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "nav-link",
              pathname === link.href && "sidebar-link-active",
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
