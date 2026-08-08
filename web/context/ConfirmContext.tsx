'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useRef,
  useEffect,
} from 'react';
import { Button } from '@/components/ui/Button';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
}

interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context;
};

export const ConfirmProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolveRef = useRef<(value: boolean) => void>(() => {});

  const confirm = useCallback((opts: ConfirmOptions) => {
    setOptions(opts);
    setIsOpen(true);
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
    });
  }, []);

  const handleConfirm = () => {
    setIsOpen(false);
    resolveRef.current(true);
  };

  const handleCancel = useCallback(() => {
    setIsOpen(false);
    resolveRef.current(false);
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleCancel();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, handleCancel]);

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {isOpen && options && (
        <div className="animate-in fade-in fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md duration-200">
          <div className="bg-bg-sidebar border-surface-300 animate-in zoom-in-95 w-full max-w-md rounded-2xl border p-6 shadow-2xl duration-200">
            <div className="mb-4 flex items-center gap-3">
              <div
                className={cn(
                  'rounded-lg p-2',
                  options.variant === 'danger'
                    ? 'bg-red-500/10 text-red-500'
                    : 'bg-primary/10 text-primary',
                )}
              >
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-text-primary m-0 text-xl font-bold tracking-tight">
                {options.title || 'Confirm Action'}
              </h3>
            </div>

            <p className="text-text-secondary mb-8 leading-relaxed">{options.message}</p>

            <div className="flex items-center justify-end space-x-3">
              <Button
                onClick={handleCancel}
                variant="ghost"
                className="text-text-muted hover:text-text-primary"
              >
                {options.cancelLabel || 'Cancel'}
              </Button>
              <Button
                onClick={handleConfirm}
                variant={options.variant === 'danger' ? 'danger' : 'primary'}
              >
                {options.confirmLabel || 'Confirm'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
};
