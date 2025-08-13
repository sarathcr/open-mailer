/* eslint-disable no-unused-vars */
export interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  currentLimit?: number;
  onLimitChange?: (newLimit: number) => void;
  showLimitSelector?: boolean;
}
