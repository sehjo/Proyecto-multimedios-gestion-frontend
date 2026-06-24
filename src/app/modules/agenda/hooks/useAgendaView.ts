import { useState } from 'react';
import type { Appointment, ViewMode } from '../types/agenda.types';

export function useAgendaView(allAppts: Appointment[]) {
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [selectedDate, setSelectedDate] = useState('2026-06-08');

  const dayAppts = allAppts.filter((a) => a.date === selectedDate);
  const weekAppts = (date: string) => allAppts.filter((a) => a.date === date);

  const periodLabel =
    viewMode === 'day' ? selectedDate :
    viewMode === 'week' ? 'Semana 8–12 Jun 2026' :
    viewMode === 'month' ? 'Junio 2026' :
    'Todas las citas';

  const goToDay = (date: string) => {
    setSelectedDate(date);
    setViewMode('day');
  };

  return { viewMode, setViewMode, selectedDate, goToDay, periodLabel, dayAppts, weekAppts };
}
