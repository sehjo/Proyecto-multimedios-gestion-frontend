import WeekdayScheduleCard from './WeekdayScheduleCard';
import type {
  IntervalErrors,
  TimeInterval,
  WeekdayKey,
  WeekSchedule,
} from '../types/institutionSchedule.types';

interface WeekScheduleGridProps {
  schedule: WeekSchedule;
  errors: IntervalErrors;
  onToggleDay: (weekday: WeekdayKey, enabled: boolean) => void;
  onAddInterval: (weekday: WeekdayKey) => void;
  onRemoveInterval: (weekday: WeekdayKey, intervalId: string) => void;
  onChangeInterval: (
    weekday: WeekdayKey,
    intervalId: string,
    change: Partial<Omit<TimeInterval, 'id'>>
  ) => void;
}

// Lays out the seven weekday cards in a responsive grid.
export default function WeekScheduleGrid({
  schedule,
  errors,
  onToggleDay,
  onAddInterval,
  onRemoveInterval,
  onChangeInterval,
}: WeekScheduleGridProps) {
  return (
    <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {schedule.map((day) => (
        <WeekdayScheduleCard
          key={day.weekday}
          day={day}
          errors={errors}
          onToggleDay={onToggleDay}
          onAddInterval={onAddInterval}
          onRemoveInterval={onRemoveInterval}
          onChangeInterval={onChangeInterval}
        />
      ))}
    </div>
  );
}
