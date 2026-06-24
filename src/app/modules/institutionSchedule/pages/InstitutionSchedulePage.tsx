import { useState } from 'react';
import { toast } from 'sonner';
import PageContainer from '../../../components/PageContainer';
import PageHeader from '../../../components/PageHeader';
import { useInstitutionSchedule } from '../hooks/useInstitutionSchedule';
import {
  WeekScheduleTable,
  BulkTargetBar,
  SchedulePersistenceNotice,
  ScheduleBannerNotice,
  ScheduleSaveBar,
} from '../components';
import type { WeekdayKey } from '../types/institutionSchedule.types';

export default function InstitutionSchedulePage() {
  const {
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
    copyDayTo,
    save,
  } = useInstitutionSchedule();

  // Target weekdays for bulk edits (local UI state).
  const [selectedDays, setSelectedDays] = useState<WeekdayKey[]>([]);

  const toggleTarget = (weekday: WeekdayKey) =>
    setSelectedDays((prev) =>
      prev.includes(weekday) ? prev.filter((d) => d !== weekday) : [...prev, weekday]
    );

  // Copy a day's schedule onto the selected targets, then clear the selection.
  const applyToSelected = (source: WeekdayKey) => {
    copyDayTo(source, selectedDays);
    const count = selectedDays.filter((d) => d !== source).length;
    setSelectedDays([]);
    toast.success(
      `Horario copiado a ${count} día${count !== 1 ? 's' : ''}. Recuerde guardar los cambios.`
    );
  };

  return (
    <PageContainer>
      <PageHeader
        title="Horario Institucional"
        subtitle="Horario semanal recurrente: aplica a todas las semanas hasta que se modifique. Las excepciones de fechas puntuales se gestionan en Feriados."
      />

      <ScheduleBannerNotice banner={banner} onDismiss={dismissBanner} />

      <SchedulePersistenceNotice />

      <BulkTargetBar selectedDays={selectedDays} onToggle={toggleTarget} />

      <WeekScheduleTable
        schedule={schedule}
        errors={errors}
        selectedDays={selectedDays}
        onToggleDay={toggleDay}
        onAddInterval={addInterval}
        onRemoveInterval={removeInterval}
        onChangeInterval={updateInterval}
        onApplyToSelected={applyToSelected}
      />

      <ScheduleSaveBar isValid={isValid} saving={saving} onSave={save} />
    </PageContainer>
  );
}
