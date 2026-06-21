// Public API of the institution-schedule module.
export { default as InstitutionSchedulePage } from './pages/InstitutionSchedulePage';

// Consumed by the appointments module (HU-038, scenario 2) to keep new bookings
// inside the configured institutional hours.
export {
  getInstitutionSchedule,
  isWithinInstitutionSchedule,
} from './services/institutionScheduleService';

export type {
  WeekSchedule,
  DaySchedule,
  TimeInterval,
  WeekdayKey,
} from './types/institutionSchedule.types';
