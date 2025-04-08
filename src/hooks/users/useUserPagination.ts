
import { useState } from 'react';

export const useUserPagination = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    currentPage,
    pageSize,
    setPageSize,
    handlePageChange
  };
};
