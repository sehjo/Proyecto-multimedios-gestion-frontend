import PageContainer from '../../../components/PageContainer';
import PageHeader from '../../../components/PageHeader';
import { useInstitutionSchedule } from '../hooks/useInstitutionSchedule';
import {
  WeekScheduleGrid,
  SchedulePersistenceNotice,
  ScheduleBannerNotice,
  ScheduleSaveBar,
} from '../components';

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
    save,
  } = useInstitutionSchedule();

  return (
    <PageContainer>
      <PageHeader
        title="Horario Institucional"
        subtitle="Configure los días habilitados y los rangos de apertura y cierre de la institución."
      />

      <ScheduleBannerNotice banner={banner} onDismiss={dismissBanner} />

      <SchedulePersistenceNotice />

      <WeekScheduleGrid
        schedule={schedule}
        errors={errors}
        onToggleDay={toggleDay}
        onAddInterval={addInterval}
        onRemoveInterval={removeInterval}
        onChangeInterval={updateInterval}
      />

      <ScheduleSaveBar isValid={isValid} saving={saving} onSave={save} />
    </PageContainer>
  );
}
