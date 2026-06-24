import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TODAY, WEEK_DATES } from '../constants';
import type { Appointment } from '../types/agenda.types';

interface MiniCalendarProps {
  allAppts: Appointment[];
  onSelectDay: (date: string) => void;
}

const DAY_HEADERS = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
const CALENDAR_DAYS = Array.from({ length: 30 }, (_, i) => i + 1);

export default function MiniCalendar({ allAppts, onSelectDay }: MiniCalendarProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <button className="p-1 rounded hover:bg-gray-100 text-gray-500">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-xs font-semibold text-gray-800">Junio 2026</span>
        <button className="p-1 rounded hover:bg-gray-100 text-gray-500">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 text-center mb-1">
        {DAY_HEADERS.map((d) => (
          <div key={d} className="text-xs text-gray-400 font-medium py-0.5">{d}</div>
        ))}
      </div>
      {/* Days grid — June 2026 starts on Monday (col index 1) */}
      <div className="grid grid-cols-7 text-center gap-y-0.5">
        {/* Blank for Sunday offset (June 1 = Monday → blank for first Sunday cell) */}
        <div />
        {CALENDAR_DAYS.map((day) => {
          const dateStr  = `2026-06-${String(day).padStart(2, '0')}`;
          const hasAppts = allAppts.some((a) => a.date === dateStr);
          const isToday  = dateStr === TODAY;
          const inWeek   = WEEK_DATES.includes(dateStr);
          return (
            <button
              key={day}
              onClick={() => onSelectDay(dateStr)}
              className={`text-xs py-1 rounded-full leading-none transition-colors
                ${isToday ? 'bg-blue-600 text-white font-bold' : ''}
                ${inWeek && !isToday ? 'bg-blue-50 text-blue-700 font-semibold' : ''}
                ${!inWeek && !isToday ? 'text-gray-700 hover:bg-gray-100' : ''}
              `}
            >
              {day}
              {hasAppts && !isToday && (
                <span className="block mx-auto w-1 h-1 rounded-full bg-blue-400 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
