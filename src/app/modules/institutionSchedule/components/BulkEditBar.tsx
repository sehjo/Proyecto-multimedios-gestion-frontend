import { useState } from 'react';
import { Plus, Trash2, Check, X } from 'lucide-react';

interface DraftInterval {
  start: string;
  end: string;
}

interface BulkEditBarProps {
  selectedCount: number;
  onApply: (enabled: boolean, intervals: DraftInterval[]) => void;
  onClear: () => void;
}

const DEFAULT_INTERVALS: DraftInterval[] = [
  { start: '07:00', end: '12:00' },
  { start: '13:00', end: '17:00' },
];

// Bulk-edit bar shown when 2+ weekdays are selected: define one set of intervals
// (or mark the days as closed) and apply it to every selected day at once.
export default function BulkEditBar({ selectedCount, onApply, onClear }: BulkEditBarProps) {
  const [enabled, setEnabled] = useState(true);
  const [intervals, setIntervals] = useState<DraftInterval[]>(DEFAULT_INTERVALS);

  const updateInterval = (index: number, change: Partial<DraftInterval>) =>
    setIntervals((prev) => prev.map((i, idx) => (idx === index ? { ...i, ...change } : i)));

  const addInterval = () =>
    setIntervals((prev) => [...prev, { start: '08:00', end: '12:00' }]);

  const removeInterval = (index: number) =>
    setIntervals((prev) => prev.filter((_, idx) => idx !== index));

  // Valid only when, if enabled, every interval has start < end.
  const intervalsValid = intervals.every((i) => i.start < i.end);
  const canApply = !enabled || (intervals.length > 0 && intervalsValid);

  return (
    <div className="mb-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
      <div className="flex items-center justify-between gap-3 mb-3">
        <p className="text-sm font-semibold text-blue-900">
          Edición en bloque · {selectedCount} días seleccionados
        </p>
        <button
          type="button"
          onClick={onClear}
          aria-label="Cancelar selección"
          className="text-blue-500 hover:text-blue-700 p-1 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-4 mb-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="bulk-enabled"
            checked={enabled}
            onChange={() => setEnabled(true)}
            className="text-blue-600"
          />
          <span className="text-sm text-gray-700">Habilitar con estas jornadas</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="bulk-enabled"
            checked={!enabled}
            onChange={() => setEnabled(false)}
            className="text-blue-600"
          />
          <span className="text-sm text-gray-700">Cerrar estos días</span>
        </label>
      </div>

      {enabled && (
        <div className="space-y-2 mb-3">
          {intervals.map((interval, index) => {
            const invalid = interval.start >= interval.end;
            return (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="time"
                  value={interval.start}
                  onChange={(e) => updateInterval(index, { start: e.target.value })}
                  className={`px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    invalid ? 'border-red-400 bg-red-50' : 'border-gray-300'
                  }`}
                />
                <span className="text-gray-400 text-sm">a</span>
                <input
                  type="time"
                  value={interval.end}
                  onChange={(e) => updateInterval(index, { end: e.target.value })}
                  className={`px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    invalid ? 'border-red-400 bg-red-50' : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => removeInterval(index)}
                  aria-label="Eliminar jornada"
                  className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
          <button
            type="button"
            onClick={addInterval}
            className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            <Plus className="w-4 h-4" />
            Agregar jornada
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => onApply(enabled, intervals)}
        disabled={!canApply}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Check className="w-4 h-4" />
        Aplicar a {selectedCount} días
      </button>
    </div>
  );
}
