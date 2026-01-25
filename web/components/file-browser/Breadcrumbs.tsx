'use client';

import { FileNode } from '@/types/FileNode';
import Link from 'next/link';

interface BreadcrumbsProps {
  path: FileNode[];
}

export default function Breadcrumbs({ path }: BreadcrumbsProps) {
  return (
    <nav className="mb-4 text-sm text-gray-400">
      <Link href="/" className="hover:underline">
        Home
      </Link>
      {path.map((node, index) => (
        <span key={node.id}>
          {' / '}
          {index === path.length - 1 ? (
            <span>{node.name}</span>
          ) : (
            <Link href={`/browse/${node.id}`} className="hover:underline">
              {node.name}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
