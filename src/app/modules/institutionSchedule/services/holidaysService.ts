// Persistence + query layer for institutional holidays (HU-039). No backend
// endpoint exists yet (frontend mock), so holidays live in localStorage. Each
// holiday can cover several dates (e.g. Semana Santa).
import { HOLIDAYS_STORAGE_KEY, MOCK_UPCOMING_APPOINTMENTS } from '../holidays.constants';
import type { AffectedAppointment, Holiday } from '../types/holidays.types';

// Earliest date of a holiday, used for sorting.
function firstDate(holiday: Holiday): string {
  return holiday.dates.length > 0 ? [...holiday.dates].sort()[0] : '';
}

// Read the saved holidays, sorted by their earliest date. Returns [] on missing
// or corrupt data.
export function getHolidays(): Holiday[] {
  try {
    const raw = localStorage.getItem(HOLIDAYS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Holiday[];
    if (!Array.isArray(parsed)) return [];
    return [...parsed].sort((a, b) => firstDate(a).localeCompare(firstDate(b)));
  } catch {
    return [];
  }
}

// Persist the holidays list.
export function saveHolidays(holidays: Holiday[]): Holiday[] {
  const sorted = [...holidays].sort((a, b) => firstDate(a).localeCompare(firstDate(b)));
  localStorage.setItem(HOLIDAYS_STORAGE_KEY, JSON.stringify(sorted));
  return sorted;
}

// Whether a given "YYYY-MM-DD" date falls on any registered holiday/closure.
// Consumed by the appointments and patient views (HU-039, scenario 2).
export function isHoliday(date: string, holidays: Holiday[] = getHolidays()): boolean {
  return holidays.some((h) => h.dates.includes(date));
}

// The holiday covering a given date, if any (to show its title/reason).
export function getHolidayForDate(
  date: string,
  holidays: Holiday[] = getHolidays()
): Holiday | undefined {
  return holidays.find((h) => h.dates.includes(date));
}

// Appointments scheduled on any of the given dates being declared a holiday.
// These must move to "pending rescheduling" (HU-039, scenario 3).
export function getAffectedAppointments(dates: string[]): AffectedAppointment[] {
  const set = new Set(dates);
  return MOCK_UPCOMING_APPOINTMENTS.filter((a) => set.has(a.date));
}
