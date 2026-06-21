// Domain types for the institution's master attention schedule (HU-038).

// Weekday keys (Monday-first). Stable identifiers; labels live in constants.
export type WeekdayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

// A single opening interval within a day, e.g. a morning or afternoon shift.
// Times are 24h "HH:mm" strings (matches the native <input type="time"> value).
export interface TimeInterval {
  id: string;
  start: string;
  end: string;
}

// One weekday: whether the institution is open and, if so, its intervals.
export interface DaySchedule {
  weekday: WeekdayKey;
  enabled: boolean;
  intervals: TimeInterval[];
}

// The full institutional week. Always holds the seven days in order.
export type WeekSchedule = DaySchedule[];

// Per-interval validation errors, keyed by interval id. Absence means valid.
export type IntervalErrors = Record<string, string>;

// Inline banner shown above the form. 'success' = green, 'info' = blue.
export interface ScheduleBanner {
  type: 'success' | 'info';
  msg: string;
}
