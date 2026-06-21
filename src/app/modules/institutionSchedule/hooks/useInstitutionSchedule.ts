import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useActivity } from '../../../../context/ActivityContext';
import {
  getInstitutionSchedule,
  saveInstitutionSchedule,
} from '../services/institutionScheduleService';
import { useScheduleValidation } from './useScheduleValidation';
import type {
  ScheduleBanner,
  TimeInterval,
  WeekdayKey,
  WeekSchedule,
} from '../types/institutionSchedule.types';

// Sensible defaults for a freshly added interval.
const NEW_INTERVAL_START = '08:00';
const NEW_INTERVAL_END = '12:00';

function makeIntervalId(weekday: WeekdayKey): string {
  return `${weekday}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// Owns the editable week: loading from storage, toggling days, adding/editing/
// removing intervals, validation and saving. Keeps the page free of logic.
export function useInstitutionSchedule() {
  const { logActivity } = useActivity();

  const [schedule, setSchedule] = useState<WeekSchedule>(getInstitutionSchedule);
  const [banner, setBanner] = useState<ScheduleBanner | null>(null);
  const [saving, setSaving] = useState(false);

  const { errors, isValid } = useScheduleValidation(schedule);

  const showBanner = useCallback((msg: string, type: ScheduleBanner['type'] = 'success') => {
    const next: ScheduleBanner = { type, msg };
    setBanner(next);
    window.setTimeout(() => setBanner((b) => (b === next ? null : b)), 5000);
  }, []);

  const dismissBanner = useCallback(() => setBanner(null), []);

  // Replace one day's record, leaving the rest of the week intact.
  const updateDay = useCallback((weekday: WeekdayKey, change: Partial<WeekSchedule[number]>) => {
    setSchedule((prev) =>
      prev.map((day) => (day.weekday === weekday ? { ...day, ...change } : day))
    );
  }, []);

  const toggleDay = useCallback(
    (weekday: WeekdayKey, enabled: boolean) => {
      updateDay(weekday, { enabled });
    },
    [updateDay]
  );

  const addInterval = useCallback((weekday: WeekdayKey) => {
    setSchedule((prev) =>
      prev.map((day) =>
        day.weekday === weekday
          ? {
              ...day,
              intervals: [
                ...day.intervals,
                { id: makeIntervalId(weekday), start: NEW_INTERVAL_START, end: NEW_INTERVAL_END },
              ],
            }
          : day
      )
    );
  }, []);

  const removeInterval = useCallback((weekday: WeekdayKey, intervalId: string) => {
    setSchedule((prev) =>
      prev.map((day) =>
        day.weekday === weekday
          ? { ...day, intervals: day.intervals.filter((i) => i.id !== intervalId) }
          : day
      )
    );
  }, []);

  const updateInterval = useCallback(
    (weekday: WeekdayKey, intervalId: string, change: Partial<Omit<TimeInterval, 'id'>>) => {
      setSchedule((prev) =>
        prev.map((day) =>
          day.weekday === weekday
            ? {
                ...day,
                intervals: day.intervals.map((i) =>
                  i.id === intervalId ? { ...i, ...change } : i
                ),
              }
            : day
        )
      );
    },
    []
  );

  // Clear a stale success/info banner whenever the user edits again.
  useEffect(() => {
    setBanner(null);
  }, [schedule]);

  const save = useCallback(() => {
    if (!isValid) {
      toast.error('Corrija los intervalos marcados antes de guardar.');
      return;
    }
    setSaving(true);
    try {
      saveInstitutionSchedule(schedule);
      logActivity({ type: 'Horario institucional actualizado', name: 'Configuración general' });
      // Scenario 3: confirmed appointments are preserved; changes apply to new ones.
      showBanner(
        'Horario institucional guardado. Las citas confirmadas se mantienen; los cambios aplican solo a nuevas citas.'
      );
    } catch (error) {
      console.error('Error saving institution schedule:', error);
      toast.error('Error al guardar el horario institucional.');
    } finally {
      setSaving(false);
    }
  }, [isValid, schedule, logActivity, showBanner]);

  return {
    schedule,
    errors,
    isValid,
    banner,
    dismissBanner,
    saving,
    toggleDay,
    addInterval,
    removeInterval,
    updateInterval,
    save,
  };
}
