import { Users } from 'lucide-react';
import { WEEKDAYS } from '../constants';
import type { WeekdayKey } from '../types/institutionSchedule.types';

interface BulkTargetBarProps {
  selectedDays: WeekdayKey[];
  onToggle: (weekday: WeekdayKey) => void;
}

// Picks the target days for bulk edits: a row of weekday pills. Days marked here
// receive a schedule copied from a row via its "Aplicar a seleccionados" button.
export default function BulkTargetBar({ selectedDays, onToggle }: BulkTargetBarProps) {
  const selectedSet = new Set(selectedDays);

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2 bg-white border border-gray-200 rounded-xl shadow-sm px-4 py-3">
      <span className="flex items-center gap-1.5 text-sm font-medium text-gray-600 mr-1">
        <Users className="w-4 h-4" />
        Aplicar a:
      </span>
      {WEEKDAYS.map(({ key, short }) => {
        const isActive = selectedSet.has(key);
        return (
          <button
            key={key}
            type="button"
            onClick={() => onToggle(key)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
              isActive
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-white border-gray-300 text-gray-600 hover:border-blue-400'
            }`}
          >
            {short}
          </button>
        );
      })}
      {selectedDays.length > 0 && (
        <span className="text-xs text-gray-400 ml-1">
          {selectedDays.length} día{selectedDays.length !== 1 ? 's' : ''} · use “Aplicar a
          seleccionados” en un día para copiar su horario.
        </span>
      )}
    </div>
  );
}
