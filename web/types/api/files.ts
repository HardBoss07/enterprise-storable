export interface FileNode {
  id: number;
  name: string;
  size: number | null;
  mime: string | null;
  storageKey: string | null;
  createdAt: string;
  modifiedAt: string;
  isDeleted: boolean;
  deletedAt: string | null;
  originalPath: string | null;
  isFavorite: boolean;
  ownerId: string;
  parentId: number | null;
  folder: boolean;
  privilege: "VIEW" | "EDIT" | "OWNER" | null;
}

export interface CreateFolderPayload {
  name: string;
  parentId: number | null;
}

export interface UploadFilePayload {
  file: File;
  parentId: number | null;
}
