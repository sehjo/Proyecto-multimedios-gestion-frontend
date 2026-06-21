import HolidayForm from './HolidayForm';
import HolidayList from './HolidayList';
import HolidayCalendar from './HolidayCalendar';
import ConfirmHolidayModal from './ConfirmHolidayModal';
import type {
  AffectedAppointment,
  Holiday,
  HolidayFormData,
  HolidayFormErrors,
} from '../types/holidays.types';

// The pending-confirmation shape mirrors the hook's internal PendingHoliday.
interface PendingHoliday {
  holiday: Holiday;
  appointments: AffectedAppointment[];
}

interface HolidaysSectionProps {
  holidays: Holiday[];
  form: HolidayFormData;
  errors: HolidayFormErrors;
  today: string;
  pending: PendingHoliday | null;
  onFieldChange: (field: keyof HolidayFormData, value: string) => void;
  onSubmit: () => void;
  onConfirmPending: () => void;
  onCancelPending: () => void;
  onRemove: (id: string) => void;
}

// Composes the whole holidays area: title, the register form, the registered
// list, the blocked-days calendar and the confirmation modal shown when a date
// collides with appointments (HU-039).
export default function HolidaysSection({
  holidays,
  form,
  errors,
  today,
  pending,
  onFieldChange,
  onSubmit,
  onConfirmPending,
  onCancelPending,
  onRemove,
}: HolidaysSectionProps) {
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Días feriados y cierres</h2>
        <p className="text-sm text-gray-500">
          Registre feriados o cierres institucionales. Las fechas marcadas se bloquean para nuevas
          citas.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 mb-4">
        <HolidayForm
          form={form}
          errors={errors}
          today={today}
          onFieldChange={onFieldChange}
          onSubmit={onSubmit}
        />
        <HolidayCalendar
          holidays={holidays}
          selectedDate={form.date}
          onPickDate={(date) => onFieldChange('date', date)}
        />
      </div>

      <HolidayList holidays={holidays} onRemove={onRemove} />

      {pending && (
        <ConfirmHolidayModal
          holiday={pending.holiday}
          appointments={pending.appointments}
          onCancel={onCancelPending}
          onConfirm={onConfirmPending}
        />
      )}
    </section>
  );
}
