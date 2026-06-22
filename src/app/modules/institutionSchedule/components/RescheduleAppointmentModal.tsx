import { useState } from 'react';
import { RefreshCw, X, AlertCircle } from 'lucide-react';
import AvailableSlotPicker from './AvailableSlotPicker';
import { formatLongDate } from '../holidays.format';
import type { PendingReschedule } from '../types/holidays.types';

interface RescheduleAppointmentModalProps {
  appointment: PendingReschedule;
  today: string;
  // Returns an error message for an invalid slot, or null when valid.
  validateSlot: (date: string, time: string) => string | null;
  onCancel: () => void;
  onConfirm: (date: string, time: string) => void;
}

// Reschedules a single displaced appointment: pick a new date + time, validated
// against the institutional schedule and holidays (HU-039).
export default function RescheduleAppointmentModal({
  appointment,
  today,
  validateSlot,
  onCancel,
  onConfirm,
}: RescheduleAppointmentModalProps) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = () => {
    const validationError = validateSlot(date, time);
    if (validationError) {
      setError(validationError);
      return;
    }
    onConfirm(date, time);
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-start justify-between gap-3 p-6 pb-4 border-b border-gray-100">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <RefreshCw className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Reagendar cita</h3>
              <p className="text-sm text-gray-500">{appointment.patientName}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Cerrar"
            className="text-gray-400 hover:text-gray-600 p-1 rounded flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-1">
            <div className="flex justify-between gap-3">
              <span className="text-gray-500">Doctor</span>
              <span className="font-medium text-gray-900">{appointment.doctorName}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-gray-500">Fecha original</span>
              <span className="text-gray-700 capitalize">
                {formatLongDate(appointment.originalDate)} — {appointment.originalTime}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nueva fecha <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              min={today}
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setTime('');
                setError(null);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nueva hora <span className="text-red-500">*</span>
            </label>
            <AvailableSlotPicker
              doctorName={appointment.doctorName}
              date={date}
              selectedTime={time}
              onSelect={(slot) => {
                setTime(slot);
                setError(null);
              }}
            />
          </div>

          {error && (
            <p className="flex items-center gap-1 text-xs text-red-600">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              {error}
            </p>
          )}
        </div>

        <div className="flex gap-3 p-6 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!date || !time}
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
