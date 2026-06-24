import { Clock } from 'lucide-react';
import TimeIntervalRow from './TimeIntervalRow';
import AddIntervalButton from './AddIntervalButton';
import { WEEKDAYS } from '../constants';
import type {
  IntervalErrors,
  TimeInterval,
  WeekdayKey,
  WeekSchedule,
} from '../types/institutionSchedule.types';

interface WeekScheduleTableProps {
  schedule: WeekSchedule;
  errors: IntervalErrors;
  selectedDays: WeekdayKey[];
  onToggleSelect: (weekday: WeekdayKey) => void;
  onToggleDay: (weekday: WeekdayKey, enabled: boolean) => void;
  onAddInterval: (weekday: WeekdayKey) => void;
  onRemoveInterval: (weekday: WeekdayKey, intervalId: string) => void;
  onChangeInterval: (
    weekday: WeekdayKey,
    intervalId: string,
    change: Partial<Omit<TimeInterval, 'id'>>
  ) => void;
}

// Weekly schedule as a table (one row per day), styled like the users table:
// select checkbox, day, enabled/closed toggle and the day's intervals.
export default function WeekScheduleTable({
  schedule,
  errors,
  selectedDays,
  onToggleSelect,
  onToggleDay,
  onAddInterval,
  onRemoveInterval,
  onChangeInterval,
}: WeekScheduleTableProps) {
  const selectedSet = new Set(selectedDays);

  return (
    <div className="mb-6 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th scope="col" className="px-4 py-3 w-10" />
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Día
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Estado
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Jornadas de atención
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {schedule.map((day) => {
              const label = WEEKDAYS.find((w) => w.key === day.weekday)?.label ?? day.weekday;
              const isSelected = selectedSet.has(day.weekday);
              return (
                <tr
                  key={day.weekday}
                  className={`transition-colors ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                >
                  <td className="px-4 py-4 align-top">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(day.weekday)}
                      aria-label={`Seleccionar ${label}`}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 cursor-pointer mt-1"
                    />
                  </td>

                  <td className="px-6 py-4 align-top text-sm font-medium text-gray-900">{label}</td>

                  <td className="px-6 py-4 align-top">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={day.enabled}
                        onChange={(e) => onToggleDay(day.weekday, e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 cursor-pointer"
                      />
                      <span className="text-sm text-gray-600">
                        {day.enabled ? 'Habilitado' : 'Cerrado'}
                      </span>
                    </label>
                  </td>

                  <td className="px-6 py-4 align-top">
                    {!day.enabled ? (
                      <span className="text-sm text-gray-400 italic">
                        La institución permanece cerrada este día.
                      </span>
                    ) : day.intervals.length === 0 ? (
                      <div className="space-y-2">
                        <p className="flex items-center gap-1.5 text-sm text-orange-500">
                          <Clock className="w-4 h-4" />
                          Agregue al menos una jornada de atención.
                        </p>
                        <AddIntervalButton weekday={day.weekday} onClick={onAddInterval} />
                      </div>
                    ) : (
                      <div className="space-y-2">
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
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
