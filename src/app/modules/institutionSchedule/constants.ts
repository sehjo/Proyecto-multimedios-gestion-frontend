import type { WeekdayKey, WeekSchedule } from './types/institutionSchedule.types';

// localStorage key for the persisted institutional schedule (mock backend).
export const SCHEDULE_STORAGE_KEY = 'institution_schedule';

// Weekdays in display order with their Spanish labels.
export const WEEKDAYS: { key: WeekdayKey; label: string; short: string }[] = [
  { key: 'mon', label: 'Lunes', short: 'Lun' },
  { key: 'tue', label: 'Martes', short: 'Mar' },
  { key: 'wed', label: 'Miércoles', short: 'Mié' },
  { key: 'thu', label: 'Jueves', short: 'Jue' },
  { key: 'fri', label: 'Viernes', short: 'Vie' },
  { key: 'sat', label: 'Sábado', short: 'Sáb' },
  { key: 'sun', label: 'Domingo', short: 'Dom' },
];

// Maps the JS Date.getDay() index (0 = Sunday) to our WeekdayKey.
export const JS_DAY_TO_WEEKDAY: WeekdayKey[] = [
  'sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat',
];

// Default schedule used the first time the page loads (no saved data yet):
// Mon-Fri open with a morning and afternoon shift; weekend closed.
export const DEFAULT_SCHEDULE: WeekSchedule = WEEKDAYS.map(({ key }) => {
  const isWeekday = key !== 'sat' && key !== 'sun';
  return {
    weekday: key,
    enabled: isWeekday,
    intervals: isWeekday
      ? [
          { id: `${key}-morning`, start: '07:00', end: '12:00' },
          { id: `${key}-afternoon`, start: '13:00', end: '17:00' },
        ]
      : [],
  };
});
