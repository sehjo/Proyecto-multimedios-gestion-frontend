import { CalendarOff, Trash2, CalendarX } from 'lucide-react';
import { formatDatesSummary } from '../holidays.format';
import type { Holiday } from '../types/holidays.types';

interface HolidayListProps {
  holidays: Holiday[];
  onRemove: (id: string) => void;
}

// Lists the registered holidays/closures with their reason, newest dates last.
export default function HolidayList({ holidays, onRemove }: HolidayListProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Cierres registrados</h3>
        <span className="text-xs text-gray-500">
          {holidays.length} feriado{holidays.length !== 1 ? 's' : ''}
        </span>
      </div>

      {holidays.length === 0 ? (
        <div className="px-5 py-12 text-center">
          <CalendarOff className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No hay días feriados registrados.</p>
          <p className="text-xs text-gray-400 mt-1">
            Use el formulario para registrar el primer cierre.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-100">
          {holidays.map((holiday) => (
            <li key={holiday.id} className="flex items-start gap-3 px-5 py-3">
              <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                <CalendarX className="w-4 h-4 text-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-gray-900 text-sm">{holiday.title}</span>
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                    Cerrado
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  {formatDatesSummary(holiday.dates)}
                  {holiday.dates.length > 1 && (
                    <span className="text-gray-400"> · {holiday.dates.length} días</span>
                  )}
                </p>
                {holiday.description && (
                  <p className="text-xs text-gray-400 mt-1">{holiday.description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => onRemove(holiday.id)}
                aria-label="Eliminar feriado"
                className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50 flex-shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
