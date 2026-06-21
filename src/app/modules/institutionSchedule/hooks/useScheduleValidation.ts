import { useMemo } from 'react';
import type { IntervalErrors, WeekSchedule } from '../types/institutionSchedule.types';

// Minutes since midnight for an "HH:mm" string; -1 for an empty/partial value.
function toMinutes(time: string): number {
  if (!time) return -1;
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

// Validates the whole week (HU-038, scenario 1):
//  - every interval must have start < end;
//  - intervals within the same enabled day must not overlap.
// Returns a flat map of intervalId -> message and a boolean for the page/save bar.
export function useScheduleValidation(schedule: WeekSchedule): {
  errors: IntervalErrors;
  isValid: boolean;
} {
  return useMemo(() => {
    const errors: IntervalErrors = {};

    for (const day of schedule) {
      if (!day.enabled) continue;

      // start < end
      for (const interval of day.intervals) {
        const start = toMinutes(interval.start);
        const end = toMinutes(interval.end);
        if (start < 0 || end < 0) {
          errors[interval.id] = 'Indique la hora de inicio y de fin.';
        } else if (start >= end) {
          errors[interval.id] = 'La hora de inicio debe ser menor a la hora de fin.';
        }
      }

      // overlap between valid intervals of the same day
      const valid = day.intervals.filter((i) => !errors[i.id]);
      for (let a = 0; a < valid.length; a++) {
        for (let b = a + 1; b < valid.length; b++) {
          const first = valid[a];
          const second = valid[b];
          const overlap =
            toMinutes(first.start) < toMinutes(second.end) &&
            toMinutes(second.start) < toMinutes(first.end);
          if (overlap) {
            const msg = 'Este intervalo se cruza con otra jornada del mismo día.';
            errors[first.id] = msg;
            errors[second.id] = msg;
          }
        }
      }
    }

    return { errors, isValid: Object.keys(errors).length === 0 };
  }, [schedule]);
}
