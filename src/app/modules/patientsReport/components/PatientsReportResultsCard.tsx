import { FileDown, UserPlus, UserCheck } from 'lucide-react';
import type { ReportRow, ReportTotals } from '../types/patientsReport.types';

const TABLE_COLUMNS = ['Doctor', 'Especialidad', 'Pacientes Únicos', 'Total Consultas', 'Nuevos', 'Recurrentes'];

interface PatientsReportResultsCardProps {
  rows: ReportRow[];
  totals: ReportTotals;
}

export default function PatientsReportResultsCard({ rows, totals }: PatientsReportResultsCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-gray-100">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Atendidos por Doctor / Especialidad</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {rows.length} {rows.length === 1 ? 'combinación encontrada' : 'combinaciones encontradas'}
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-red-200 hover:bg-red-50 text-red-600 text-sm font-medium rounded-lg transition-colors self-start sm:self-auto">
          <FileDown className="w-4 h-4" />
          Exportar PDF
        </button>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {TABLE_COLUMNS.map((col) => (
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
                  <span className="font-semibold text-blue-600">{row.uniquePatients}</span>
                </td>
                <td className="px-5 py-4 text-gray-700">{row.consultations}</td>
                <td className="px-5 py-4">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    <UserPlus className="w-3 h-3" />{row.newPatients}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                    <UserCheck className="w-3 h-3" />{row.recurringPatients}
                  </span>
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
                <td className="px-5 py-4 font-bold text-blue-600">{totals.uniquePatients}</td>
                <td className="px-5 py-4 font-bold text-gray-900">{totals.consultations}</td>
                <td className="px-5 py-4">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                    <UserPlus className="w-3 h-3" />{totals.newPatients}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700">
                    <UserCheck className="w-3 h-3" />{totals.recurringPatients}
                  </span>
                </td>
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
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-blue-50 rounded-lg p-2 text-center">
                <p className="text-gray-500">Únicos</p>
                <p className="font-bold text-blue-600 text-base">{row.uniquePatients}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <p className="text-gray-500">Consultas</p>
                <p className="font-bold text-gray-700 text-base">{row.consultations}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-2 text-center">
                <p className="text-green-600">Nuevos</p>
                <p className="font-bold text-green-700 text-base">{row.newPatients}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-2 text-center">
                <p className="text-purple-600">Recurrentes</p>
                <p className="font-bold text-purple-700 text-base">{row.recurringPatients}</p>
              </div>
            </div>
          </div>
        ))}
        {rows.length > 0 && (
          <div className="p-4 bg-gray-50 space-y-2">
            <p className="font-bold text-gray-900 text-sm">Total general</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-blue-100 rounded-lg p-2 text-center">
                <p className="text-gray-500">Únicos</p>
                <p className="font-bold text-blue-700 text-base">{totals.uniquePatients}</p>
              </div>
              <div className="bg-gray-200 rounded-lg p-2 text-center">
                <p className="text-gray-500">Consultas</p>
                <p className="font-bold text-gray-800 text-base">{totals.consultations}</p>
              </div>
              <div className="bg-green-100 rounded-lg p-2 text-center">
                <p className="text-green-700">Nuevos</p>
                <p className="font-bold text-green-800 text-base">{totals.newPatients}</p>
              </div>
              <div className="bg-purple-100 rounded-lg p-2 text-center">
                <p className="text-purple-700">Recurrentes</p>
                <p className="font-bold text-purple-800 text-base">{totals.recurringPatients}</p>
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
