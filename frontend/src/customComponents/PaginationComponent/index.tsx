import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { PaginationProps } from '../types/paginationComponent';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FC } from 'react';

export const PaginationComponent: FC<PaginationProps> = ({
  totalPages,
  currentPage,
  currentLimit,
  onPageChange,
  onLimitChange,
  showLimitSelector = false,
}) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    onPageChange(page);
  };

  const renderPageNumbers = () => {
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={i === currentPage}
            onClick={() => handlePageClick(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pages;
  };

  return (
    <div className="my-4 flex items-center justify-center space-x-4">
      {showLimitSelector && (
        <Select
          value={String(currentLimit)}
          onValueChange={(value) => onLimitChange?.(Number(value))}
        >
          <SelectTrigger className="mb-4 w-18">
            <SelectValue placeholder="Select limit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="15">15</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="35">35</SelectItem>
            <SelectItem value="45">45</SelectItem>
          </SelectContent>
        </Select>
      )}

      {/* Pagination */}
      <Pagination className="mb-4 w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={(e) => {
                if (currentPage === 1) {
                  e.preventDefault();
                } else {
                  handlePrevious();
                }
              }}
              className={
                currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''
              }
            />
          </PaginationItem>
          {renderPageNumbers()}
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              onClick={(e) => {
                if (currentPage === totalPages) {
                  e.preventDefault();
                } else {
                  handleNext();
                }
              }}
              className={
                currentPage === totalPages
                  ? 'cursor-not-allowed opacity-50'
                  : ''
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
