import { FileNode } from "./files";

export interface TrashItem {
  metadata: FileNode;
  daysRemaining: number;
}
