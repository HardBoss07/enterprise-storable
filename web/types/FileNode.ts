export interface FileNode {
  id: number;
  name: string;
  path: string;
  size: number | null;
  createdAt: string;
  modifiedAt: string;
  ownerId: number;
  parentId: number | null;
  isFolder: boolean;
}
