import type { MouseEvent } from 'react';
import { HOURS, TODAY, WEEK_DATES, WEEK_DAYS } from '../constants';
import type { Appointment } from '../types/agenda.types';
import AppointmentBlock from './AppointmentBlock';

interface WeekViewProps {
  weekAppts: (date: string) => Appointment[];
  onDragStart: (a: Appointment) => void;
  onDrop: (date: string, hour: number) => void;
  onHover: (e: MouseEvent, a: Appointment) => void;
  onLeave: () => void;
}

export default function WeekView({ weekAppts, onDragStart, onDrop, onHover, onLeave }: WeekViewProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="grid border-b border-gray-200" style={{ gridTemplateColumns: '3.5rem repeat(5, 1fr)' }}>
        <div className="bg-gray-50 border-r border-gray-100" />
        {WEEK_DATES.map((date, i) => (
          <div
            key={date}
            className={`px-2 py-3 text-center border-r border-gray-100 last:border-0 ${date === TODAY ? 'bg-blue-50' : 'bg-gray-50'}`}
          >
            <div className="text-xs font-medium text-gray-500">{WEEK_DAYS[i]}</div>
            <div className={`text-sm font-bold mt-0.5 ${date === TODAY ? 'text-blue-600' : 'text-gray-800'}`}>
              {8 + i}
            </div>
          </div>
        ))}
      </div>
      {/* Grid */}
      <div className="overflow-y-auto max-h-[560px]">
        {HOURS.map((hour) => (
          <div
            key={hour}
            className="grid border-b border-gray-100 last:border-0 min-h-[60px]"
            style={{ gridTemplateColumns: '3.5rem repeat(5, 1fr)' }}
          >
            <div className="px-2 py-2 text-xs font-medium text-gray-400 border-r border-gray-100 bg-gray-50">
              {String(hour).padStart(2, '0')}:00
            </div>
            {WEEK_DATES.map((date) => {
              const appts = weekAppts(date).filter((a) => a.hour === hour);
              return (
                <div
                  key={date}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => onDrop(date, hour)}
                  className="border-r border-gray-100 last:border-0 px-1 py-1 space-y-0.5 hover:bg-gray-50/50 transition-colors"
                >
                  {appts.map((appt) => (
                    <AppointmentBlock
                      key={appt.id}
                      appt={appt}
                      compact
                      onDragStart={onDragStart}
                      onHover={onHover}
                      onLeave={onLeave}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
