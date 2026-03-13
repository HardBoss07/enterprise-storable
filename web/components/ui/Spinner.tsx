"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * A reusable loading spinner component.
 */
export function Spinner({ size = "md", className }: SpinnerProps) {
  const sizes = {
    sm: "spinner-sm",
    md: "spinner-md",
    lg: "spinner-lg",
  };

  return (
    <div className={cn("spinner-container", className)}>
      <div className={cn("spinner-element", sizes[size])} />
    </div>
  );
}
