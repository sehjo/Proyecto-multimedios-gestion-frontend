import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useActivity } from '../../../../context/ActivityContext';
import {
  getAffectedAppointments,
  getHolidays,
  saveHolidays,
} from '../services/holidaysService';
import { enqueueReschedules } from '../services/rescheduleQueueService';
import { todayISO } from '../holidays.constants';
import type {
  AffectedAppointment,
  Holiday,
  HolidayFormData,
  HolidayFormErrors,
} from '../types/holidays.types';

const EMPTY_FORM: HolidayFormData = { date: '', title: '', description: '' };

function makeHolidayId(): string {
  return `hol-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// A holiday awaiting admin confirmation because it collides with existing
// appointments. Holds the not-yet-saved holiday and the appointments it impacts.
interface PendingHoliday {
  holiday: Holiday;
  appointments: AffectedAppointment[];
}

// Owns the holidays list and the create form: validation (date >= today, title
// required, no duplicate date), a confirmation step when the date collides with
// existing appointments, and persistence. The colliding appointments are
// reviewed in the confirmation modal before the closure is saved (HU-039).
// `onEnqueued` runs after a confirmed closure adds appointments to the
// reschedule queue, so callers can refresh any queue-derived state.
export function useHolidays(onEnqueued?: () => void) {
  const { logActivity } = useActivity();

  const [holidays, setHolidays] = useState<Holiday[]>(getHolidays);
  const [form, setForm] = useState<HolidayFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<HolidayFormErrors>({});

  // Set while the confirmation modal is open (collision with appointments).
  const [pending, setPending] = useState<PendingHoliday | null>(null);

  // Set right after a closure with collisions is confirmed: holds the displaced
  // appointments to drive the "Reagenda" prompt.
  const [reschedulePrompt, setReschedulePrompt] = useState<AffectedAppointment[]>([]);

  const today = useMemo(() => todayISO(), []);

  const updateField = useCallback(
    (field: keyof HolidayFormData, value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    },
    []
  );

  const validate = useCallback(
    (data: HolidayFormData): HolidayFormErrors => {
      const next: HolidayFormErrors = {};
      if (!data.date) {
        next.date = 'Indique la fecha del cierre.';
      } else if (data.date < today) {
        next.date = 'La fecha debe ser igual o posterior a la fecha actual.';
      } else if (holidays.some((h) => h.date === data.date)) {
        next.date = 'Ya existe un cierre registrado para esta fecha.';
      }
      if (!data.title.trim()) {
        next.title = 'Indique el título del evento.';
      }
      return next;
    },
    [today, holidays]
  );

  // Persist a holiday. Shared by the direct path (no collisions) and the
  // confirmed path (modal). When there are collisions the user already reviewed
  // them in the confirmation modal, so we only toast the no-collision case.
  const commitHoliday = useCallback(
    (holiday: Holiday, impacted: AffectedAppointment[]) => {
      setHolidays(saveHolidays([...holidays, holiday]));
      logActivity({ type: 'Día feriado registrado', name: holiday.title });

      if (impacted.length === 0) {
        toast.success('Día feriado registrado y bloqueado para nuevas citas.');
      }

      setForm(EMPTY_FORM);
      setErrors({});
    },
    [holidays, logActivity]
  );

  // Validate and either ask for confirmation (date has appointments) or save
  // directly (no collisions). Does not mutate appointment state until confirmed.
  const requestAddHoliday = useCallback(() => {
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const holiday: Holiday = {
      id: makeHolidayId(),
      date: form.date,
      title: form.title.trim(),
      description: form.description.trim(),
    };

    const impacted = getAffectedAppointments(holiday.date);
    if (impacted.length > 0) {
      setPending({ holiday, appointments: impacted });
      return;
    }
    commitHoliday(holiday, []);
  }, [form, validate, commitHoliday]);

  // Admin confirmed the closure despite the colliding appointments: save it,
  // queue the displaced appointments for rescheduling and open the "Reagenda"
  // prompt so staff can act on them now or later.
  const confirmPendingHoliday = useCallback(() => {
    if (!pending) return;
    commitHoliday(pending.holiday, pending.appointments);
    enqueueReschedules(pending.appointments, pending.holiday.title);
    setReschedulePrompt(pending.appointments);
    setPending(null);
    onEnqueued?.();
  }, [pending, commitHoliday, onEnqueued]);

  // Admin backed out (e.g. picked the wrong day); nothing is saved.
  const cancelPendingHoliday = useCallback(() => setPending(null), []);

  // Close the "Reagenda" prompt ("Hacerlo más tarde"); the queue stays persisted.
  const dismissReschedulePrompt = useCallback(() => setReschedulePrompt([]), []);

  const removeHoliday = useCallback(
    (id: string) => {
      setHolidays(saveHolidays(holidays.filter((h) => h.id !== id)));
    },
    [holidays]
  );

  return {
    holidays,
    form,
    errors,
    today,
    pending,
    reschedulePrompt,
    updateField,
    requestAddHoliday,
    confirmPendingHoliday,
    cancelPendingHoliday,
    dismissReschedulePrompt,
    removeHoliday,
  };
}
