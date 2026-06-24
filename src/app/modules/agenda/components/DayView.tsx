import type { MouseEvent } from 'react';
import { HOURS } from '../constants';
import type { Appointment } from '../types/agenda.types';
import AppointmentBlock from './AppointmentBlock';

interface DayViewProps {
  appointments: Appointment[];
  selectedDate: string;
  onDragStart: (a: Appointment) => void;
  onDrop: (date: string, hour: number) => void;
  onHover: (e: MouseEvent, a: Appointment) => void;
  onLeave: () => void;
}

export default function DayView({
  appointments,
  selectedDate,
  onDragStart,
  onDrop,
  onHover,
  onLeave,
}: DayViewProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
        <span className="text-sm font-semibold text-gray-900">{selectedDate}</span>
      </div>
      <div className="overflow-y-auto max-h-[600px]">
        {HOURS.map((hour) => {
          const appts = appointments.filter((a) => a.hour === hour);
          return (
            <div
              key={hour}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDrop(selectedDate, hour)}
              className="flex border-b border-gray-100 last:border-0 min-h-[64px] hover:bg-gray-50/50 transition-colors"
            >
              <div className="w-16 flex-shrink-0 px-3 py-3 text-xs font-medium text-gray-400 border-r border-gray-100 bg-gray-50">
                {String(hour).padStart(2, '0')}:00
              </div>
              <div className="flex-1 px-3 py-2 space-y-1">
                {appts.map((appt) => (
                  <AppointmentBlock
                    key={appt.id}
                    appt={appt}
                    onDragStart={onDragStart}
                    onHover={onHover}
                    onLeave={onLeave}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
