import { Clock } from 'lucide-react';
import TimeIntervalRow from './TimeIntervalRow';
import AddIntervalButton from './AddIntervalButton';
import { WEEKDAYS } from '../constants';
import type {
  DaySchedule,
  IntervalErrors,
  TimeInterval,
  WeekdayKey,
} from '../types/institutionSchedule.types';

interface WeekdayScheduleCardProps {
  day: DaySchedule;
  errors: IntervalErrors;
  onToggleDay: (weekday: WeekdayKey, enabled: boolean) => void;
  onAddInterval: (weekday: WeekdayKey) => void;
  onRemoveInterval: (weekday: WeekdayKey, intervalId: string) => void;
  onChangeInterval: (
    weekday: WeekdayKey,
    intervalId: string,
    change: Partial<Omit<TimeInterval, 'id'>>
  ) => void;
}

// One weekday row: an enable toggle plus its list of opening intervals. When the
// day is disabled the institution is closed and no intervals are shown.
export default function WeekdayScheduleCard({
  day,
  errors,
  onToggleDay,
  onAddInterval,
  onRemoveInterval,
  onChangeInterval,
}: WeekdayScheduleCardProps) {
  const label = WEEKDAYS.find((w) => w.key === day.weekday)?.label ?? day.weekday;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">{label}</h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={day.enabled}
            onChange={(e) => onToggleDay(day.weekday, e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded border-gray-300 cursor-pointer"
          />
          <span className="text-sm text-gray-600">{day.enabled ? 'Habilitado' : 'Cerrado'}</span>
        </label>
      </div>

      {!day.enabled ? (
        <p className="text-sm text-gray-400 italic">La institución permanece cerrada este día.</p>
      ) : day.intervals.length === 0 ? (
        <div className="space-y-3">
          <p className="flex items-center gap-1.5 text-sm text-orange-500">
            <Clock className="w-4 h-4" />
            Agregue al menos una jornada de atención.
          </p>
          <AddIntervalButton weekday={day.weekday} onClick={onAddInterval} />
        </div>
      ) : (
        <div className="space-y-3">
          {day.intervals.map((interval) => (
            <TimeIntervalRow
              key={interval.id}
              weekday={day.weekday}
              interval={interval}
              error={errors[interval.id]}
              onChange={onChangeInterval}
              onRemove={onRemoveInterval}
            />
          ))}
          <AddIntervalButton weekday={day.weekday} onClick={onAddInterval} />
        </div>
      )}
    </div>
  );
}
