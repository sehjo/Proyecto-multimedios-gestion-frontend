import { formatDate } from '../constants';
import type { EnrichedAppointment } from '../types/appointments.types';

export default function AppointmentSummary({ appt }: { appt: EnrichedAppointment }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-2.5 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-500">Paciente</span>
        <span className="font-medium text-gray-900">{appt.patient_name}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500">Doctor</span>
        <span className="font-medium text-gray-900">{appt.doctor_name}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500">Especialidad</span>
        <span className="font-medium text-gray-900">{appt.specialty}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500">Fecha y hora</span>
        <span className="font-medium text-gray-900">
          {formatDate(appt.appointment_date)} — {appt.appointment_time}
        </span>
      </div>
    </div>
  );
}
