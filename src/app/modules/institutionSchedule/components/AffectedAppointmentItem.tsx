import { useState } from 'react';
import { Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { formatLongDate } from '../holidays.format';
import type { AffectedAppointment } from '../types/holidays.types';

interface AffectedAppointmentItemProps {
  appointment: AffectedAppointment;
}

// A single affected appointment row with an inline "Más información" toggle that
// expands the full detail (no appointment-detail route exists yet).
export default function AffectedAppointmentItem({ appointment }: AffectedAppointmentItemProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <li className="bg-white border border-amber-200 rounded-lg px-3 py-2 text-xs">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <span className="font-medium text-gray-900">{appointment.patientName}</span>
          <span className="text-gray-400 mx-1.5">·</span>
          <span className="text-gray-600">{appointment.doctorName}</span>
          <span className="text-gray-400 mx-1.5">·</span>
          <span className="text-gray-500">{appointment.specialty}</span>
        </div>
        <span className="flex items-center gap-1 text-gray-500 flex-shrink-0">
          <Clock className="w-3.5 h-3.5" />
          {appointment.time}
        </span>
      </div>

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="mt-1 flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
      >
        {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        {expanded ? 'Menos información' : 'Más información'}
      </button>

      {expanded && (
        <dl className="mt-2 grid grid-cols-[auto,1fr] gap-x-3 gap-y-1 border-t border-amber-100 pt-2 text-gray-600">
          <dt className="text-gray-400">Paciente</dt>
          <dd className="font-medium text-gray-900">{appointment.patientName}</dd>
          <dt className="text-gray-400">Doctor</dt>
          <dd>{appointment.doctorName}</dd>
          <dt className="text-gray-400">Especialidad</dt>
          <dd>{appointment.specialty}</dd>
          <dt className="text-gray-400">Fecha y hora</dt>
          <dd className="capitalize">
            {formatLongDate(appointment.date)} — {appointment.time}
          </dd>
          <dt className="text-gray-400">Estado nuevo</dt>
          <dd>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium">
              Pendiente de Reprogramación
            </span>
          </dd>
        </dl>
      )}
    </li>
  );
}
