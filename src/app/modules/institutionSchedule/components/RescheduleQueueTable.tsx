import { CalendarCheck2, RefreshCw } from 'lucide-react';
import { formatLongDate } from '../holidays.format';
import type { PendingReschedule } from '../types/holidays.types';

interface RescheduleQueueTableProps {
  appointments: PendingReschedule[];
  onReschedule: (appointment: PendingReschedule) => void;
}

// Table of appointments pending rescheduling after a holiday (HU-039). Each row
// exposes its own reschedule action.
export default function RescheduleQueueTable({
  appointments,
  onReschedule,
}: RescheduleQueueTableProps) {
  if (appointments.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm px-6 py-16 text-center">
        <CalendarCheck2 className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <p className="text-sm text-gray-600 font-medium">No hay citas pendientes de reprogramación.</p>
        <p className="text-xs text-gray-400 mt-1">
          Las citas afectadas por un feriado aparecerán aquí.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
            <tr>
              <th className="px-5 py-3">Paciente</th>
              <th className="px-5 py-3">Doctor</th>
              <th className="px-5 py-3">Especialidad</th>
              <th className="px-5 py-3">Fecha original</th>
              <th className="px-5 py-3">Motivo</th>
              <th className="px-5 py-3 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {appointments.map((appt) => (
              <tr key={appt.id} className="hover:bg-gray-50">
                <td className="px-5 py-3 font-medium text-gray-900">{appt.patientName}</td>
                <td className="px-5 py-3 text-gray-600">{appt.doctorName}</td>
                <td className="px-5 py-3 text-gray-600">{appt.specialty}</td>
                <td className="px-5 py-3 text-gray-600 capitalize">
                  {formatLongDate(appt.originalDate)} — {appt.originalTime}
                </td>
                <td className="px-5 py-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-medium">
                    {appt.holidayTitle}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => onReschedule(appt)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 border border-indigo-200 rounded-lg px-3 py-1.5 hover:bg-indigo-50 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Reagendar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
