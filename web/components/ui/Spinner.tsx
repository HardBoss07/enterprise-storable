'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * A reusable loading spinner component.
 */
export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizes = {
    sm: 'h-6 w-6 border-2',
    md: 'h-12 w-12 border-2',
    lg: 'h-16 w-16 border-4',
  };

  return (
    <div className={cn('flex justify-center items-center', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-b-primary-accent border-neutral-700',
          sizes[size]
        )}
      />
    </div>
  );
}
