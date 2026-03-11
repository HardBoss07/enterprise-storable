"use client";

import { useAuth } from "@/context/AuthContext";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();

  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <div className="flex flex-col min-h-screen bg-bg-main text-white">
      <Header />
      <div className="flex flex-1">
        {isAuthenticated && !isAuthPage && <Sidebar />}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
