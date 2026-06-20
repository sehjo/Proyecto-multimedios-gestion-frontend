import { FileDown, Filter, ChevronDown, CheckCircle2, XCircle } from 'lucide-react';
import { SPECIALTY_OPTIONS } from '../constants';
import type { DoctorOccupancyRow, DoctorOccupancyTotals } from '../types/doctorOccupancyReport.types';

interface Props {
  rows: DoctorOccupancyRow[];
  totals: DoctorOccupancyTotals;
  overallDailyAvg: string;
  specialtyFilter: string;
  onSpecialtyFilterChange: (value: string) => void;
  onApplySpecialtyFilter: () => void;
}

const TABLE_COLUMNS = ['Doctor', 'Especialidad', 'Citas Asignadas', 'Atendidas', 'Canceladas', 'Promedio Diario'];

export default function DoctorOccupancyResultsCard({
  rows, totals, overallDailyAvg, specialtyFilter, onSpecialtyFilterChange, onApplySpecialtyFilter,
}: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-gray-100">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Ocupación por Doctor</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {rows.length} {rows.length === 1 ? 'doctor encontrado' : 'doctores encontrados'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={specialtyFilter}
                onChange={e => onSpecialtyFilterChange(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {SPECIALTY_OPTIONS.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            </div>
            <button
              onClick={onApplySpecialtyFilter}
              className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
            >
              <Filter className="w-3.5 h-3.5" />
              Aplicar filtro
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-red-200 hover:bg-red-50 text-red-600 text-sm font-medium rounded-lg transition-colors">
            <FileDown className="w-4 h-4" />
            Exportar PDF
          </button>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {TABLE_COLUMNS.map(col => (
                <th key={col} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rows.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4 font-medium text-gray-900">{row.doctor}</td>
                <td className="px-5 py-4 text-gray-600">{row.specialty}</td>
                <td className="px-5 py-4">
                  {row.assigned === 0
                    ? <span className="text-gray-400 text-xs italic">Sin citas</span>
                    : <span className="font-semibold text-blue-600">{row.assigned}</span>}
                </td>
                <td className="px-5 py-4">
                  {row.attended === 0 && row.assigned === 0
                    ? <span className="text-gray-400">—</span>
                    : <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700"><CheckCircle2 className="w-3 h-3" />{row.attended}</span>}
                </td>
                <td className="px-5 py-4">
                  {row.cancelled === 0 && row.assigned === 0
                    ? <span className="text-gray-400">—</span>
                    : <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-600"><XCircle className="w-3 h-3" />{row.cancelled}</span>}
                </td>
                <td className="px-5 py-4">
                  {row.assigned === 0
                    ? <span className="text-gray-400 text-xs italic">N/A</span>
                    : <span className="font-semibold text-orange-500">{row.dailyAverage.toFixed(1)}</span>}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-sm text-gray-400">
                  No se encontraron datos con los parámetros seleccionados.
                </td>
              </tr>
            )}
            {rows.length > 0 && (
              <tr className="bg-gray-50 border-t-2 border-gray-200">
                <td className="px-5 py-4 font-bold text-gray-900" colSpan={2}>Total general</td>
                <td className="px-5 py-4 font-bold text-blue-600">{totals.assigned}</td>
                <td className="px-5 py-4">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                    <CheckCircle2 className="w-3 h-3" />{totals.attended}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-600">
                    <XCircle className="w-3 h-3" />{totals.cancelled}
                  </span>
                </td>
                <td className="px-5 py-4 font-bold text-orange-500">{overallDailyAvg}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-gray-100">
        {rows.map((row, i) => (
          <div key={i} className="p-4 space-y-3">
            <div>
              <p className="font-medium text-gray-900 text-sm">{row.doctor}</p>
              <p className="text-xs text-gray-500">{row.specialty}</p>
            </div>
            {row.assigned === 0 ? (
              <p className="text-xs text-gray-400 italic">Este doctor no tiene citas registradas en el período.</p>
            ) : (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-blue-50 rounded-lg p-2 text-center">
                  <p className="text-gray-500">Asignadas</p>
                  <p className="font-bold text-blue-600 text-base">{row.assigned}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-2 text-center">
                  <p className="text-green-600">Atendidas</p>
                  <p className="font-bold text-green-700 text-base">{row.attended}</p>
                </div>
                <div className="bg-red-50 rounded-lg p-2 text-center">
                  <p className="text-red-500">Canceladas</p>
                  <p className="font-bold text-red-600 text-base">{row.cancelled}</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-2 text-center">
                  <p className="text-orange-500">Prom. Diario</p>
                  <p className="font-bold text-orange-600 text-base">{row.dailyAverage.toFixed(1)}</p>
                </div>
              </div>
            )}
          </div>
        ))}
        {rows.length > 0 && (
          <div className="p-4 bg-gray-50 space-y-2">
            <p className="font-bold text-gray-900 text-sm">Total general</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-blue-100 rounded-lg p-2 text-center">
                <p className="text-gray-500">Asignadas</p>
                <p className="font-bold text-blue-700 text-base">{totals.assigned}</p>
              </div>
              <div className="bg-green-100 rounded-lg p-2 text-center">
                <p className="text-green-700">Atendidas</p>
                <p className="font-bold text-green-800 text-base">{totals.attended}</p>
              </div>
              <div className="bg-red-100 rounded-lg p-2 text-center">
                <p className="text-red-600">Canceladas</p>
                <p className="font-bold text-red-700 text-base">{totals.cancelled}</p>
              </div>
              <div className="bg-orange-100 rounded-lg p-2 text-center">
                <p className="text-orange-600">Prom. Diario</p>
                <p className="font-bold text-orange-700 text-base">{overallDailyAvg}</p>
              </div>
            </div>
          </div>
        )}
        {rows.length === 0 && (
          <div className="p-8 text-center text-sm text-gray-400">
            No se encontraron datos con los parámetros seleccionados.
          </div>
        )}
      </div>
    </div>
  );
}
