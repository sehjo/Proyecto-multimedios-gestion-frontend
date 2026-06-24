import { Clock, Plus, AlertCircle, CopyCheck } from 'lucide-react';
import DayToggle from './DayToggle';
import IntervalChip from './IntervalChip';
import { WEEKDAYS } from '../constants';
import type {
  DaySchedule,
  IntervalErrors,
  TimeInterval,
  WeekdayKey,
  WeekSchedule,
} from '../types/institutionSchedule.types';

// Distinct error messages across a day's intervals (e.g. one overlap message
// even if two chips share it), so the row shows each problem once below.
function dayErrors(intervals: DaySchedule['intervals'], errors: IntervalErrors): string[] {
  const seen = new Set<string>();
  for (const interval of intervals) {
    const msg = errors[interval.id];
    if (msg) seen.add(msg);
  }
  return [...seen];
}

interface WeekScheduleTableProps {
  schedule: WeekSchedule;
  errors: IntervalErrors;
  selectedDays: WeekdayKey[];
  onToggleDay: (weekday: WeekdayKey, enabled: boolean) => void;
  onAddInterval: (weekday: WeekdayKey) => void;
  onRemoveInterval: (weekday: WeekdayKey, intervalId: string) => void;
  onChangeInterval: (
    weekday: WeekdayKey,
    intervalId: string,
    change: Partial<Omit<TimeInterval, 'id'>>
  ) => void;
  // Copy a day's schedule onto the currently selected target days.
  onApplyToSelected: (source: WeekdayKey) => void;
}

// Recurring weekly schedule (the master template, not a specific week) as a
// polished table: a day avatar, an on/off switch, the day's intervals as
// editable chips and a "copy to selected days" action for bulk edits.
export default function WeekScheduleTable({
  schedule,
  errors,
  selectedDays,
  onToggleDay,
  onAddInterval,
  onRemoveInterval,
  onChangeInterval,
  onApplyToSelected,
}: WeekScheduleTableProps) {
  return (
    <div className="mb-6 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Día
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Estado
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Jornadas de atención
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Replicar horario
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {schedule.map((day) => {
              const label = WEEKDAYS.find((w) => w.key === day.weekday)?.label ?? day.weekday;
              // Targets other than this day; empty means nothing to copy to.
              const otherTargets = selectedDays.filter((d) => d !== day.weekday);
              const canApply = otherTargets.length > 0;
              return (
                <tr key={day.weekday} className="transition-colors hover:bg-gray-50">
                  <td className="px-6 py-4 align-middle">
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${
                          day.enabled ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {label.charAt(0)}
                      </span>
                      <span className="text-sm font-medium text-gray-900">{label}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 align-middle">
                    <DayToggle
                      enabled={day.enabled}
                      onChange={(enabled) => onToggleDay(day.weekday, enabled)}
                      label={`Estado de ${label}`}
                    />
                  </td>

                  <td className="px-6 py-4 align-middle">
                    {!day.enabled ? (
                      <span className="text-sm text-gray-400 italic">Cerrado todo el día.</span>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          {day.intervals.length === 0 && (
                            <span className="flex items-center gap-1.5 text-sm text-orange-500">
                              <Clock className="w-4 h-4" />
                              Agregue una jornada.
                            </span>
                          )}
                          {day.intervals.map((interval) => (
                            <IntervalChip
                              key={interval.id}
                              weekday={day.weekday}
                              interval={interval}
                              hasError={Boolean(errors[interval.id])}
                              onChange={onChangeInterval}
                              onRemove={onRemoveInterval}
                            />
                          ))}
                          <button
                            type="button"
                            onClick={() => onAddInterval(day.weekday)}
                            className="inline-flex items-center gap-1 rounded-full border border-dashed border-gray-300 text-gray-500 hover:border-blue-400 hover:text-blue-600 text-xs font-medium px-3 h-9 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Jornada
                          </button>
                        </div>
                        {dayErrors(day.intervals, errors).map((msg, i) => (
                          <p key={i} className="flex items-center gap-1 text-xs text-red-600">
                            <AlertCircle className="w-3 h-3 flex-shrink-0" />
                            {msg}
                          </p>
                        ))}
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4 align-middle text-right">
                    <button
                      type="button"
                      onClick={() => onApplyToSelected(day.weekday)}
                      disabled={!canApply}
                      title={
                        canApply
                          ? `Copiar el horario de ${label} a los ${otherTargets.length} días marcados arriba`
                          : 'Primero marca los días destino en la barra de arriba'
                      }
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 border border-blue-200 rounded-lg px-3 py-1.5 hover:bg-blue-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent whitespace-nowrap"
                    >
                      <CopyCheck className="w-3.5 h-3.5" />
                      {canApply
                        ? `Copiar a ${otherTargets.length} día${otherTargets.length !== 1 ? 's' : ''}`
                        : 'Copiar a otros días'}
                    </button>
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
