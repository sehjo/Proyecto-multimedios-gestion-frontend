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
    <div className="mb-4 bg-white border border-gray-200 rounded-xl shadow-sm px-4 py-3">
      <p className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
        <Users className="w-4 h-4 text-blue-600" />
        Copiar un horario a varios días
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-gray-500 mr-1">1. Marca los días a igualar:</span>
        {WEEKDAYS.map(({ key, short, label }) => {
          const isActive = selectedSet.has(key);
          return (
            <button
              key={key}
              type="button"
              onClick={() => onToggle(key)}
              aria-label={label}
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
      </div>
      <p className="text-xs text-gray-400 mt-2">
        {selectedDays.length > 0
          ? `2. Pulsa “Copiar a estos días” en el día cuyo horario quieras replicar en los ${selectedDays.length} marcados.`
          : '2. Luego pulsa “Copiar a estos días” en el día cuyo horario quieras replicar.'}
      </p>
    </div>
  );
}
