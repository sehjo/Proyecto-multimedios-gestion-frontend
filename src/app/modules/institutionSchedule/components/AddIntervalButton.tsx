import { Plus } from 'lucide-react';
import type { WeekdayKey } from '../types/institutionSchedule.types';

interface AddIntervalButtonProps {
  weekday: WeekdayKey;
  onClick: (weekday: WeekdayKey) => void;
}

// Adds another opening interval to a day (e.g. an afternoon shift).
export default function AddIntervalButton({ weekday, onClick }: AddIntervalButtonProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(weekday)}
      className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
    >
      <Plus className="w-4 h-4" />
      Agregar jornada
    </button>
  );
}
