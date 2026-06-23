import { useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Ban } from 'lucide-react';
import { MONTH_NAMES, todayISO } from '../holidays.constants';
import type { Holiday } from '../types/holidays.types';

interface HolidayCalendarProps {
  holidays: Holiday[];
  // Days currently selected in the form ("YYYY-MM-DD"), unordered.
  selectedDates: string[];
  // Replace the whole selection (the calendar owns the selection logic).
  onChangeDates: (dates: string[]) => void;
}

const WEEKDAY_HEADERS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

// Builds the "YYYY-MM-DD" key for a given year/month/day in local time.
function dateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

// Monthly calendar for picking closure days. Already-registered holidays show as
// blocked (red, non-clickable). Selection supports: click a day (toggle), drag
// (add while dragging), click a weekday header (toggle all that weekday in the
// month) and click a week number (toggle that whole week). Invalid days (past or
// already a holiday) are skipped — HU-039.
export default function HolidayCalendar({
  holidays,
  selectedDates,
  onChangeDates,
}: HolidayCalendarProps) {
  const today = todayISO();

  // Base month follows the first selected date; with none, the current month.
  // Manual navigation adds an offset; picking new dates resets it via the
  // render-time "adjust state on prop change" pattern (no effect needed).
  const firstSelected = selectedDates.length > 0 ? [...selectedDates].sort()[0] : '';
  const baseMonthKey = firstSelected ? firstSelected.slice(0, 7) : today.slice(0, 7);
  const [navState, setNavState] = useState({ key: baseMonthKey, offset: 0 });
  if (navState.key !== baseMonthKey) {
    setNavState({ key: baseMonthKey, offset: 0 });
  }

  // Whether a drag selection is in progress (mouse held down over the grid).
  const draggingRef = useRef(false);

  const cursor = useMemo(() => {
    const [by, bm] = baseMonthKey.split('-').map(Number);
    const shifted = new Date(by, bm - 1 + navState.offset, 1);
    return { year: shifted.getFullYear(), month: shifted.getMonth() };
  }, [baseMonthKey, navState.offset]);

  const holidayByDate = useMemo(() => {
    const map = new Map<string, Holiday>();
    for (const h of holidays) for (const d of h.dates) map.set(d, h);
    return map;
  }, [holidays]);

  const selectedSet = useMemo(() => new Set(selectedDates), [selectedDates]);

  // The month laid out as weeks: each row is 7 cells (Sun-Sat), null = padding.
  const weeks = useMemo(() => {
    const firstWeekday = new Date(cursor.year, cursor.month, 1).getDay();
    const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate();
    const flat: (number | null)[] = [];
    for (let i = 0; i < firstWeekday; i++) flat.push(null);
    for (let d = 1; d <= daysInMonth; d++) flat.push(d);
    while (flat.length % 7 !== 0) flat.push(null);
    const rows: (number | null)[][] = [];
    for (let i = 0; i < flat.length; i += 7) rows.push(flat.slice(i, i + 7));
    return rows;
  }, [cursor]);

  const goPrev = () => setNavState((s) => ({ ...s, offset: s.offset - 1 }));
  const goNext = () => setNavState((s) => ({ ...s, offset: s.offset + 1 }));

  const selectableDay = (key: string) => key >= today && !holidayByDate.has(key);

  // Toggle a set of day keys onto the current selection: if all valid keys are
  // already selected, remove them; otherwise add the valid ones. Invalid days
  // (past or holiday) are ignored.
  const toggleKeys = (keys: string[]) => {
    const valid = keys.filter(selectableDay);
    if (valid.length === 0) return;
    const allSelected = valid.every((k) => selectedSet.has(k));
    if (allSelected) {
      const remove = new Set(valid);
      onChangeDates(selectedDates.filter((d) => !remove.has(d)));
    } else {
      onChangeDates(Array.from(new Set([...selectedDates, ...valid])));
    }
  };

  // Day keys for a given weekday column (0 = Sun) within the shown month.
  const keysForWeekday = (weekdayIndex: number): string[] => {
    const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate();
    const keys: string[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      if (new Date(cursor.year, cursor.month, d).getDay() === weekdayIndex) {
        keys.push(dateKey(cursor.year, cursor.month, d));
      }
    }
    return keys;
  };

  // Day keys present in a given week row.
  const keysForWeek = (row: (number | null)[]): string[] =>
    row.filter((d): d is number => d !== null).map((d) => dateKey(cursor.year, cursor.month, d));

  // Drag selection: add days as the pointer enters them with the button held.
  const handleDayMouseDown = (key: string) => {
    if (!selectableDay(key)) return;
    draggingRef.current = true;
    onChangeDates(Array.from(new Set([...selectedDates, key])));
  };

  const handleDayMouseEnter = (key: string) => {
    if (!draggingRef.current || !selectableDay(key)) return;
    onChangeDates(Array.from(new Set([...selectedDates, key])));
  };

  const endDrag = () => {
    draggingRef.current = false;
  };

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

      {/* Header row: week label + clickable weekday headers (toggle the column). */}
      <div className="grid grid-cols-[2rem_repeat(7,1fr)] gap-1 mb-1">
        <div className="text-center text-xs font-semibold text-gray-400 py-1">Sem</div>
        {WEEKDAY_HEADERS.map((label, weekdayIndex) => (
          <button
            key={label}
            type="button"
            onClick={() => toggleKeys(keysForWeekday(weekdayIndex))}
            title={`Seleccionar todos los ${label} del mes`}
            className="text-center text-xs font-semibold text-gray-500 py-1 rounded-md hover:bg-blue-50 hover:text-blue-700 transition-colors"
          >
            {label}
          </button>
        ))}
      </div>

      <div
        className="grid grid-cols-[2rem_repeat(7,1fr)] gap-1"
        onMouseLeave={endDrag}
        onMouseUp={endDrag}
      >
        {weeks.map((row, weekIndex) => {
          const weekKeys = keysForWeek(row);
          return (
            <FragmentRow key={`week-${weekIndex}`}>
              {/* Week number: toggles the whole week. */}
              <button
                type="button"
                onClick={() => toggleKeys(weekKeys)}
                disabled={weekKeys.filter(selectableDay).length === 0}
                title={`Seleccionar la semana ${weekIndex + 1}`}
                className="h-10 rounded-lg text-xs font-semibold text-gray-400 hover:bg-blue-50 hover:text-blue-700 transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
              >
                {weekIndex + 1}
              </button>

              {row.map((day, dayIndex) => {
                if (day === null) return <div key={`empty-${weekIndex}-${dayIndex}`} />;

                const key = dateKey(cursor.year, cursor.month, day);
                const holiday = holidayByDate.get(key);
                const isPast = key < today;
                const isSelected = selectedSet.has(key);

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
                    onMouseDown={() => handleDayMouseDown(key)}
                    onMouseEnter={() => handleDayMouseEnter(key)}
                    onClick={() => toggleKeys([key])}
                    className={`h-10 rounded-lg border text-sm transition-colors select-none ${
                      isPast
                        ? 'border-transparent text-gray-300 cursor-not-allowed'
                        : isSelected
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </FragmentRow>
          );
        })}
      </div>

      <p className="text-xs text-gray-400 mt-3">
        Clic en un día para alternarlo · arrastre para varios · clic en un día de la semana (Mié)
        selecciona todos del mes · clic en el número de semana selecciona esa semana.
      </p>

      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-blue-600 inline-block" />
          Seleccionado
        </span>
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

// Renders a week's cells as direct grid children (a fragment can't carry a key
// in the map above while keeping the cells in the parent grid).
function FragmentRow({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
