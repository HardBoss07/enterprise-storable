"use client";

import { useAuth } from "@/context/AuthContext";
import { Header } from "@/components/features/layout/Header";
import { Sidebar } from "@/components/features/layout/Sidebar";
import { Footer } from "@/components/features/layout/Footer";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  /** The content to be rendered within the layout. */
  children: ReactNode;
}

/**
 * Organism: Main application layout component.
 * Orchestrates the overall page structure including Header, Sidebar, Main content, and Footer.
 *
 * @param {AppLayoutProps} props - The component props.
 * @returns {JSX.Element} The rendered AppLayout component.
 */
export function AppLayout({ children }: AppLayoutProps) {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();

  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isLandingPage = pathname === "/";
  const shouldShowSidebar = isAuthenticated && !isAuthPage && !isLandingPage;

  return (
    <div className="flex min-h-screen flex-col bg-bg-main text-white">
      <Header />
      <div className="flex flex-1">
        {shouldShowSidebar && <Sidebar />}
        <main className="min-w-0 flex-1 overflow-auto p-6">{children}</main>
      </div>
      <Footer />
    </div>
  );
}

export default AppLayout;
