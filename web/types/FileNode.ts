export interface FileNode {
  id: string;
  name: string;
  size: number;
  createdAt: string;
  modifiedAt: string;
  ownerId: string;
  parentId: string | null;
  isFolder: boolean;
}
