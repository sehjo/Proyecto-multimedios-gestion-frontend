import { useState } from 'react';
import PageContainer from '../../../components/PageContainer';
import PageHeader from '../../../components/PageHeader';
import { useInstitutionSchedule } from '../hooks/useInstitutionSchedule';
import {
  WeekScheduleTable,
  BulkEditBar,
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
    applyToDays,
    save,
  } = useInstitutionSchedule();

  // Weekdays checked for bulk editing (local UI state).
  const [selectedDays, setSelectedDays] = useState<WeekdayKey[]>([]);

  const toggleSelect = (weekday: WeekdayKey) =>
    setSelectedDays((prev) =>
      prev.includes(weekday) ? prev.filter((d) => d !== weekday) : [...prev, weekday]
    );

  const clearSelection = () => setSelectedDays([]);

  const handleBulkApply = (enabled: boolean, intervals: { start: string; end: string }[]) => {
    applyToDays(selectedDays, enabled, intervals);
    clearSelection();
  };

  return (
    <PageContainer>
      <PageHeader
        title="Horario Institucional"
        subtitle="Configure los días habilitados y los rangos de apertura y cierre de la institución."
      />

      <ScheduleBannerNotice banner={banner} onDismiss={dismissBanner} />

      <SchedulePersistenceNotice />

      {selectedDays.length >= 2 && (
        <BulkEditBar
          selectedCount={selectedDays.length}
          onApply={handleBulkApply}
          onClear={clearSelection}
        />
      )}

      <WeekScheduleTable
        schedule={schedule}
        errors={errors}
        selectedDays={selectedDays}
        onToggleSelect={toggleSelect}
        onToggleDay={toggleDay}
        onAddInterval={addInterval}
        onRemoveInterval={removeInterval}
        onChangeInterval={updateInterval}
      />

      <ScheduleSaveBar isValid={isValid} saving={saving} onSave={save} />
    </PageContainer>
  );
}
