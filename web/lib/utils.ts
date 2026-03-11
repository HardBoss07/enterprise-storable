/**
 * Formats a number of bytes into a human-readable string.
 * @param bytes The number of bytes to format.
 * @param decimals The number of decimal places to include.
 * @returns A formatted string (e.g., "1.5 MB").
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (!bytes || bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

/**
 * Combines multiple class names into a single string.
 * @param classes An array of class names.
 * @returns A string of class names.
 */
export function cn(
  ...classes: (string | boolean | undefined | null)[]
): string {
  return classes.filter(Boolean).join(" ");
}
