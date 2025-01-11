import React from 'react';

import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  Pagination as PaginationWrapper,
} from '@/components/ui/pagination';

type PaginationProps = {
  onPageChange: (_page: number) => void;
  page: number;
  count?: number;
  limit?: number;
  totalPages?: number;
  className?: string;
};

const Pagination = ({
  className = '',
  page = 1,
  count = 0,
  limit = 10,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  return (
    <div className={className}>
      <PaginationWrapper>
        <PaginationContent className="gap-4">
          <Button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            variant={page <= 1 ? 'ghost' : 'secondary'}
          >
            <ChevronLeft className="size-4" />
            <span className="hidden md:block">Previous</span>
          </Button>

          <PaginationButtons page={page} totalPages={totalPages} onPageChange={onPageChange} />

          <Button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages || count < limit}
            variant={page === totalPages ? 'outline' : 'secondary'}
          >
            <span className="hidden md:block">Next</span>
            <ChevronRight className="size-4" />
          </Button>
        </PaginationContent>
      </PaginationWrapper>
    </div>
  );
};

const PaginationButtons: React.FC<PaginationProps> = ({ page, totalPages, onPageChange }) => {
  if (totalPages === null || totalPages === undefined) {
    return null;
  }

  const getPagination = () => {
    const pages = [];
    const range = 0; // Show one page before and after the current page

    // Always show the first page
    pages.push(1);

    // Show gap if needed
    if (page > range + 2) {
      pages.push('...');
    }

    // Show pages around the current page
    for (let i = Math.max(2, page - range); i <= Math.min(totalPages - 1, page + range); i++) {
      pages.push(i);
    }

    // Show gap if needed
    if (page < totalPages - range - 1) {
      pages.push('...');
    }

    // Always show the last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPagination();

  return (
    <div className="relative flex items-center gap-4">
      {pages.map((idPage, index) =>
        idPage === '...' ? (
          <PaginationEllipsis key={index} />
        ) : (
          <PaginationItem key={`${idPage}-${index}`}>
            <PaginationLink
              onClick={() => onPageChange(idPage as number)}
              isActive={idPage === page}
              className="cursor-pointer"
            >
              {idPage}
            </PaginationLink>
          </PaginationItem>
        ),
      )}
    </div>
  );
};

export default Pagination;
