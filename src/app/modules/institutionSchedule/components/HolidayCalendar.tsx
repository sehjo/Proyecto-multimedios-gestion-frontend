import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Ban } from 'lucide-react';
import { todayISO } from '../holidays.constants';
import type { Holiday } from '../types/holidays.types';

interface HolidayCalendarProps {
  holidays: Holiday[];
  // Currently selected date in the form ("YYYY-MM-DD" or '' when empty).
  selectedDate: string;
  // Picking an available day writes it into the form's "Fecha de cierre".
  onPickDate: (date: string) => void;
}

const WEEKDAY_HEADERS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

// Builds the "YYYY-MM-DD" key for a given year/month/day in local time.
function dateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

// Monthly calendar that highlights holidays as blocked (red, non-clickable) and
// shows a tooltip with the reason (HU-039, scenario 2). Clicking an available
// day selects it as the closure date in the form, keeping both in sync.
export default function HolidayCalendar({
  holidays,
  selectedDate,
  onPickDate,
}: HolidayCalendarProps) {
  const today = todayISO();

  // Month shown = base month + manual navigation offset. The base month follows
  // the date typed/picked in the form (so typing 2026-07-24 shows July 2026);
  // with no date yet it falls back to the current month. Picking a new date
  // resets the navigation offset by re-syncing the tracked base during render
  // (React's "adjusting state on prop change" pattern — no effect needed).
  const baseMonthKey = selectedDate ? selectedDate.slice(0, 7) : todayISO().slice(0, 7);
  const [navState, setNavState] = useState({ key: baseMonthKey, offset: 0 });
  if (navState.key !== baseMonthKey) {
    setNavState({ key: baseMonthKey, offset: 0 });
  }

  const cursor = useMemo(() => {
    const [by, bm] = baseMonthKey.split('-').map(Number);
    const shifted = new Date(by, bm - 1 + navState.offset, 1);
    return { year: shifted.getFullYear(), month: shifted.getMonth() };
  }, [baseMonthKey, navState.offset]);

  const holidayByDate = useMemo(() => {
    const map = new Map<string, Holiday>();
    for (const h of holidays) map.set(h.date, h);
    return map;
  }, [holidays]);

  const cells = useMemo(() => {
    const firstWeekday = new Date(cursor.year, cursor.month, 1).getDay();
    const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate();
    const result: (number | null)[] = [];
    for (let i = 0; i < firstWeekday; i++) result.push(null);
    for (let d = 1; d <= daysInMonth; d++) result.push(d);
    return result;
  }, [cursor]);

  const goPrev = () => setNavState((s) => ({ ...s, offset: s.offset - 1 }));
  const goNext = () => setNavState((s) => ({ ...s, offset: s.offset + 1 }));

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">
          {MONTH_NAMES[cursor.month]} {cursor.year}
        </h3>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Mes anterior"
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Mes siguiente"
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAY_HEADERS.map((label) => (
          <div key={label} className="text-center text-xs font-semibold text-gray-400 py-1">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, index) => {
          if (day === null) return <div key={`empty-${index}`} />;

          const key = dateKey(cursor.year, cursor.month, day);
          const holiday = holidayByDate.get(key);
          const isPast = key < today;
          const isPicked = selectedDate === key;

          if (holiday) {
            return (
              <div
                key={key}
                title={`Cierre: ${holiday.title}`}
                aria-disabled="true"
                className="relative h-10 rounded-lg bg-red-50 border border-red-200 text-red-400 flex items-center justify-center text-sm cursor-not-allowed"
              >
                {day}
                <Ban className="absolute bottom-0.5 right-0.5 w-3 h-3 text-red-400" />
              </div>
            );
          }

          return (
            <button
              key={key}
              type="button"
              disabled={isPast}
              onClick={() => onPickDate(key)}
              className={`h-10 rounded-lg border text-sm transition-colors ${
                isPast
                  ? 'border-transparent text-gray-300 cursor-not-allowed'
                  : isPicked
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-red-50 border border-red-200 inline-block" />
          Feriado / cierre
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded border border-gray-200 inline-block" />
          Disponible
        </span>
      </div>
    </div>
  );
}
