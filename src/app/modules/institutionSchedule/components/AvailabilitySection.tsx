import AvailabilityCalendar from './AvailabilityCalendar';
import DayDetailModal from './DayDetailModal';
import { useDayDetail } from '../hooks/useDayDetail';

// Availability view (HU-039, availability scenarios 1-3): a month calendar with
// the green/yellow/red occupancy code, a day-detail modal and free temporal
// navigation. Self-contained; uses the local mock for appointments.
export default function AvailabilitySection() {
  const { detail, grouped, openDay, closeDay } = useDayDetail();

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Disponibilidad por día</h2>
        <p className="text-sm text-gray-500">
          Vea la ocupación de cada día (verde: normal · amarillo: alta · rojo: sin cupos) y
          haga clic en una fecha para ver el detalle.
        </p>
      </div>

      <AvailabilityCalendar onSelectDay={openDay} />

      {detail && <DayDetailModal detail={detail} grouped={grouped} onClose={closeDay} />}
    </section>
  );
}
