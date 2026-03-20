"use client";

import React from "react";
import { cn } from "@/lib/utils";

/**
 * Props for the Button component.
 * Extends standard button HTML attributes.
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** The visual variant of the button. */
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "accent";
  /** The size of the button. */
  size?: "sm" | "md" | "lg" | "icon";
  /** Whether the button is in a loading state. */
  isLoading?: boolean;
}

/**
 * Atom: A reusable button component with various variants and sizes.
 * Follows the Strict Atomic Design System as a stateless primitive.
 *
 * @param {ButtonProps} props - The component props.
 * @returns {JSX.Element} The rendered Button component.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const variants = {
      primary: "btn-primary",
      accent: "btn-accent",
      secondary: "btn-secondary",
      outline: "btn-outline",
      ghost: "btn-ghost",
      danger: "btn-danger",
    };

    const sizes = {
      sm: "btn-sm",
      md: "btn-md",
      lg: "btn-lg",
      icon: "btn-icon-pad",
    };

    return (
      <button
        ref={ref}
        disabled={isLoading || disabled}
        className={cn("btn-base", variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? <span className="btn-spinner" /> : null}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
