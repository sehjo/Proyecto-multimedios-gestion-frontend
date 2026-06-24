import type { MouseEvent } from 'react';
import { Clock, User } from 'lucide-react';
import { STATUS_CONFIG } from '../constants';
import type { Appointment } from '../types/agenda.types';

interface ListViewProps {
  appointments: Appointment[];
  onHover: (e: MouseEvent, a: Appointment) => void;
  onLeave: () => void;
}

export default function ListView({ appointments, onHover, onLeave }: ListViewProps) {
  const sorted  = [...appointments].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const grouped = sorted.reduce<Record<string, Appointment[]>>((acc, appt) => {
    (acc[appt.date] ??= []).push(appt);
    return acc;
  }, {});

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
        <span className="text-sm font-semibold text-gray-900">Bitácora de Citas</span>
      </div>
      <div className="overflow-y-auto max-h-[600px]">
        {Object.entries(grouped).map(([date, appts]) => (
          <div key={date}>
            <div className="sticky top-0 bg-blue-50 border-y border-blue-100 px-4 py-2 z-10">
              <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">{date}</span>
            </div>
            {appts.map((appt) => {
              const cfg = STATUS_CONFIG[appt.status];
              return (
                <div
                  key={appt.id}
                  onMouseEnter={(e) => onHover(e, appt)}
                  onMouseLeave={onLeave}
                  className="flex items-start gap-4 px-4 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  {/* Time column */}
                  <div className="flex flex-col items-center gap-1 w-14 flex-shrink-0 pt-0.5">
                    <div className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
                    <span className="text-xs font-bold text-gray-900">{appt.time}</span>
                    <span className="text-xs text-gray-400">{appt.duration} min</span>
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="font-semibold text-gray-900 text-sm">
                        {appt.status === 'blocked' ? appt.reason : appt.patientName}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.badge}`}>
                        {cfg.label}
                      </span>
                    </div>
                    {appt.status !== 'blocked' && (
                      <>
                        <div className="text-sm text-gray-600 mb-1">{appt.reason}</div>
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />{appt.insuranceType}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />{appt.time} – {appt.endTime}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        <div className="px-4 py-8 text-center text-sm text-gray-400">— Fin de la bitácora —</div>
      </div>
    </div>
  );
}
