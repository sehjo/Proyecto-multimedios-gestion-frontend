// Public API of the institution-schedule module.
export { default as InstitutionSchedulePage } from './pages/InstitutionSchedulePage';

// Consumed by the appointments module (HU-038, scenario 2) to keep new bookings
// inside the configured institutional hours.
export {
  getInstitutionSchedule,
  isWithinInstitutionSchedule,
} from './services/institutionScheduleService';

// Consumed by the appointments and patient calendar views (HU-039, scenario 2)
// to block holiday dates and surface their reason.
export {
  getHolidays,
  isHoliday,
  getHolidayForDate,
} from './services/holidaysService';

export type {
  WeekSchedule,
  DaySchedule,
  TimeInterval,
  WeekdayKey,
} from './types/institutionSchedule.types';

export type { Holiday } from './types/holidays.types';
