import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { useActivity } from '../../../../context/ActivityContext';
import {
  applyReschedule,
  getRescheduleQueue,
} from '../services/rescheduleQueueService';
import { isWithinInstitutionSchedule } from '../services/institutionScheduleService';
import { todayISO } from '../holidays.constants';
import type { PendingReschedule } from '../types/holidays.types';

// Owns the "pending rescheduling" queue: loads it from storage, validates a new
// slot against the institutional schedule (and holidays), and resolves an
// appointment once rescheduled (HU-039, scenario 3).
export function useRescheduleQueue() {
  const { logActivity } = useActivity();
  const [queue, setQueue] = useState<PendingReschedule[]>(getRescheduleQueue);

  const today = todayISO();

  // Re-read from storage (e.g. after the holiday flow enqueued new items).
  const refresh = useCallback(() => setQueue(getRescheduleQueue()), []);

  // Validate a candidate slot: not in the past, and inside an open institutional
  // interval (which also rejects holidays). Returns an error message or null.
  const validateSlot = useCallback(
    (date: string, time: string): string | null => {
      if (!date || !time) return 'Indique la nueva fecha y hora.';
      if (date < today) return 'La fecha debe ser igual o posterior a hoy.';
      if (!isWithinInstitutionSchedule(date, time)) {
        return 'La fecha y hora están fuera del horario institucional o en un día feriado.';
      }
      return null;
    },
    [today]
  );

  // Apply a new slot to a queued appointment and drop it from the queue.
  const reschedule = useCallback(
    (appointment: PendingReschedule, date: string, time: string): boolean => {
      const error = validateSlot(date, time);
      if (error) {
        toast.error(error);
        return false;
      }
      setQueue(applyReschedule(appointment.id, date, time));
      logActivity({ type: 'Cita reprogramada', name: appointment.patientName });
      toast.success(`Cita de ${appointment.patientName} reprogramada.`);
      return true;
    },
    [validateSlot, logActivity]
  );

  return { queue, today, refresh, validateSlot, reschedule };
}
