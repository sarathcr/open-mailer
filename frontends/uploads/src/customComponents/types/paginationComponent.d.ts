import { UploadFile } from '@/app/dashboard/types';

/* eslint-disable no-unused-vars */
export interface PaginationProps {
  currentPage: number;
  files: UploadFile[];
  pageSize: number;
  totalFiles: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  currentLimit?: number;
  onLimitChange?: (newLimit: number) => void;
  showLimitSelector?: boolean;
}
