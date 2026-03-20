"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import {
  Folder,
  Clock,
  Trash2,
  Shield,
  Settings,
  Star,
  Users,
  UserCircle,
} from "lucide-react";

/**
 * Organism: Application sidebar for navigation.
 * Coordinates navigation links and active state based on the current pathname.
 *
 * @returns {JSX.Element} The rendered Sidebar component.
 */
export function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();

  // Define the base navigation links available to all users
  const navLinks = [
    { href: "/", label: "My Files", icon: Folder },
    { href: "/recent", label: "Recent", icon: Clock },
    { href: "/favorites", label: "Favorites", icon: Star },
    { href: "/shared", label: "Shared with me", icon: Users },
    { href: "/trash", label: "Trash", icon: Trash2 },
  ];

  // Add administrative links if the user has the ADMIN role
  if (user?.role === "ADMIN") {
    navLinks.push({ href: "/admin", label: "Admin Panel", icon: Shield });
    navLinks.push({
      href: "/admin/settings",
      label: "System Settings",
      icon: Settings,
    });
  }

  // Account settings should always be the final item
  navLinks.push({ href: "/settings", label: "Account", icon: UserCircle });

  return (
    <aside className="app-sidebar hidden md:block">
      <nav className="flex flex-col space-y-2">
        {navLinks.map((link) => {
          const Icon = link.icon;

          // Determine if the current link is active
          // For home, we need an exact match to avoid highlighting it for every page
          // For other links, we check if the pathname starts with the href
          // For 'Admin Panel' (/admin), we also check if we are on any admin page except settings
          const isActive =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href) &&
                (link.href !== "/admin" ||
                  !pathname.startsWith("/admin/settings"));

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn("nav-link", isActive && "sidebar-link-active")}
            >
              <Icon
                size={18}
                className={cn(isActive ? "text-primary" : "text-text-muted")}
              />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
