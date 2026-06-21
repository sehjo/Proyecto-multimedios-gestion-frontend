// Persistence layer for the institutional schedule. The backend has no endpoint
// for this yet (frontend mock), so the schedule is stored in localStorage. This
// keeps the contract small so a real API service can replace it later.
import { DEFAULT_SCHEDULE, JS_DAY_TO_WEEKDAY, SCHEDULE_STORAGE_KEY } from '../constants';
import { isHoliday } from './holidaysService';
import type { WeekSchedule } from '../types/institutionSchedule.types';

// Read the saved schedule, falling back to the default when nothing is stored
// or the stored value is corrupt.
export function getInstitutionSchedule(): WeekSchedule {
  try {
    const raw = localStorage.getItem(SCHEDULE_STORAGE_KEY);
    if (!raw) return DEFAULT_SCHEDULE;
    const parsed = JSON.parse(raw) as WeekSchedule;
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_SCHEDULE;
    return parsed;
  } catch {
    return DEFAULT_SCHEDULE;
  }
}

// Persist the schedule. Updating the master schedule never cancels existing
// appointments (HU-038, scenario 3): we only overwrite the stored configuration;
// confirmed appointments live elsewhere and are left untouched.
export function saveInstitutionSchedule(schedule: WeekSchedule): WeekSchedule {
  localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(schedule));
  return schedule;
}

// Hook for the appointments module (HU-038, scenario 2): tell whether a given
// date + time falls inside an open institutional interval. Kept here so the
// appointments page can import it from this module's public barrel without
// duplicating the rule. `time` is "HH:mm"; `date` is "YYYY-MM-DD".
export function isWithinInstitutionSchedule(
  date: string,
  time: string,
  schedule: WeekSchedule = getInstitutionSchedule()
): boolean {
  // A registered holiday/closure blocks the whole day regardless of the weekly
  // schedule (HU-039 overrides HU-038 for that date).
  if (isHoliday(date)) return false;
  const jsDay = new Date(`${date}T12:00:00`).getDay();
  const weekday = JS_DAY_TO_WEEKDAY[jsDay];
  const day = schedule.find((d) => d.weekday === weekday);
  if (!day || !day.enabled) return false;
  return day.intervals.some((i) => i.start <= time && time < i.end);
}
