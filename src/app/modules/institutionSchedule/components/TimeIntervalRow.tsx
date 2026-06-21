import { Trash2, AlertCircle } from 'lucide-react';
import type { TimeInterval, WeekdayKey } from '../types/institutionSchedule.types';

interface TimeIntervalRowProps {
  weekday: WeekdayKey;
  interval: TimeInterval;
  error?: string;
  onChange: (
    weekday: WeekdayKey,
    intervalId: string,
    change: Partial<Omit<TimeInterval, 'id'>>
  ) => void;
  onRemove: (weekday: WeekdayKey, intervalId: string) => void;
}

// A single opening interval: start/end time inputs, remove button and inline
// validation message (start<end, no overlap).
export default function TimeIntervalRow({
  weekday,
  interval,
  error,
  onChange,
  onRemove,
}: TimeIntervalRowProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <input
          type="time"
          value={interval.start}
          onChange={(e) => onChange(weekday, interval.id, { start: e.target.value })}
          className={`px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error ? 'border-red-400 bg-red-50' : 'border-gray-300'
          }`}
        />
        <span className="text-gray-400 text-sm">a</span>
        <input
          type="time"
          value={interval.end}
          onChange={(e) => onChange(weekday, interval.id, { end: e.target.value })}
          className={`px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error ? 'border-red-400 bg-red-50' : 'border-gray-300'
          }`}
        />
        <button
          type="button"
          onClick={() => onRemove(weekday, interval.id)}
          aria-label="Eliminar intervalo"
          className="ml-auto text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-600">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
