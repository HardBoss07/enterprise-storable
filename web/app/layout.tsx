import type {Metadata} from "next";
import {Roboto} from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";

const robotoSans = Roboto({
    variable: "--font-roboto-sans",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Storable",
    description: "Storable - A Place to store your documents",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${robotoSans.variable} antialiased flex flex-col min-h-screen bg-gray-900 text-white`}
        >
        <Header/>
        <div className="flex flex-1">
            <Sidebar/>
            <main className="flex-1 p-4">
                {children}
            </main>
        </div>
        <Footer/>
        </body>
        </html>
    );
}
