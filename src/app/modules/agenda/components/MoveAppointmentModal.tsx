import { Calendar } from 'lucide-react';
import type { PendingDrop } from '../types/agenda.types';

interface MoveAppointmentModalProps {
  pendingDrop: PendingDrop;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function MoveAppointmentModal({ pendingDrop, onCancel, onConfirm }: MoveAppointmentModalProps) {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirmar cambio de horario</h3>
          <p className="text-sm text-gray-500 mb-1">
            ¿Mover la cita de <strong>{pendingDrop.appt.patientName}</strong>?
          </p>
          <p className="text-sm text-gray-500 mb-2">
            Nuevo horario: <strong>{pendingDrop.date}</strong> a las{' '}
            <strong>{String(pendingDrop.hour).padStart(2, '0')}:00</strong>
          </p>
          <p className="text-xs text-green-600 font-medium mb-6">✓ Horario disponible</p>
          <div className="flex gap-3 w-full">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
