"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Renders the sidebar with navigation links.
 */
export default function Sidebar() {
  const navLinks = [
    { href: "/", label: "My Files" },
    { href: "/recent", label: "Recent" },
    { href: "/trash", label: "Trash" },
  ];

  return (
    <aside className={cn("w-64 bg-neutral-800 text-white p-4")}>
      <nav className="flex flex-col space-y-2">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "py-2 px-4 rounded-md hover:bg-neutral-700 transition-colors text-sm font-medium",
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
