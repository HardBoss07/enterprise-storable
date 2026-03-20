"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { SearchBar } from "@/components/shared/SearchBar";
import { UserMenu } from "@/components/shared/UserMenu";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/**
 * Organism: Application header for branding and user actions.
 * Coordinates branding (Image), search (SearchBar molecule), and user menu (UserMenu molecule).
 *
 * @returns {JSX.Element} The rendered Header component.
 */
export function Header() {
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

export default Header;
