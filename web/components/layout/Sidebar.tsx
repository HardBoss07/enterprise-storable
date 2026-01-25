import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-white p-4">
      <nav className="flex flex-col space-y-2">
        <Link href="/" className="py-2 px-4 rounded-md hover:bg-gray-700">
          My Files
        </Link>
        <Link href="/recent" className="py-2 px-4 rounded-md hover:bg-gray-700">
          Recent
        </Link>
        <Link href="/trash" className="py-2 px-4 rounded-md hover:bg-gray-700">
          Trash
        </Link>
      </nav>
    </aside>
  );
}
