"use client";

import Image from "next/image";
import { Github, Globe } from "lucide-react";

/**
 * Organism: Application footer with branding, social links, and copyright info.
 * Standardized for Phase 10 with Creator links and GitHub integration.
 *
 * @returns {JSX.Element} The rendered Footer component.
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-surface-100/50 border-t border-surface-200 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <Image
                src="/logo/icon.svg"
                alt="Storable Icon"
                width={28}
                height={28}
              />
              <span className="text-xl font-bold tracking-tight text-text-primary">
                Storable
              </span>
            </div>
            <p className="text-text-secondary max-w-sm leading-relaxed">
              The high-performance, private file management system designed for
              self-hosters. Take back control of your data with our secure,
              fast, and beautiful cloud storage solution.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-text-primary uppercase tracking-wider text-sm">
              Platform
            </h4>
            <ul className="space-y-2 text-text-muted text-sm">
              <li>
                <a
                  href="/login"
                  className="hover:text-primary transition-colors block py-0.5"
                >
                  Sign In
                </a>
              </li>
              <li>
                <a
                  href="/register"
                  className="hover:text-primary transition-colors block py-0.5"
                >
                  Create Account
                </a>
              </li>
              <li>
                <a
                  href="/home"
                  className="hover:text-primary transition-colors block py-0.5"
                >
                  Dashboard
                </a>
              </li>
            </ul>
          </div>

          {/* Social / Support */}
          <div className="space-y-4">
            <h4 className="font-bold text-text-primary uppercase tracking-wider text-sm">
              Connect
            </h4>
            <div className="flex gap-4">
              <a
                href="https://github.com/m4tt3o/storable"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-surface-200 rounded-lg hover:bg-primary/20 hover:text-primary transition-all"
                title="GitHub Repository"
              >
                <Github size={20} />
              </a>
              <a
                href="https://m4tt3o.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-surface-200 rounded-lg hover:bg-accent/20 hover:text-accent transition-all"
                title="Creator Portfolio"
              >
                <Globe size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-surface-200 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-text-muted">
          <div className="flex items-center gap-1">
            <span>© {currentYear} Storable.</span>
            <span className="hidden md:inline mx-2">•</span>
            <span>Created by</span>
            <a
              href="https://m4tt3o.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-primary font-bold hover:text-primary transition-colors"
            >
              Matteo Bosshard
            </a>
          </div>
          <div className="flex gap-6">
            <a
              href="/privacy"
              className="hover:text-text-primary transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="hover:text-text-primary transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
