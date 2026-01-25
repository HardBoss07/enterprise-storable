import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-gray-900 text-white shadow-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-2xl font-bold">
          Storable
        </Link>
        <nav className="flex items-center space-x-4">
          <Link href="/login" className="hover:text-gray-300">
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
