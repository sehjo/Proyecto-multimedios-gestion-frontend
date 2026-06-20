import { Filter, Search, ChevronDown, RotateCcw } from 'lucide-react';
import { ACTION_TYPES, MODULES } from '../constants';
import type { ActivityFilters } from '../types/activityHistory.types';

interface ActivityFilterPanelProps {
  filters: ActivityFilters;
  onFilterChange: (filters: ActivityFilters) => void;
  onApply: () => void;
  onClear: () => void;
}

export default function ActivityFilterPanel({
  filters,
  onFilterChange,
  onApply,
  onClear,
}: ActivityFilterPanelProps) {
  const set = (key: keyof ActivityFilters, value: string) =>
    onFilterChange({ ...filters, [key]: value });

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
      <div className="flex items-center gap-2 mb-5">
        <Filter className="w-4 h-4 text-blue-600" />
        <h2 className="text-base font-semibold text-gray-900">Filtros de Búsqueda</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Usuario</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar usuario…"
              value={filters.user}
              onChange={(e) => set('user', e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Acción</label>
          <div className="relative">
            <select
              value={filters.action}
              onChange={(e) => set('action', e.target.value)}
              className="w-full appearance-none pl-3 pr-8 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {ACTION_TYPES.map((a) => (
                <option key={a.value} value={a.value}>{a.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Módulo</label>
          <div className="relative">
            <select
              value={filters.module}
              onChange={(e) => set('module', e.target.value)}
              className="w-full appearance-none pl-3 pr-8 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {MODULES.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Fecha</label>
          <input
            type="date"
            value={filters.date}
            onChange={(e) => set('date', e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-5 pt-5 border-t border-gray-100">
        <button
          onClick={onApply}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Filter className="w-4 h-4" />
          Aplicar
        </button>
        <button
          onClick={onClear}
          className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-600 text-sm font-medium rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Limpiar
        </button>
      </div>
    </div>
  );
}
