import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { MONTH_NAMES, todayISO } from '../holidays.constants';
import { LEVEL_STYLE } from '../availability.constants';
import { getDayAvailability } from '../services/availabilityService';

interface AvailabilityCalendarProps {
  // Opens the day detail modal for a date.
  onSelectDay: (date: string) => void;
}

const WEEKDAY_HEADERS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

function dateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

// Monthly calendar showing each day's availability with the green/yellow/red
// color code; clicking a day opens its detail. Supports free navigation to
// future and past months (HU-039, availability scenarios 1-3). Colors recompute
// per render, so they update dynamically when the month changes.
export default function AvailabilityCalendar({ onSelectDay }: AvailabilityCalendarProps) {
  const today = todayISO();

  const [cursor, setCursor] = useState(() => {
    const [y, m] = today.split('-').map(Number);
    return { year: y, month: m - 1 };
  });

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
  const goToMonthYear = (year: number, monthIndex0: number) => setCursor({ year, month: monthIndex0 });

  const yearOptions = useMemo(() => {
    const years: number[] = [];
    for (let y = cursor.year - 2; y <= cursor.year + 5; y++) years.push(y);
    return years;
  }, [cursor.year]);

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

      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAY_HEADERS.map((label) => (
          <div key={label} className="text-center text-xs font-semibold text-gray-400 py-1">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weeks.flat().map((day, index) => {
          if (day === null) return <div key={`empty-${index}`} />;

          const key = dateKey(cursor.year, cursor.month, day);
          const { level, slotsLeft, capacity } = getDayAvailability(key);
          const style = LEVEL_STYLE[level];
          const isClosed = level === 'closed';

          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelectDay(key)}
              title={
                isClosed
                  ? 'Cerrado / feriado'
                  : `${slotsLeft} de ${capacity} cupos disponibles`
              }
              className={`h-12 rounded-lg border text-sm flex flex-col items-center justify-center gap-0.5 transition-colors ${style.dayClass}`}
            >
              <span className="font-medium">{day}</span>
              {!isClosed && <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-4 text-xs text-gray-500">
        {(['free', 'almost', 'full', 'closed'] as const).map((lvl) => (
          <span key={lvl} className="flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded ${LEVEL_STYLE[lvl].dot}`} />
            {LEVEL_STYLE[lvl].label}
          </span>
        ))}
      </div>
    </div>
  );
}
