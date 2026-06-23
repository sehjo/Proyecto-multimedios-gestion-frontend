import type { MouseEvent } from 'react';
import { STATUS_CONFIG } from '../constants';
import type { Appointment } from '../types/agenda.types';

interface AppointmentBlockProps {
  appt: Appointment;
  compact?: boolean;
  onDragStart?: (a: Appointment) => void;
  onHover?: (e: MouseEvent, a: Appointment) => void;
  onLeave?: () => void;
}

export default function AppointmentBlock({
  appt,
  compact = false,
  onDragStart,
  onHover,
  onLeave,
}: AppointmentBlockProps) {
  const cfg = STATUS_CONFIG[appt.status];
  const draggable = appt.status !== 'blocked';
  return (
    <div
      draggable={draggable}
      onDragStart={draggable ? () => onDragStart?.(appt) : undefined}
      onMouseEnter={(e) => onHover?.(e, appt)}
      onMouseLeave={() => onLeave?.()}
      className={`border-l-4 rounded-r-lg px-2 py-1.5 select-none transition-opacity hover:opacity-90
        ${cfg.color}
        ${draggable ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}
        ${compact ? 'text-xs' : 'text-sm'}
      `}
    >
      <div className={`font-semibold truncate ${compact ? 'text-xs' : 'text-sm'}`}>
        {appt.status === 'blocked' ? appt.reason : appt.patientName}
      </div>
      {compact ? (
        <div className="opacity-70 truncate text-xs">{appt.time}</div>
      ) : (
        <>
          <div className="text-xs opacity-70 mt-0.5">{appt.time} · {appt.duration} min</div>
          {appt.status !== 'blocked' && (
            <div className="text-xs opacity-70 truncate">{appt.reason}</div>
          )}
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${cfg.badge}`}>
              {cfg.label}
            </span>
            {appt.insuranceType !== '-' && (
              <span className="text-xs opacity-60">{appt.insuranceType}</span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
