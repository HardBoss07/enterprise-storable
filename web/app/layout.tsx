import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";

const robotoSans = Roboto({
  variable: "--font-roboto-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Storable",
  description: "Storable - A Place to store your documents",
};

/**
 * Root layout component for the application.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          robotoSans.variable,
          "antialiased flex flex-col min-h-screen bg-bg-main text-white"
        )}
      >
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
