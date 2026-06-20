import { ChevronLeft, ChevronRight } from 'lucide-react';

interface UsersPaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

// Prev/next pager with the "Página X de Y · N usuarios" summary.
export default function UsersPagination({
  page,
  totalPages,
  totalItems,
  onPageChange,
}: UsersPaginationProps) {
  return (
    <div className="mt-4 flex items-center justify-between gap-3">
      <span className="text-sm text-gray-500">
        Página {page} de {totalPages} · {totalItems} usuario{totalItems === 1 ? '' : 's'}
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="flex items-center gap-1 px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          Anterior
        </button>
        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          className="flex items-center gap-1 px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Siguiente
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
