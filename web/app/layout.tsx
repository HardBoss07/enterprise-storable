import type {Metadata} from "next";
import {Roboto} from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
            className={`${robotoSans.variable} antialiased`}
        >
        <Header/>
        {children}
        <Footer/>
        </body>
        </html>
    );
}
