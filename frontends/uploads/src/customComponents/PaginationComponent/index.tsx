import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FC } from 'react';
import { PaginationProps } from '../types/paginationComponent';

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
        <PaginationItem className="cursor-pointer" key={i}>
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
            <SelectItem value="12">12</SelectItem>
            <SelectItem value="18">18</SelectItem>
            <SelectItem value="30">30</SelectItem>
            <SelectItem value="42">42</SelectItem>
          </SelectContent>
        </Select>
      )}

      {/* Pagination */}
      <Pagination className="mb-4 w-auto">
        <PaginationContent>
          <PaginationItem className="cursor-pointer">
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
          <PaginationItem className="cursor-pointer">
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem className="cursor-pointer">
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
