"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "primary";
}

interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within a ConfirmProvider");
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

  const handleCancel = () => {
    setIsOpen(false);
    resolveRef.current(false);
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {isOpen && options && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-bg-sidebar rounded-xl p-6 shadow-2xl border border-neutral-800 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className={cn(
                "p-2 rounded-lg",
                options.variant === "danger" ? "bg-red-500/10 text-red-500" : "bg-primary-accent/10 text-primary-accent"
              )}>
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-xl font-semibold text-neutral-100 m-0">
                {options.title || "Confirm Action"}
              </h3>
            </div>
            
            <p className="text-neutral-300 mb-8 leading-relaxed">
              {options.message}
            </p>
            
            <div className="flex items-center justify-end space-x-3">
              <Button
                onClick={handleCancel}
                variant="ghost"
                className="text-neutral-400 hover:text-neutral-100"
              >
                {options.cancelLabel || "Cancel"}
              </Button>
              <Button
                onClick={handleConfirm}
                variant={options.variant === "danger" ? "danger" : "primary"}
              >
                {options.confirmLabel || "Confirm"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
};
