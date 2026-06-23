import { Filter, X } from 'lucide-react';
import SelectChevron from './SelectChevron';
import { STATUS_CONFIG } from '../constants';
import type { AppointmentStatus, Doctor } from '../types/appointments.types';

interface AppointmentsFilterBarProps {
  doctors: Doctor[];
  filterDoctor: string;
  onFilterDoctorChange: (value: string) => void;
  filterDate: string;
  onFilterDateChange: (value: string) => void;
  filterStatus: string;
  onFilterStatusChange: (value: string) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  filteredCount: number;
  totalCount: number;
}

export default function AppointmentsFilterBar({
  doctors,
  filterDoctor,
  onFilterDoctorChange,
  filterDate,
  onFilterDateChange,
  filterStatus,
  onFilterStatusChange,
  hasActiveFilters,
  onClearFilters,
  filteredCount,
  totalCount,
}: AppointmentsFilterBarProps) {
  return (
    <div className="mb-5 bg-white rounded-xl border border-gray-200 px-4 py-3">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex items-center gap-1.5 text-sm font-medium text-gray-600 mr-1">
          <Filter className="w-4 h-4" />
          Filtros
        </div>

        <div className="flex-1 min-w-[160px]">
          <label className="block text-xs text-gray-500 mb-1">Doctor</label>
          <div className="relative">
            <select
              value={filterDoctor}
              onChange={(e) => onFilterDoctorChange(e.target.value)}
              className="w-full appearance-none text-sm px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Todos</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} {d.lastname}
                </option>
              ))}
            </select>
            <SelectChevron />
          </div>
        </div>

        <div className="flex-1 min-w-[160px]">
          <label className="block text-xs text-gray-500 mb-1">Fecha</label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => onFilterDateChange(e.target.value)}
            className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex-1 min-w-[160px]">
          <label className="block text-xs text-gray-500 mb-1">Estado</label>
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => onFilterStatusChange(e.target.value)}
              className="w-full appearance-none text-sm px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Todos</option>
              {(Object.keys(STATUS_CONFIG) as AppointmentStatus[]).map((s) => (
                <option key={s} value={s}>
                  {STATUS_CONFIG[s].label}
                </option>
              ))}
            </select>
            <SelectChevron />
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <X className="w-4 h-4" />
            Limpiar
          </button>
        )}
      </div>

      {hasActiveFilters && (
        <p className="mt-2 text-xs text-gray-400">
          {filteredCount} de {totalCount} cita{totalCount !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
}
