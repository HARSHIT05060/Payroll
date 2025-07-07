import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    loading = false,
    className = '',
    maxVisiblePages = 5
}) => {
    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages = [];

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const handlePageChange = (page) => {
        if (typeof page === 'number' && page >= 1 && page <= totalPages && !loading) {
            onPageChange(page);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1 && !loading) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages && !loading) {
            onPageChange(currentPage + 1);
        }
    };

    // Don't render if there's only one page or no pages
    if (totalPages <= 1) {
        return null;
    }


    return (
        <div className={`px-6 py-4 border-t border-gray-200 bg-gray-50 ${className}`}>
            <div className="flex items-center justify-end flex-wrap gap-4">
                {/* Pagination Controls */}
                <div className="flex items-center space-x-2">
                    {/* Previous Button */}
                    <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1 || loading}
                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Previous page"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Previous
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center space-x-1">
                        {getPageNumbers().map((pageNum, index) => (
                            <button
                                key={`page-${index}`}
                                onClick={() => handlePageChange(pageNum)}
                                disabled={typeof pageNum !== 'number' || loading}
                                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${pageNum === currentPage
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : typeof pageNum === 'number'
                                            ? 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700'
                                            : 'text-gray-400 cursor-default bg-transparent'
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                aria-label={typeof pageNum === 'number' ? `Go to page ${pageNum}` : 'More pages'}
                                aria-current={pageNum === currentPage ? 'page' : undefined}
                            >
                                {pageNum}
                            </button>
                        ))}
                    </div>

                    {/* Next Button */}
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages || loading}
                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Next page"
                    >
                        Next
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Pagination;