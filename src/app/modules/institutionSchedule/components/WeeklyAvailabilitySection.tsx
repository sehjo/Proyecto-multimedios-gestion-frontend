import WeekScheduleGrid from './WeekScheduleGrid';
import SchedulePersistenceNotice from './SchedulePersistenceNotice';
import ScheduleBannerNotice from './ScheduleBannerNotice';
import ScheduleSaveBar from './ScheduleSaveBar';
import type {
  IntervalErrors,
  ScheduleBanner,
  TimeInterval,
  WeekdayKey,
  WeekSchedule,
} from '../types/institutionSchedule.types';

interface WeeklyAvailabilitySectionProps {
  schedule: WeekSchedule;
  errors: IntervalErrors;
  isValid: boolean;
  banner: ScheduleBanner | null;
  saving: boolean;
  onDismissBanner: () => void;
  onToggleDay: (weekday: WeekdayKey, enabled: boolean) => void;
  onAddInterval: (weekday: WeekdayKey) => void;
  onRemoveInterval: (weekday: WeekdayKey, intervalId: string) => void;
  onChangeInterval: (
    weekday: WeekdayKey,
    intervalId: string,
    change: Partial<Omit<TimeInterval, 'id'>>
  ) => void;
  onSave: () => void;
}

// Composes the weekly availability area: result banner, persistence notice,
// the weekday grid and the save bar (HU-038).
export default function WeeklyAvailabilitySection({
  schedule,
  errors,
  isValid,
  banner,
  saving,
  onDismissBanner,
  onToggleDay,
  onAddInterval,
  onRemoveInterval,
  onChangeInterval,
  onSave,
}: WeeklyAvailabilitySectionProps) {
  return (
    <>
      <ScheduleBannerNotice banner={banner} onDismiss={onDismissBanner} />
      <SchedulePersistenceNotice />
      <WeekScheduleGrid
        schedule={schedule}
        errors={errors}
        onToggleDay={onToggleDay}
        onAddInterval={onAddInterval}
        onRemoveInterval={onRemoveInterval}
        onChangeInterval={onChangeInterval}
      />
      <ScheduleSaveBar isValid={isValid} saving={saving} onSave={onSave} />
    </>
  );
}
