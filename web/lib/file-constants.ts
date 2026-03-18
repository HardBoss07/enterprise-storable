import {
  FileText,
  FileChartColumn,
  FileSpreadsheet,
  FileImage,
  FileArchive,
  FileVolume,
  FileVideoCamera,
  FileBox,
  FileCog,
  FileCodeCorner,
  FileBracesCorner,
  FileKey,
  File,
  LucideIcon,
} from "lucide-react";

/**
 * Interface for file type configuration.
 */
export interface FileTypeConfig {
  icon: LucideIcon;
  color: string;
}

/**
 * Strict mapping of file extensions to their respective Lucide icons and hex colors.
 * Based on the 'File Colors' specification.
 */
export const FILE_EXTENSION_MAP: Record<string, FileTypeConfig> = {
  // Stylized Text
  docx: { icon: FileText, color: "#2b579a" },
  rtf: { icon: FileText, color: "#2b579a" },
  odt: { icon: FileText, color: "#2b579a" },
  pages: { icon: FileText, color: "#2b579a" },

  // Fully Fletched
  pdf: { icon: FileText, color: "#f40f02" },

  // Slideshows
  pptx: { icon: FileChartColumn, color: "#d24726" },
  odp: { icon: FileChartColumn, color: "#d24726" },
  key: { icon: FileChartColumn, color: "#d24726" },

  // Spreadsheets
  xlsx: { icon: FileSpreadsheet, color: "#217346" },
  ods: { icon: FileSpreadsheet, color: "#217346" },
  csv: { icon: FileSpreadsheet, color: "#217346" },

  // Images
  png: { icon: FileImage, color: "#00a4ef" },
  svg: { icon: FileImage, color: "#00a4ef" },
  jpeg: { icon: FileImage, color: "#00a4ef" },
  jpg: { icon: FileImage, color: "#00a4ef" },
  webp: { icon: FileImage, color: "#00a4ef" },

  // Archives
  rar: { icon: FileArchive, color: "#ffb900" },
  zip: { icon: FileArchive, color: "#ffb900" },
  gzip: { icon: FileArchive, color: "#ffb900" },
  jar: { icon: FileArchive, color: "#ffb900" },
  "7z": { icon: FileArchive, color: "#ffb900" },

  // Audio Files
  mp3: { icon: FileVolume, color: "#ec4899" },
  wav: { icon: FileVolume, color: "#ec4899" },
  m4a: { icon: FileVolume, color: "#ec4899" },
  flac: { icon: FileVolume, color: "#ec4899" },

  // Video Files
  mp4: { icon: FileVideoCamera, color: "#8b5cf6" },
  mov: { icon: FileVideoCamera, color: "#8b5cf6" },
  webm: { icon: FileVideoCamera, color: "#8b5cf6" },
  mkv: { icon: FileVideoCamera, color: "#8b5cf6" },

  // 3D Files
  obj: { icon: FileBox, color: "#6366f1" },
  fbx: { icon: FileBox, color: "#6366f1" },
  stl: { icon: FileBox, color: "#6366f1" },
  glb: { icon: FileBox, color: "#6366f1" },

  // Config Files
  conf: { icon: FileCog, color: "#64748b" },
  gitignore: { icon: FileCog, color: "#64748b" },
  env: { icon: FileCog, color: "#64748b" },
  ini: { icon: FileCog, color: "#64748b" },

  // Markup Lang
  html: { icon: FileCodeCorner, color: "#E44D26" },
  xml: { icon: FileCodeCorner, color: "#E44D26" },
  yml: { icon: FileCodeCorner, color: "#E44D26" },
  yaml: { icon: FileCodeCorner, color: "#E44D26" },

  // Source Code
  rs: { icon: FileBracesCorner, color: "#10b981" },
  ts: { icon: FileBracesCorner, color: "#10b981" },
  jsx: { icon: FileBracesCorner, color: "#10b981" },
  c: { icon: FileBracesCorner, color: "#10b981" },
  php: { icon: FileBracesCorner, color: "#10b981" },
  sql: { icon: FileBracesCorner, color: "#10b981" },
  java: { icon: FileBracesCorner, color: "#10b981" },

  // Key / Secured
  asc: { icon: FileKey, color: "#d4af37" },
  pgp: { icon: FileKey, color: "#d4af37" },
  gpg: { icon: FileKey, color: "#d4af37" },
  pem: { icon: FileKey, color: "#d4af37" },
  pub: { icon: FileKey, color: "#d4af37" },

  // Text Fallback
  txt: { icon: FileText, color: "#94a3b8" },
  log: { icon: FileText, color: "#94a3b8" },
  md: { icon: FileText, color: "#94a3b8" },

  // Binary Fallback
  bin: { icon: File, color: "#475569" },
  exe: { icon: File, color: "#475569" },
  dll: { icon: File, color: "#475569" },
  class: { icon: File, color: "#475569" },
};

/**
 * List of known text-based extensions for fallback logic.
 */
const COMMON_TEXT_EXTENSIONS = [
  "txt",
  "log",
  "md",
  "json",
  "js",
  "ts",
  "tsx",
  "jsx",
  "py",
  "sh",
  "bat",
  "c",
  "cpp",
  "h",
  "hpp",
  "rs",
  "go",
  "java",
  "css",
  "scss",
  "html",
  "xml",
  "yaml",
  "yml",
  "ini",
  "conf",
  "env",
  "gitignore",
];

/**
 * Resolves the icon and color for a given file extension.
 * @param extension The file extension (with or without leading dot).
 * @returns A FileTypeConfig object with the icon component and its hex color.
 */
export function getFileConfig(
  extension: string | null | undefined,
): FileTypeConfig {
  const ext = (extension || "").toLowerCase().replace(/^\./, "");

  if (FILE_EXTENSION_MAP[ext]) {
    return FILE_EXTENSION_MAP[ext];
  }

  // Defaulting logic based on text vs binary
  if (COMMON_TEXT_EXTENSIONS.includes(ext)) {
    return { icon: FileText, color: "#94a3b8" };
  }

  return { icon: File, color: "#475569" };
}
