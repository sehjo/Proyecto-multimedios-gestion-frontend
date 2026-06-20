import { ChevronLeft, ChevronRight } from 'lucide-react';
import ActivityActionBadge from './ActivityActionBadge';
import type { ActivityEntry } from '../types/activityHistory.types';
import { PAGE_SIZE } from '../constants';

interface ActivityResultsSectionProps {
  filtered: ActivityEntry[];
  paginated: ActivityEntry[];
  page: number;
  totalPages: number;
  isFiltered: boolean;
  onPageChange: (page: number) => void;
}

const TABLE_COLUMNS = ['Usuario', 'Acción', 'Módulo', 'Fecha', 'Hora', 'Detalles'];

export default function ActivityResultsSection({
  filtered,
  paginated,
  page,
  totalPages,
  isFiltered,
  onPageChange,
}: ActivityResultsSectionProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-gray-100">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Registro de Actividades</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {isFiltered ? (
              <>
                Se encontraron <strong className="text-gray-700">{filtered.length}</strong>{' '}
                {filtered.length === 1 ? 'registro' : 'registros'} que coinciden con los filtros
                aplicados.
              </>
            ) : (
              <>{filtered.length} registros en total</>
            )}
          </p>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {TABLE_COLUMNS.map((col) => (
                <th
                  key={col}
                  className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {paginated.map((entry) => (
              <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4">
                  <p className="font-medium text-gray-900">{entry.user}</p>
                  <p className="text-xs text-gray-400">{entry.role}</p>
                </td>
                <td className="px-5 py-4">
                  <ActivityActionBadge action={entry.action} />
                </td>
                <td className="px-5 py-4 text-gray-600">{entry.module}</td>
                <td className="px-5 py-4 text-gray-700 whitespace-nowrap">{entry.date}</td>
                <td className="px-5 py-4 text-gray-700 whitespace-nowrap font-mono">{entry.time}</td>
                <td className="px-5 py-4 text-gray-500 text-xs max-w-xs truncate" title={entry.details}>
                  {entry.details}
                  {entry.result === 'Fallido' && (
                    <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-600">
                      Fallido
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-sm text-gray-400">
                  No se encontraron registros con los filtros seleccionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-gray-100">
        {paginated.map((entry) => (
          <div key={entry.id} className="p-4 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium text-gray-900 text-sm">{entry.user}</p>
                <p className="text-xs text-gray-400">{entry.role}</p>
              </div>
              <ActivityActionBadge action={entry.action} size="sm" />
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="font-medium text-gray-700">{entry.module}</span>
              <span>·</span>
              <span>{entry.date}</span>
              <span>·</span>
              <span className="font-mono">{entry.time}</span>
              {entry.result === 'Fallido' && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-600">
                  Fallido
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 truncate">{entry.details}</p>
          </div>
        ))}
        {paginated.length === 0 && (
          <div className="p-8 text-center text-sm text-gray-400">
            No se encontraron registros con los filtros seleccionados.
          </div>
        )}
      </div>

      {/* Pagination */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-t border-gray-100 bg-gray-50">
          <p className="text-sm text-gray-500">
            Página <strong className="text-gray-700">{page}</strong> de{' '}
            <strong className="text-gray-700">{totalPages}</strong>
            {' '}· mostrando {(page - 1) * PAGE_SIZE + 1}–
            {Math.min(page * PAGE_SIZE, filtered.length)} de {filtered.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page === 1}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </button>
            <button
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
