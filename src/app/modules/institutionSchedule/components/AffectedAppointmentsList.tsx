import { useState } from 'react';
import { ListChecks } from 'lucide-react';
import AffectedAppointmentItem from './AffectedAppointmentItem';
import type { AffectedAppointment } from '../types/holidays.types';

interface AffectedAppointmentsListProps {
  appointments: AffectedAppointment[];
}

const PREVIEW_COUNT = 3;

// Shows the affected appointments, collapsed to the first three with a
// "Mostrar todas (N)" toggle when there are more.
export default function AffectedAppointmentsList({
  appointments,
}: AffectedAppointmentsListProps) {
  const [showAll, setShowAll] = useState(false);

  const hasMore = appointments.length > PREVIEW_COUNT;
  const visible = showAll ? appointments : appointments.slice(0, PREVIEW_COUNT);

  return (
    <div>
      <ul className="space-y-1.5">
        {visible.map((appt) => (
          <AffectedAppointmentItem key={appt.id} appointment={appt} />
        ))}
      </ul>

      {hasMore && (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="mt-2 flex items-center gap-1.5 text-xs font-medium text-amber-800 hover:text-amber-900"
        >
          <ListChecks className="w-3.5 h-3.5" />
          {showAll
            ? 'Mostrar menos'
            : `Mostrar todas (${appointments.length})`}
        </button>
      )}
    </div>
  );
}
