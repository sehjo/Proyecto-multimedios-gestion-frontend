import { RefreshCw } from 'lucide-react';
import AppointmentSummary from './AppointmentSummary';
import TimeSlotGrid from './TimeSlotGrid';
import type { EnrichedAppointment } from '../types/appointments.types';

interface RescheduleAppointmentModalProps {
  appointment: EnrichedAppointment;
  rescheduleDate: string;
  rescheduleTime: string;
  availableSlots: string[];
  today: string;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function RescheduleAppointmentModal({
  appointment,
  rescheduleDate,
  rescheduleTime,
  availableSlots,
  today,
  onDateChange,
  onTimeChange,
  onCancel,
  onConfirm,
}: RescheduleAppointmentModalProps) {
  return (
    <div className="app-modal-overlay fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="app-modal-panel bg-white rounded-xl shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <RefreshCw className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Reprogramar Cita</h3>
            <p className="text-sm text-gray-500">
              La cita original quedará en el historial como reprogramada.
            </p>
          </div>
        </div>

        <div className="mb-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">Cita actual</div>
        <AppointmentSummary appt={appointment} />

        <div className="mt-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nueva fecha *</label>
            <input
              type="date"
              required
              min={today}
              value={rescheduleDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nuevo horario disponible *</label>
            {!rescheduleDate ? (
              <p className="text-sm text-gray-400 italic">
                Seleccione una fecha para ver los horarios disponibles.
              </p>
            ) : (
              <TimeSlotGrid slots={availableSlots} selected={rescheduleTime} onSelect={onTimeChange} />
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Volver
          </button>
          <button
            type="button"
            disabled={!rescheduleDate || !rescheduleTime}
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirmar reprogramación
          </button>
        </div>
      </div>
    </div>
  );
}
