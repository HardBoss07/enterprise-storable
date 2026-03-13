"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  variant?: "ghost" | "secondary" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  iconSize?: number;
  isLoading?: boolean;
}

/**
 * A reusable icon-only button component.
 */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      icon: Icon,
      variant = "ghost",
      size = "md",
      iconSize = 18,
      isLoading,
      ...props
    },
    ref,
  ) => {
    const variants = {
      ghost: "btn-icon-ghost",
      secondary: "btn-icon-secondary",
      outline: "btn-icon-outline",
      danger: "btn-icon-danger",
    };

    const sizes = {
      sm: "btn-icon-sm",
      md: "btn-icon-md",
      lg: "btn-icon-lg",
    };

    return (
      <button
        ref={ref}
        className={cn("btn-base", variants[variant], sizes[size], className)}
        disabled={isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="btn-spinner mr-0" />
        ) : (
          <Icon
            size={iconSize}
            className={cn(
              className?.includes("animate-spin") && "animate-spin",
            )}
          />
        )}
      </button>
    );
  },
);

IconButton.displayName = "IconButton";
