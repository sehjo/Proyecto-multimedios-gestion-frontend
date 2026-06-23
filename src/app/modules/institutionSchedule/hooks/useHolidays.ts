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

const EMPTY_FORM: HolidayFormData = { dates: [], title: '', description: '' };

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

  // Update a text field (title/description). Only title carries a validation error.
  const updateField = useCallback(
    (field: 'title' | 'description', value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      if (field === 'title') setErrors((prev) => ({ ...prev, title: undefined }));
    },
    []
  );

  // Replace the whole selected-dates set (the calendar owns the selection logic).
  const setDates = useCallback((dates: string[]) => {
    setForm((prev) => ({ ...prev, dates: [...dates].sort() }));
    setErrors((prev) => ({ ...prev, dates: undefined }));
  }, []);

  // Remove a single selected day (chip "x" in the form).
  const removeDate = useCallback((date: string) => {
    setForm((prev) => ({ ...prev, dates: prev.dates.filter((d) => d !== date) }));
  }, []);

  // Clear the whole selection.
  const clearDates = useCallback(() => {
    setForm((prev) => ({ ...prev, dates: [] }));
  }, []);

  const validate = useCallback(
    (data: HolidayFormData): HolidayFormErrors => {
      const next: HolidayFormErrors = {};
      if (data.dates.length === 0) {
        next.dates = 'Seleccione al menos un día de cierre.';
      } else if (data.dates.some((d) => d < today)) {
        next.dates = 'Las fechas deben ser iguales o posteriores a la fecha actual.';
      } else {
        // Reject days already covered by another registered holiday.
        const taken = new Set(holidays.flatMap((h) => h.dates));
        if (data.dates.some((d) => taken.has(d))) {
          next.dates = 'Una o más fechas ya están registradas como cierre.';
        }
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

      // Reset the whole form so the calendar clears its selection and the next
      // closure starts from scratch (the saved dates are now blocked anyway).
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
      dates: [...form.dates].sort(),
      title: form.title.trim(),
      description: form.description.trim(),
    };

    const impacted = getAffectedAppointments(holiday.dates);
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
    setDates,
    removeDate,
    clearDates,
    requestAddHoliday,
    confirmPendingHoliday,
    cancelPendingHoliday,
    dismissReschedulePrompt,
    removeHoliday,
  };
}
