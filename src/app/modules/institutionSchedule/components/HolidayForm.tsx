import { CalendarPlus, AlertCircle, X, CalendarDays } from 'lucide-react';
import { formatShortDate } from '../holidays.format';
import type { HolidayFormData, HolidayFormErrors } from '../types/holidays.types';

interface HolidayFormProps {
  form: HolidayFormData;
  errors: HolidayFormErrors;
  onFieldChange: (field: 'title' | 'description', value: string) => void;
  onRemoveDate: (date: string) => void;
  onClearDates: () => void;
  onSubmit: () => void;
}

// Form to register a holiday / closure: the closure days are picked in the
// calendar and summarized here, plus a public title and an internal description
// (HU-039, scenario 1).
export default function HolidayForm({
  form,
  errors,
  onFieldChange,
  onRemoveDate,
  onClearDates,
  onSubmit,
}: HolidayFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const sortedDates = [...form.dates].sort();

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 space-y-4"
    >
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-gray-700">
            Días de cierre <span className="text-red-500">*</span>
          </label>
          {sortedDates.length > 0 && (
            <button
              type="button"
              onClick={onClearDates}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Limpiar
            </button>
          )}
        </div>

        {sortedDates.length === 0 ? (
          <p className="flex items-center gap-1.5 text-sm text-gray-400">
            <CalendarDays className="w-4 h-4 flex-shrink-0" />
            Seleccione uno o más días en el calendario.
          </p>
        ) : (
          <>
            <p className="text-sm font-medium text-gray-900 mb-2">
              {sortedDates.length} día{sortedDates.length !== 1 ? 's' : ''} seleccionado
              {sortedDates.length !== 1 ? 's' : ''}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {sortedDates.map((date) => (
                <span
                  key={date}
                  className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full pl-2.5 pr-1.5 py-1"
                >
                  {formatShortDate(date)}
                  <button
                    type="button"
                    onClick={() => onRemoveDate(date)}
                    aria-label={`Quitar ${formatShortDate(date)}`}
                    className="hover:text-blue-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </>
        )}

        {errors.dates && (
          <p className="flex items-center gap-1 text-xs text-red-600 mt-1.5">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {errors.dates}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Título del evento <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          maxLength={100}
          placeholder="ej. Batalla de Rivas"
          value={form.title}
          onChange={(e) => onFieldChange('title', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.title ? 'border-red-400 bg-red-50' : 'border-gray-300'
          }`}
        />
        {errors.title && (
          <p className="flex items-center gap-1 text-xs text-red-600 mt-1">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {errors.title}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción interna
        </label>
        <textarea
          rows={3}
          maxLength={500}
          placeholder="Notas internas sobre el cierre (opcional)..."
          value={form.description}
          onChange={(e) => onFieldChange('description', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
        <p className="text-right text-xs text-gray-400 mt-0.5">{form.description.length}/500</p>
      </div>

      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
      >
        <CalendarPlus className="w-4 h-4" />
        Registrar cierre
      </button>
    </form>
  );
}
