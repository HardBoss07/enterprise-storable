export interface FileNode {
  id: number;
  name: string;
  size: number | null;
  mime: string | null;
  storageKey: string | null;
  createdAt: string;
  modifiedAt: string;
  deletedAt: string | null;
  ownerId: string;
  parentId: number | null;
  folder: boolean;
}
