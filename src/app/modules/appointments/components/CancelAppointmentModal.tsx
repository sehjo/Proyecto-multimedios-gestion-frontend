import { AlertTriangle } from 'lucide-react';
import AppointmentSummary from './AppointmentSummary';
import type { EnrichedAppointment } from '../types/appointments.types';

interface CancelAppointmentModalProps {
  appointment: EnrichedAppointment;
  cancelReason: string;
  onReasonChange: (value: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function CancelAppointmentModal({
  appointment,
  cancelReason,
  onReasonChange,
  onCancel,
  onConfirm,
}: CancelAppointmentModalProps) {
  return (
    <div className="app-modal-overlay fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Cancelar Cita</h3>
            <p className="text-sm text-gray-500">Esta acción liberará el horario en la agenda del doctor.</p>
          </div>
        </div>

        <AppointmentSummary appt={appointment} />

        <div className="mt-5 mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">Motivo de cancelación *</label>
          <textarea
            rows={3}
            maxLength={500}
            placeholder="Indique el motivo de la cancelación..."
            value={cancelReason}
            onChange={(e) => onReasonChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            autoFocus
          />
          <p className="text-right text-xs text-gray-400 mt-1">{cancelReason.length}/500</p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Volver
          </button>
          <button
            type="button"
            disabled={!cancelReason.trim()}
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirmar cancelación
          </button>
        </div>
      </div>
    </div>
  );
}
