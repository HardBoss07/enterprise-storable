'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  variant?: 'ghost' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  iconSize?: number;
  isLoading?: boolean;
}

/**
 * A reusable icon-only button component.
 */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, icon: Icon, variant = 'ghost', size = 'md', iconSize = 18, isLoading, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-accent disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

    const variants = {
      ghost: 'bg-transparent hover:bg-white/5 text-neutral-400 hover:text-white',
      secondary: 'bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white border border-neutral-700',
      outline: 'bg-transparent border border-neutral-700 hover:border-neutral-500 hover:bg-white/5 text-neutral-400 hover:text-white',
      danger: 'bg-transparent hover:bg-red-600/10 text-red-500 hover:text-red-400',
    };

    const sizes = {
      sm: 'p-1.5',
      md: 'p-2.5',
      lg: 'p-4',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <Icon size={iconSize} className={cn(className?.includes('animate-spin') && 'animate-spin')} />
        )}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
