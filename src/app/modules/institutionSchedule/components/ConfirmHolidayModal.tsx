import { AlertTriangle, X } from 'lucide-react';
import AffectedAppointmentsList from './AffectedAppointmentsList';
import { formatLongDate } from '../holidays.format';
import type { AffectedAppointment, Holiday } from '../types/holidays.types';

interface ConfirmHolidayModalProps {
  holiday: Holiday;
  appointments: AffectedAppointment[];
  onCancel: () => void;
  onConfirm: () => void;
}

// Confirmation step before saving a holiday whose date collides with existing
// appointments (HU-039). Lets the admin review the impact and back out if they
// picked the wrong day, since confirming moves those appointments to
// "Pendiente de Reprogramación".
export default function ConfirmHolidayModal({
  holiday,
  appointments,
  onCancel,
  onConfirm,
}: ConfirmHolidayModalProps) {
  const count = appointments.length;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-3 p-6 pb-4 border-b border-gray-100">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Confirmar día feriado</h3>
              <p className="text-sm text-gray-500">
                Esta fecha tiene citas agendadas que cambiarán de estado.
              </p>
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
          <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-gray-500">Evento</span>
              <span className="font-medium text-gray-900 text-right">{holiday.title}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-gray-500">Fecha</span>
              <span className="font-medium text-gray-900 text-right capitalize">
                {formatLongDate(holiday.date)}
              </span>
            </div>
            {holiday.description && (
              <div className="flex justify-between gap-3">
                <span className="text-gray-500">Descripción</span>
                <span className="text-gray-700 text-right">{holiday.description}</span>
              </div>
            )}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-amber-900 mb-1">
              {count} cita{count !== 1 ? 's' : ''} se marcará{count !== 1 ? 'n' : ''} como
              «Pendiente de Reprogramación»
            </p>
            <p className="text-xs text-amber-700 mb-3">
              Si seleccionó la fecha por error, cancele y elija otro día.
            </p>
            <AffectedAppointmentsList appointments={appointments} />
          </div>
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
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
          >
            Confirmar feriado
          </button>
        </div>
      </div>
    </div>
  );
}
