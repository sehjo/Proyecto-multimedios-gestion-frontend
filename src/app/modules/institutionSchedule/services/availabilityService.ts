// Computes day availability (semaphore level, capacity, cupos) from the
// institutional schedule, registered holidays and the mock appointments
// (HU-039, availability scenarios).
import { JS_DAY_TO_WEEKDAY } from '../constants';
import { getInstitutionSchedule } from './institutionScheduleService';
import { isHoliday } from './holidaysService';
import { ALMOST_FULL_SLOTS_LEFT, MOCK_DAY_APPOINTMENTS, SLOT_MINUTES } from '../availability.constants';
import type {
  DayAppointment,
  DayAvailability,
  DayAvailabilityLevel,
  DayDetail,
} from '../types/availability.types';
import type { WeekSchedule } from '../types/institutionSchedule.types';

function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

// Open hours configured for a date's weekday (0 when closed/holiday).
function openHoursFor(date: string, schedule: WeekSchedule): number {
  if (isHoliday(date)) return 0;
  const weekday = JS_DAY_TO_WEEKDAY[new Date(`${date}T12:00:00`).getDay()];
  const day = schedule.find((d) => d.weekday === weekday);
  if (!day || !day.enabled) return 0;
  const minutes = day.intervals.reduce((sum, i) => sum + (toMinutes(i.end) - toMinutes(i.start)), 0);
  return minutes / 60;
}

// Active (non-cancelled) appointments for a date.
function activeCount(appointments: DayAppointment[]): number {
  return appointments.filter((a) => a.status !== 'cancelled').length;
}

// Compute the availability of a single day.
export function getDayAvailability(
  date: string,
  schedule: WeekSchedule = getInstitutionSchedule()
): DayAvailability {
  const openHours = openHoursFor(date, schedule);
  const capacity = Math.floor((openHours * 60) / SLOT_MINUTES);
  const appointments = MOCK_DAY_APPOINTMENTS[date] ?? [];
  const bookedCount = activeCount(appointments);
  const slotsLeft = Math.max(0, capacity - bookedCount);

  let level: DayAvailabilityLevel;
  if (capacity === 0) {
    level = 'closed';
  } else if (slotsLeft === 0) {
    level = 'full';
  } else if (slotsLeft <= ALMOST_FULL_SLOTS_LEFT) {
    level = 'almost';
  } else {
    level = 'free';
  }

  return { date, level, capacity, bookedCount, slotsLeft, openHours };
}

// Full detail for the day modal (availability + the day's appointments).
export function getDayDetail(
  date: string,
  schedule: WeekSchedule = getInstitutionSchedule()
): DayDetail {
  const availability = getDayAvailability(date, schedule);
  const appointments = [...(MOCK_DAY_APPOINTMENTS[date] ?? [])].sort((a, b) =>
    a.time.localeCompare(b.time)
  );
  return { ...availability, appointments };
}
