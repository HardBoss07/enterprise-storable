import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  actions?: React.ReactNode;
}

/**
 * Standardized page container for consistent layout across the application.
 */
export const PageContainer = ({
  children,
  className = '',
  title,
  actions,
}: PageContainerProps) => {
  return (
    <div className={`flex flex-col h-full w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 ${className}`}>
      {(title || actions) && (
        <div className="flex items-center justify-between mb-8">
          {title && (
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {title}
            </h1>
          )}
          {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>
      )}
      <div className="flex-1 min-h-0">
        {children}
      </div>
    </div>
  );
};
