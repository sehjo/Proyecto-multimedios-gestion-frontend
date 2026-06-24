import type { MouseEvent } from 'react';
import { STATUS_CONFIG, TODAY } from '../constants';
import type { Appointment } from '../types/agenda.types';

interface MonthViewProps {
  appointments: Appointment[];
  onHover: (e: MouseEvent, a: Appointment) => void;
  onLeave: () => void;
}

const DAYS_IN_MONTH = Array.from({ length: 30 }, (_, i) => i + 1);

export default function MonthView({ appointments, onHover, onLeave }: MonthViewProps) {
  // June 2026 starts on Monday → 0 offset
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((d) => (
          <div key={d} className="text-xs font-medium text-gray-500 text-center py-3 border-r border-gray-100 last:border-0">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {DAYS_IN_MONTH.map((day) => {
          const dateStr = `2026-06-${String(day).padStart(2, '0')}`;
          const dayAppts = appointments.filter((a) => a.date === dateStr);
          const isToday   = dateStr === TODAY;
          const col       = (day - 1) % 7; // 0=Mon … 6=Sun
          const isWeekend = col >= 5;
          return (
            <div
              key={day}
              className={`min-h-[88px] p-1.5 border-b border-r border-gray-100
                ${isToday ? 'bg-blue-50' : isWeekend ? 'bg-gray-50/60' : 'bg-white'}
              `}
            >
              <div className={`text-xs font-bold mb-1 w-5 h-5 flex items-center justify-center rounded-full
                ${isToday ? 'bg-blue-600 text-white' : isWeekend ? 'text-gray-400' : 'text-gray-700'}
              `}>
                {day}
              </div>
              <div className="space-y-0.5">
                {dayAppts.slice(0, 2).map((appt) => (
                  <div
                    key={appt.id}
                    onMouseEnter={(e) => onHover(e, appt)}
                    onMouseLeave={onLeave}
                    className={`text-xs px-1 py-0.5 rounded truncate cursor-default ${STATUS_CONFIG[appt.status].badge}`}
                  >
                    {appt.time} {appt.status === 'blocked' ? appt.reason : appt.patientName}
                  </div>
                ))}
                {dayAppts.length > 2 && (
                  <div className="text-xs text-blue-600 font-medium px-1">+{dayAppts.length - 2} más</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
