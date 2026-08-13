import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ page, setPage, totalPages }) => {
  if (!totalPages || totalPages === 0) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', page - 1, page, page + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center gap-1.5">
      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-500 transition-colors"
      >
        <ChevronLeft size={16} />
      </button>

      {getPageNumbers().map((p, idx) => (
        <button
          key={idx}
          onClick={() => p !== '...' && setPage(p)}
          disabled={p === '...'}
          className={`w-8 h-8 text-sm rounded-lg transition-colors ${
            p === page
              ? "bg-indigo-600 text-white font-semibold shadow-sm"
              : p === '...'
              ? "border border-transparent text-slate-400 cursor-default"
              : "border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
          }`}
        >
          {p}
        </button>
      ))}

      <button
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
        className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-500 transition-colors"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
