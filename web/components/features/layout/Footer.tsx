'use client';

import Image from 'next/image';
import { Github, Globe } from 'lucide-react';

/**
 * Organism: Application footer with branding, social links, and copyright info.
 * Standardized for Phase 10 with Creator links and GitHub integration.
 *
 * @returns {JSX.Element} The rendered Footer component.
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface-100/50 border-surface-200 mt-auto w-full border-t">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Brand Column */}
          <div className="col-span-1 space-y-4 md:col-span-2">
            <div className="flex items-center gap-2">
              <Image src="/logo/icon.svg" alt="Storable Icon" width={28} height={28} />
              <span className="text-text-primary text-xl font-bold tracking-tight">Storable</span>
            </div>
            <p className="text-text-secondary max-w-sm leading-relaxed">
              The high-performance, private file management system designed for self-hosters. Take
              back control of your data with our secure, fast, and beautiful cloud storage solution.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-text-primary text-sm font-bold tracking-wider uppercase">
              Platform
            </h4>
            <ul className="text-text-muted space-y-2 text-sm">
              <li>
                <a href="/login" className="hover:text-primary block py-0.5 transition-colors">
                  Sign In
                </a>
              </li>
              <li>
                <a href="/register" className="hover:text-primary block py-0.5 transition-colors">
                  Create Account
                </a>
              </li>
              <li>
                <a href="/home" className="hover:text-primary block py-0.5 transition-colors">
                  Dashboard
                </a>
              </li>
            </ul>
          </div>

          {/* Social / Support */}
          <div className="space-y-4">
            <h4 className="text-text-primary text-sm font-bold tracking-wider uppercase">
              Connect
            </h4>
            <div className="flex gap-4">
              <a
                href="https://github.com/m4tt3o/storable"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-surface-200 hover:bg-primary/20 hover:text-primary rounded-lg p-2 transition-all"
                title="GitHub Repository"
              >
                <Github size={20} />
              </a>
              <a
                href="https://m4tt3o.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-surface-200 hover:bg-accent/20 hover:text-accent rounded-lg p-2 transition-all"
                title="Creator Portfolio"
              >
                <Globe size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-surface-200 text-text-muted flex flex-col items-center justify-between gap-4 border-t pt-8 text-sm md:flex-row">
          <div className="flex items-center gap-1">
            <span>© {currentYear} Storable.</span>
            <span className="mx-2 hidden md:inline">•</span>
            <span>Created by</span>
            <a
              href="https://m4tt3o.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-primary hover:text-primary font-bold transition-colors"
            >
              Matteo Bosshard
            </a>
          </div>
          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-text-primary transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
