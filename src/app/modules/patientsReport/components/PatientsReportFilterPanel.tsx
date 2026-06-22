import { CalendarDays, PlayCircle, RotateCcw, ChevronDown } from 'lucide-react';
import { DOCTOR_OPTIONS, SPECIALTY_OPTIONS } from '../constants';
import type { PatientsReportFilters } from '../types/patientsReport.types';

interface PatientsReportFilterPanelProps {
  filters: PatientsReportFilters;
  onFilterChange: (filters: PatientsReportFilters) => void;
  onGenerate: () => void;
  onClear: () => void;
}

export default function PatientsReportFilterPanel({
  filters,
  onFilterChange,
  onGenerate,
  onClear,
}: PatientsReportFilterPanelProps) {
  const set = (key: keyof PatientsReportFilters, value: string) =>
    onFilterChange({ ...filters, [key]: value });

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
      <div className="flex items-center gap-2 mb-5">
        <CalendarDays className="w-4 h-4 text-blue-600" />
        <h2 className="text-base font-semibold text-gray-900">Parámetros del Reporte</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { key: 'dateFrom' as const, label: 'Fecha inicio', type: 'date' as const },
          { key: 'dateTo'   as const, label: 'Fecha fin',    type: 'date' as const },
        ].map(({ key, label }) => (
          <div key={key} className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">{label}</label>
            <div className="relative">
              <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="date"
                value={filters[key]}
                onChange={(e) => set(key, e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        ))}

        {[
          { key: 'doctor'    as const, label: 'Doctor',       options: DOCTOR_OPTIONS    },
          { key: 'specialty' as const, label: 'Especialidad', options: SPECIALTY_OPTIONS },
        ].map(({ key, label, options }) => (
          <div key={key} className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">{label}</label>
            <div className="relative">
              <select
                value={filters[key]}
                onChange={(e) => set(key, e.target.value)}
                className="w-full appearance-none pl-3 pr-8 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {options.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-5 pt-5 border-t border-gray-100">
        <button
          onClick={onGenerate}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <PlayCircle className="w-4 h-4" />
          Generar reporte
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
