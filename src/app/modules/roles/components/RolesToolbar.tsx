import { Search, X } from 'lucide-react';

interface RolesToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onOpenCatalog: () => void;
}

// Search input (with a clear button) plus the "mirar permisos" catalog action.
export default function RolesToolbar({ search, onSearchChange, onOpenCatalog }: RolesToolbarProps) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <div className="app-page-search relative flex-1 max-w-lg">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Buscar roles..."
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
        onClick={onOpenCatalog}
        className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
      >
        mirar permisos
      </button>
    </div>
  );
}
