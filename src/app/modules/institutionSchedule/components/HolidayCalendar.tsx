import { useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, Ban } from 'lucide-react';
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

  // The month shown is its own state, initialized once (to the first selected
  // date, else the current month) and changed ONLY by navigation — the arrows
  // and the month/year dropdowns. Selecting days must never move it.
  const [cursor, setCursor] = useState(() => {
    const first = selectedDates.length > 0 ? [...selectedDates].sort()[0] : today;
    const [y, m] = first.split('-').map(Number);
    return { year: y, month: m - 1 };
  });

  // Whether a drag selection is in progress (mouse held down over the grid).
  const draggingRef = useRef(false);

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

  const goPrev = () =>
    setCursor((c) => (c.month === 0 ? { year: c.year - 1, month: 11 } : { ...c, month: c.month - 1 }));
  const goNext = () =>
    setCursor((c) => (c.month === 11 ? { year: c.year + 1, month: 0 } : { ...c, month: c.month + 1 }));

  // Jump straight to an absolute month/year (the dropdowns).
  const goToMonthYear = (year: number, monthIndex0: number) =>
    setCursor({ year, month: monthIndex0 });

  // Year range offered in the dropdown: a few years around the current cursor.
  const yearOptions = useMemo(() => {
    const center = cursor.year;
    const years: number[] = [];
    for (let y = center - 2; y <= center + 5; y++) years.push(y);
    return years;
  }, [cursor.year]);

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

  // Selection is driven entirely by mouse down/enter/up (no onClick, which would
  // fire a second toggle and undo a plain click). Mouse down on a day toggles it;
  // dragging onto further days only adds them.
  const handleDayMouseDown = (key: string) => {
    if (!selectableDay(key)) return;
    draggingRef.current = true;
    toggleKeys([key]);
  };

  const handleDayMouseEnter = (key: string) => {
    if (!draggingRef.current || !selectableDay(key) || selectedSet.has(key)) return;
    onChangeDates(Array.from(new Set([...selectedDates, key])));
  };

  const endDrag = () => {
    draggingRef.current = false;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-4 gap-2">
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={cursor.month}
              onChange={(e) => goToMonthYear(cursor.year, Number(e.target.value))}
              aria-label="Mes"
              className="appearance-none pl-2.5 pr-7 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {MONTH_NAMES.map((name, index) => (
                <option key={name} value={index}>
                  {name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-2 w-4 h-4 text-gray-400" />
          </div>
          <div className="relative">
            <select
              value={cursor.year}
              onChange={(e) => goToMonthYear(Number(e.target.value), cursor.month)}
              aria-label="Año"
              className="appearance-none pl-2.5 pr-7 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-2 w-4 h-4 text-gray-400" />
          </div>
        </div>
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
