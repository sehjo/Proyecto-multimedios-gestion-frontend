import { useState } from 'react';
import type { Appointment, PendingDrop } from '../types/agenda.types';

export function useAppointmentDragDrop() {
  const [dragSource, setDragSource] = useState<Appointment | null>(null);
  const [pendingDrop, setPendingDrop] = useState<PendingDrop | null>(null);

  const handleDragStart = (appt: Appointment) => setDragSource(appt);

  const handleDrop = (date: string, hour: number) => {
    if (!dragSource || dragSource.status === 'blocked') return;
    setPendingDrop({ appt: dragSource, date, hour });
    setDragSource(null);
  };

  const confirmDrop = () => setPendingDrop(null);
  const cancelDrop = () => setPendingDrop(null);

  return { pendingDrop, handleDragStart, handleDrop, confirmDrop, cancelDrop };
}
