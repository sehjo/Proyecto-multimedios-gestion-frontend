import { CalendarPlus, AlertCircle } from 'lucide-react';
import type { HolidayFormData, HolidayFormErrors } from '../types/holidays.types';

interface HolidayFormProps {
  form: HolidayFormData;
  errors: HolidayFormErrors;
  today: string;
  onFieldChange: (field: keyof HolidayFormData, value: string) => void;
  onSubmit: () => void;
}

// Form to register a holiday / closure: date (>= today), public title and an
// internal description (HU-039, scenario 1).
export default function HolidayForm({
  form,
  errors,
  today,
  onFieldChange,
  onSubmit,
}: HolidayFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fecha de cierre <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          min={today}
          value={form.date}
          onChange={(e) => onFieldChange('date', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.date ? 'border-red-400 bg-red-50' : 'border-gray-300'
          }`}
        />
        {errors.date && (
          <p className="flex items-center gap-1 text-xs text-red-600 mt-1">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {errors.date}
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
