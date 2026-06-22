import { useState } from 'react';
import { useNavigate } from 'react-router';
import PageContainer from '../../../components/PageContainer';
import PageHeader from '../../../components/PageHeader';
import { useInstitutionSchedule } from '../hooks/useInstitutionSchedule';
import { useHolidays } from '../hooks/useHolidays';
import { useRescheduleQueue } from '../hooks/useRescheduleQueue';
import {
  ScheduleTabs,
  WeeklyAvailabilitySection,
  HolidaysSection,
  RescheduleModal,
  type ScheduleTabKey,
} from '../components';
import type { PendingReschedule } from '../types/holidays.types';

export default function InstitutionSchedulePage() {
  const navigate = useNavigate();
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

  const rescheduleQueue = useRescheduleQueue();
  // Refresh the queue right after a confirmed closure enqueues new appointments,
  // so the "por reagendar" counter and the prompt stay in sync.
  const holidays = useHolidays(rescheduleQueue.refresh);

  // The "Reagenda" prompt works on the freshly displaced appointments; map them
  // to the queue shape so the per-appointment reschedule modal has the originals.
  const promptAppointments: PendingReschedule[] = holidays.reschedulePrompt.map((a) => ({
    ...a,
    originalDate: a.date,
    originalTime: a.time,
    holidayTitle: '',
  }));

  const goToRescheduleAll = () => {
    holidays.dismissReschedulePrompt();
    navigate('/institution-schedule/reschedule');
  };

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
          pendingRescheduleCount={rescheduleQueue.queue.length}
          onFieldChange={holidays.updateField}
          onSubmit={holidays.requestAddHoliday}
          onConfirmPending={holidays.confirmPendingHoliday}
          onCancelPending={holidays.cancelPendingHoliday}
          onRemove={holidays.removeHoliday}
          onGoToReschedule={() => navigate('/institution-schedule/reschedule')}
        />
      )}

      {promptAppointments.length > 0 && (
        <RescheduleModal
          appointments={promptAppointments}
          today={rescheduleQueue.today}
          validateSlot={rescheduleQueue.validateSlot}
          onRescheduleOne={rescheduleQueue.reschedule}
          onLater={holidays.dismissReschedulePrompt}
          onRescheduleAll={goToRescheduleAll}
        />
      )}
    </PageContainer>
  );
}
