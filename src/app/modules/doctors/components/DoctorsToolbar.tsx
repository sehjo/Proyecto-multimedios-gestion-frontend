import { Search, X } from 'lucide-react';

interface DoctorsToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onOpenSpecialities: () => void;
}

// Search input (with a clear button) plus the "Especialidades" nested-CRUD action.
export default function DoctorsToolbar({ search, onSearchChange, onOpenSpecialities }: DoctorsToolbarProps) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <div className="app-page-search relative flex-1 max-w-lg">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Buscar doctores..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      <button
        onClick={onOpenSpecialities}
        className="px-5 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
      >
        Especialidades
      </button>
    </div>
  );
}
