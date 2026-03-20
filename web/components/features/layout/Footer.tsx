"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Organism: Application footer with branding and copyright info.
 *
 * @returns {JSX.Element} The rendered Footer component.
 */
export function Footer() {
  return (
    <footer className="app-footer">
      <div className="container mx-auto flex flex-col items-center gap-3 px-4 py-6">
        <div className="flex items-center gap-2 opacity-50 transition-opacity hover:opacity-100">
          <Image
            src="/logo/icon.svg"
            alt="Storable Icon"
            width={24}
            height={24}
          />
          <span className="font-bold tracking-tight text-text-primary">
            Storable
          </span>
        </div>
        <p className="text-sm text-text-muted">
          All rights reserved. Created by{" "}
          <a
            href="https://m4tt3o.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline"
          >
            Matteo Bosshard
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
