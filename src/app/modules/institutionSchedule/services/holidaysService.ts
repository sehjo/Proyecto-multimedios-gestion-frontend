// Persistence + query layer for institutional holidays (HU-039). No backend
// endpoint exists yet (frontend mock), so holidays live in localStorage.
import { HOLIDAYS_STORAGE_KEY, MOCK_UPCOMING_APPOINTMENTS } from '../holidays.constants';
import type { AffectedAppointment, Holiday } from '../types/holidays.types';

// Read the saved holidays, sorted by date ascending. Returns [] on missing or
// corrupt data.
export function getHolidays(): Holiday[] {
  try {
    const raw = localStorage.getItem(HOLIDAYS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Holiday[];
    if (!Array.isArray(parsed)) return [];
    return [...parsed].sort((a, b) => a.date.localeCompare(b.date));
  } catch {
    return [];
  }
}

// Persist the holidays list.
export function saveHolidays(holidays: Holiday[]): Holiday[] {
  const sorted = [...holidays].sort((a, b) => a.date.localeCompare(b.date));
  localStorage.setItem(HOLIDAYS_STORAGE_KEY, JSON.stringify(sorted));
  return sorted;
}

// Whether a given "YYYY-MM-DD" date is a registered holiday/closure. Consumed by
// the appointments and patient views (HU-039, scenario 2) to block the date.
export function isHoliday(date: string, holidays: Holiday[] = getHolidays()): boolean {
  return holidays.some((h) => h.date === date);
}

// The holiday on a given date, if any (to show its title/reason when blocking).
export function getHolidayForDate(
  date: string,
  holidays: Holiday[] = getHolidays()
): Holiday | undefined {
  return holidays.find((h) => h.date === date);
}

// Appointments scheduled on a date that is being declared a holiday. These are
// the ones that must move to "pending rescheduling" (HU-039, scenario 3).
export function getAffectedAppointments(date: string): AffectedAppointment[] {
  return MOCK_UPCOMING_APPOINTMENTS.filter((a) => a.date === date);
}
