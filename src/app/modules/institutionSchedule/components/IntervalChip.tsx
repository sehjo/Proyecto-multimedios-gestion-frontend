import { X } from 'lucide-react';
import type { TimeInterval, WeekdayKey } from '../types/institutionSchedule.types';

interface IntervalChipProps {
  weekday: WeekdayKey;
  interval: TimeInterval;
  hasError?: boolean;
  onChange: (
    weekday: WeekdayKey,
    intervalId: string,
    change: Partial<Omit<TimeInterval, 'id'>>
  ) => void;
  onRemove: (weekday: WeekdayKey, intervalId: string) => void;
}

// A single opening interval rendered as an editable chip: a soft rounded pill
// that holds the start/end time inputs and a remove button. Errors are shown by
// the table below the whole chip row, so the chip keeps a fixed height.
export default function IntervalChip({
  weekday,
  interval,
  hasError,
  onChange,
  onRemove,
}: IntervalChipProps) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border pl-3 pr-1.5 py-1 h-9 ${
        hasError ? 'border-red-300 bg-red-50' : 'border-blue-200 bg-blue-50'
      }`}
    >
      <input
        type="time"
        value={interval.start}
        onChange={(e) => onChange(weekday, interval.id, { start: e.target.value })}
        className="bg-transparent text-xs font-medium text-blue-800 focus:outline-none w-[4.5rem]"
      />
      <span className="text-blue-300 text-xs">–</span>
      <input
        type="time"
        value={interval.end}
        onChange={(e) => onChange(weekday, interval.id, { end: e.target.value })}
        className="bg-transparent text-xs font-medium text-blue-800 focus:outline-none w-[4.5rem]"
      />
      <button
        type="button"
        onClick={() => onRemove(weekday, interval.id)}
        aria-label="Quitar jornada"
        className="text-blue-400 hover:text-red-500 hover:bg-white rounded-full p-0.5 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
