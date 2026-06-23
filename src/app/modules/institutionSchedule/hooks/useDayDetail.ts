import { useCallback, useMemo, useState } from 'react';
import { getDayDetail } from '../services/availabilityService';
import type { DayAppointment, DayDetail } from '../types/availability.types';

// Owns the day-detail modal of the availability view: which date is open and its
// computed detail (appointments grouped by status, hours, cupos) — HU-039.
export function useDayDetail() {
  const [openDate, setOpenDate] = useState<string | null>(null);

  const detail: DayDetail | null = useMemo(
    () => (openDate ? getDayDetail(openDate) : null),
    [openDate]
  );

  // Appointments grouped by status for the modal sections.
  const grouped = useMemo(() => {
    const base: Record<DayAppointment['status'], DayAppointment[]> = {
      confirmed: [],
      pending: [],
      cancelled: [],
    };
    if (!detail) return base;
    for (const appt of detail.appointments) base[appt.status].push(appt);
    return base;
  }, [detail]);

  const openDay = useCallback((date: string) => setOpenDate(date), []);
  const closeDay = useCallback(() => setOpenDate(null), []);

  return { openDate, detail, grouped, openDay, closeDay };
}
