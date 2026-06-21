import { useState } from 'react';
import PageContainer from '../../../components/PageContainer';
import PageHeader from '../../../components/PageHeader';
import { useInstitutionSchedule } from '../hooks/useInstitutionSchedule';
import { useHolidays } from '../hooks/useHolidays';
import {
  ScheduleTabs,
  WeeklyAvailabilitySection,
  HolidaysSection,
  type ScheduleTabKey,
} from '../components';

export default function InstitutionSchedulePage() {
  const [activeTab, setActiveTab] = useState<ScheduleTabKey>('weekly');

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
    save,
  } = useInstitutionSchedule();

  const holidays = useHolidays();

  return (
    <PageContainer>
      <PageHeader
        title="Horario Institucional"
        subtitle="Configure los días habilitados y los rangos de apertura y cierre de la institución."
      />

      <ScheduleTabs active={activeTab} onChange={setActiveTab} />

      {activeTab === 'weekly' && (
        <WeeklyAvailabilitySection
          schedule={schedule}
          errors={errors}
          isValid={isValid}
          banner={banner}
          saving={saving}
          onDismissBanner={dismissBanner}
          onToggleDay={toggleDay}
          onAddInterval={addInterval}
          onRemoveInterval={removeInterval}
          onChangeInterval={updateInterval}
          onSave={save}
        />
      )}

      {activeTab === 'holidays' && (
        <HolidaysSection
          holidays={holidays.holidays}
          form={holidays.form}
          errors={holidays.errors}
          today={holidays.today}
          pending={holidays.pending}
          onFieldChange={holidays.updateField}
          onSubmit={holidays.requestAddHoliday}
          onConfirmPending={holidays.confirmPendingHoliday}
          onCancelPending={holidays.cancelPendingHoliday}
          onRemove={holidays.removeHoliday}
        />
      )}
    </PageContainer>
  );
}
