// Mock per-doctor working hours and the slot computation used by the reschedule
// modal (HU-039). The real per-doctor schedule lives in the appointments/
// HorarioConfig area on another branch; this local mock lets the module show the
// intersection of the institutional hours and the doctor's hours for the demo.
import { getInstitutionSchedule, isWithinInstitutionSchedule } from './institutionScheduleService';
import { JS_DAY_TO_WEEKDAY } from '../constants';
import type { WeekdayKey } from '../types/institutionSchedule.types';

// Slot granularity for the picker (minutes).
const SLOT_STEP_MINUTES = 5;

interface DoctorWorkingHours {
  // Open intervals per weekday; missing weekday = the doctor doesn't work.
  byWeekday: Partial<Record<WeekdayKey, { start: string; end: string }[]>>;
}

// Demo working hours keyed by the doctor display name used in the appointments.
const WEEKDAYS_MON_FRI: WeekdayKey[] = ['mon', 'tue', 'wed', 'thu', 'fri'];

function weekly(intervals: { start: string; end: string }[]): DoctorWorkingHours {
  const byWeekday: DoctorWorkingHours['byWeekday'] = {};
  for (const day of WEEKDAYS_MON_FRI) byWeekday[day] = intervals;
  return { byWeekday };
}

const DOCTOR_HOURS: Record<string, DoctorWorkingHours> = {
  'Dr. Ricardo Solano': weekly([{ start: '07:00', end: '15:00' }]),
  'Dra. Elena Mora': weekly([{ start: '08:00', end: '12:00' }, { start: '14:00', end: '18:00' }]),
  'Dr. Andrés Castro': weekly([{ start: '09:00', end: '17:00' }]),
};

function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function toTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// A bookable interval (institution ∩ doctor) with its discrete slots.
export interface AvailableBand {
  start: string;
  end: string;
  slots: string[];
}

// Returns the doctor's open intervals for a given date's weekday, or [] when the
// doctor doesn't work that day or is unknown.
function doctorIntervalsForDate(
  doctorName: string,
  date: string
): { start: string; end: string }[] {
  const hours = DOCTOR_HOURS[doctorName];
  if (!hours) return [];
  const weekday = JS_DAY_TO_WEEKDAY[new Date(`${date}T12:00:00`).getDay()];
  return hours.byWeekday[weekday] ?? [];
}

// The bookable bands for a doctor on a date: the overlap between the doctor's
// hours and the institutional hours, sliced into 5-minute slots. Returns [] when
// the date is a holiday/closed or the doctor doesn't work that day.
export function getAvailableBands(doctorName: string, date: string): AvailableBand[] {
  if (!date) return [];

  const institution = getInstitutionSchedule();
  const weekday = JS_DAY_TO_WEEKDAY[new Date(`${date}T12:00:00`).getDay()];
  const instDay = institution.find((d) => d.weekday === weekday);
  if (!instDay || !instDay.enabled) return [];

  const doctorIntervals = doctorIntervalsForDate(doctorName, date);
  if (doctorIntervals.length === 0) return [];

  const bands: AvailableBand[] = [];
  for (const inst of instDay.intervals) {
    for (const doc of doctorIntervals) {
      const start = Math.max(toMinutes(inst.start), toMinutes(doc.start));
      const end = Math.min(toMinutes(inst.end), toMinutes(doc.end));
      if (start >= end) continue;

      const slots: string[] = [];
      for (let m = start; m < end; m += SLOT_STEP_MINUTES) {
        const time = toTime(m);
        // Defensive: respects holidays too (a holiday makes the whole day closed).
        if (isWithinInstitutionSchedule(date, time, institution)) {
          slots.push(time);
        }
      }
      if (slots.length > 0) {
        bands.push({ start: toTime(start), end: toTime(end), slots });
      }
    }
  }

  return bands.sort((a, b) => toMinutes(a.start) - toMinutes(b.start));
}

// Whether the doctor has any institutional hours configured at all (to tailor
// the empty-state message: closed/holiday vs. doctor doesn't work that day).
export function isKnownDoctor(doctorName: string): boolean {
  return doctorName in DOCTOR_HOURS;
}
