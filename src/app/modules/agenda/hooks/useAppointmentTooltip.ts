import { useState } from 'react';
import type { MouseEvent } from 'react';
import type { Appointment, TooltipState } from '../types/agenda.types';

export function useAppointmentTooltip() {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const handleHover = (e: MouseEvent, appt: Appointment) => {
    if (appt.status === 'blocked') return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setTooltip({ appt, x: rect.right + 10, y: rect.top });
  };
  const handleLeave = () => setTooltip(null);
  const clearTooltip = () => setTooltip(null);

  return { tooltip, handleHover, handleLeave, clearTooltip };
}
