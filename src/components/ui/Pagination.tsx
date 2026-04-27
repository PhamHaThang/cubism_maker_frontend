import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems?: number;
    itemsPerPage?: number;
    onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
}) => {
    if (totalPages <= 1 && !totalItems) return null;

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 7;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);

            if (currentPage > 3) {
                pages.push("...");
            }

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push("...");
            }

            pages.push(totalPages);
        }

        return pages;
    };

    const handlePageClick = (page: number | string) => {
        if (typeof page === "number") {
            onPageChange(page);
        }
    };

    const pages = getPageNumbers();
    const hasMeta =
        typeof totalItems === "number" && typeof itemsPerPage === "number";
    const startItem = hasMeta ? (currentPage - 1) * itemsPerPage + 1 : 0;
    const endItem = hasMeta
        ? Math.min(totalItems, currentPage * itemsPerPage)
        : 0;

    return (
        <div
            className={`mt-8 flex items-center gap-3 ${
                hasMeta && totalItems > 0 ? "justify-between" : "justify-end"
            }`}>
            {hasMeta && totalItems > 0 && (
                <div className="text-xs text-neutral-500">
                    Showing {startItem}-{endItem} of {totalItems} levels
                </div>
            )}

            <div className="flex items-center justify-center gap-1.5">
                <button
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1 || totalPages <= 1}
                    className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    <ChevronLeft size={16} />
                </button>

                <div className="flex items-center gap-1">
                    {pages.map((page, idx) =>
                        page === "..." ? (
                            <span
                                key={`ellipsis-${idx}`}
                                className="h-9 w-9 flex items-center justify-center text-neutral-400">
                                •••
                            </span>
                        ) : (
                            <button
                                key={page}
                                onClick={() => handlePageClick(page)}
                                className={`inline-flex items-center justify-center h-9 w-9 rounded-lg text-sm font-medium transition-colors ${
                                    currentPage === page
                                        ? "bg-black text-white border border-black"
                                        : "border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
                                }`}>
                                {page}
                            </button>
                        ),
                    )}
                </div>

                <button
                    onClick={() =>
                        onPageChange(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages || totalPages <= 1}
                    className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};
