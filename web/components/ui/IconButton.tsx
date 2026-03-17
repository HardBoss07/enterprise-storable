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
  iconProps?: React.SVGProps<SVGSVGElement>;
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
      iconProps,
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

    // Clean the button's className to ensure no spin classes leak to the wrapper
    const cleanedClassName = className?.replace("animate-spin", "").trim();

    return (
      <button
        ref={ref}
        className={cn(
          "btn-base",
          variants[variant],
          sizes[size],
          cleanedClassName,
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        <Icon
          size={iconSize}
          {...iconProps}
          // Only the icon gets the spin
          className={cn(isLoading && "animate-spin", iconProps?.className)}
        />
      </button>
    );
  },
);

IconButton.displayName = "IconButton";
