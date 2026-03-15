"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "info") => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, message, type }]);

      // Auto-remove after 5 seconds
      setTimeout(() => {
        removeToast(id);
      }, 5000);
    },
    [removeToast],
  );

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem = ({
  toast,
  onRemove,
}: {
  toast: Toast;
  onRemove: (id: string) => void;
}) => {
  const configs = {
    success: {
      icon: <CheckCircle className="text-primary" size={20} />,
      bg: "bg-primary/10 border-primary/30 shadow-primary/10",
      text: "text-primary",
    },
    error: {
      icon: <AlertCircle className="text-red-500" size={20} />,
      bg: "bg-red-500/10 border-red-500/30 shadow-red-500/10",
      text: "text-red-400",
    },
    warning: {
      icon: <AlertTriangle className="text-accent" size={20} />,
      bg: "bg-accent/10 border-accent/30 shadow-accent/10",
      text: "text-accent",
    },
    info: {
      icon: <Info className="text-blue-400" size={20} />,
      bg: "bg-blue-400/10 border-blue-400/30 shadow-blue-400/10",
      text: "text-blue-300",
    },
  };

  const config = configs[toast.type];

  return (
    <div
      className={cn(
        "pointer-events-auto flex items-center justify-between min-w-[320px] max-w-md p-4 rounded-2xl border shadow-2xl backdrop-blur-xl animate-in slide-in-from-right-full duration-500",
        config.bg,
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">{config.icon}</div>
        <p className={cn("text-sm font-bold tracking-tight", config.text)}>
          {toast.message}
        </p>
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="ml-4 p-1 hover:bg-white/10 rounded-full transition-colors"
      >
        <X size={16} className="text-text-muted hover:text-white" />
      </button>
    </div>
  );
};
