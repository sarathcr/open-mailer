export interface UploadFile {
  name: string;
  path: string;
  type: string;
  size: number;
  fileType: string;
  lastModified: string;
  url: string;
  appName: string;
  userId: string;
  thumbnail: string;
  isPrivate: boolean;
}

export interface PaginatedFile {
  currentPage: number;
  files: UploadFile[];
  pageSize: number;
  totalFiles: number;
  totalPages: number;
}

export interface FileData {
  fileType: string;
  thumbnail?: string;
  name?: string;
}
