import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ViewMode } from '../types/agenda.types';

interface AgendaToolbarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  periodLabel: string;
}

const VIEW_MODE_TABS: [ViewMode, string][] = [
  ['day', 'D'],
  ['week', 'S'],
  ['month', 'M'],
  ['list', 'L'],
];

export default function AgendaToolbar({ viewMode, onViewModeChange, periodLabel }: AgendaToolbarProps) {
  return (
    <div className="flex items-center gap-2 mb-4 flex-wrap">
      {/* View mode tabs */}
      <div className="flex border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
        {VIEW_MODE_TABS.map(([mode, label]) => (
          <button
            key={mode}
            onClick={() => onViewModeChange(mode)}
            className={`px-4 py-2 text-sm font-semibold transition-colors border-r border-gray-200 last:border-0
              ${viewMode === mode ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}
            `}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Period navigation */}
      <button className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 shadow-sm">
        <ChevronLeft className="w-4 h-4 text-gray-600" />
      </button>
      <span className="text-sm font-semibold text-gray-900 min-w-[180px] text-center">
        {periodLabel}
      </span>
      <button className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 shadow-sm">
        <ChevronRight className="w-4 h-4 text-gray-600" />
      </button>

      <button className="px-3 py-2 text-sm font-medium text-blue-600 border border-blue-200 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
        Hoy
      </button>

      <div className="ml-auto text-xs text-gray-400 flex items-center gap-1">
        <span className="inline-block w-2 h-2 bg-gray-300 rounded-sm" />
        Arrastra para mover citas
      </div>
    </div>
  );
}
