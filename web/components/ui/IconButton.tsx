"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

/**
 * Props for the IconButton component.
 */
interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** The Lucide icon component to display. */
  icon: LucideIcon;
  /** The visual variant of the button. */
  variant?: "ghost" | "secondary" | "outline" | "danger";
  /** The size of the button container. */
  size?: "sm" | "md" | "lg";
  /** The size of the icon in pixels. */
  iconSize?: number;
  /** Whether the button is in a loading state. */
  isLoading?: boolean;
  /** Optional extra props for the Lucide icon. */
  iconProps?: React.SVGProps<SVGSVGElement>;
}

/**
 * Atom: A reusable icon-only button component.
 * Follows the Strict Atomic Design System as a stateless primitive.
 *
 * @param {IconButtonProps} props - The component props.
 * @returns {JSX.Element} The rendered IconButton component.
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
          // Only the icon gets the spin if loading
          className={cn(isLoading && "animate-spin", iconProps?.className)}
        />
      </button>
    );
  },
);

IconButton.displayName = "IconButton";

export default IconButton;
