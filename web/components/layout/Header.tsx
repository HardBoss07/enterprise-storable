import Link from 'next/link';
import { cn } from '@/lib/utils';

/**
 * Renders the application header.
 */
export default function Header() {
  return (
    <header className={cn("bg-neutral-900 text-white shadow-md border-b border-neutral-800")}>
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link href="/" className="text-2xl font-bold tracking-tight text-white hover:text-neutral-200 transition-colors">
          Storable
        </Link>
        <nav className="flex items-center space-x-6">
          <Link href="/login" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
