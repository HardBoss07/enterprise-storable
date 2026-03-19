import { Folder } from "lucide-react";
import { getFileConfig } from "@/lib/file-constants";
import { cn } from "@/lib/utils";

/**
 * Props for the FileIcon component.
 */
interface FileIconProps extends React.ComponentProps<"svg"> {
  /** The file extension (e.g., "pdf", "docx") used to resolve the icon and color. */
  extension?: string | null;
  /** Fallback MIME type used if extension is not provided. */
  mime?: string | null;
  /** Whether the node is a folder. */
  isFolder?: boolean;
  /** Size of the icon in pixels or Tailwind units. */
  size?: number | string;
}

/**
 * Standardized File Icon component that renders the correct Lucide icon
 * and color based on file extension, using a centralized configuration.
 *
 * @param props The icon properties including extension, mime, and folder status.
 */
export function FileIcon({
  extension,
  mime,
  isFolder,
  className,
  size = 20,
  style,
  ...props
}: FileIconProps) {
  // Folders use a standard folder icon with a fixed color
  if (isFolder) {
    return (
      <Folder className={cn("text-accent", className)} size={size} {...props} />
    );
  }

  // Determine which extension string to use for lookups
  // 1. Explicit extension prop
  // 2. Extracted from MIME type (fallback)
  // 3. Null (will use generic fallback)
  const effectiveExtension = extension || (mime ? mime.split("/").pop() : null);

  // Resolve configuration from constants
  const { icon: Icon, color } = getFileConfig(effectiveExtension);

  return (
    <Icon
      size={size}
      className={className}
      // Apply the hex color from the design system as an inline style
      style={{ color, ...style }}
      {...props}
    />
  );
}

/**
 * Simple folder icon component for standalone use.
 */
export function FolderIcon(props: React.ComponentProps<"svg">) {
  return <Folder className="text-accent" {...props} />;
}
