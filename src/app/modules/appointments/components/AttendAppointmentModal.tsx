import { CheckCircle, Info } from 'lucide-react';
import AppointmentSummary from './AppointmentSummary';
import type { EnrichedAppointment } from '../types/appointments.types';

interface AttendAppointmentModalProps {
  appointment: EnrichedAppointment;
  diagnosis: string;
  treatment: string;
  observations: string;
  diagnosisError: string;
  onDiagnosisChange: (value: string) => void;
  onTreatmentChange: (value: string) => void;
  onObservationsChange: (value: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function AttendAppointmentModal({
  appointment,
  diagnosis,
  treatment,
  observations,
  diagnosisError,
  onDiagnosisChange,
  onTreatmentChange,
  onObservationsChange,
  onCancel,
  onConfirm,
}: AttendAppointmentModalProps) {
  return (
    <div className="app-modal-overlay fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 pb-4 border-b border-gray-100">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Registrar Atención</h3>
              <p className="text-sm text-gray-500">
                Complete el registro médico para vincular esta cita al historial del paciente.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <AppointmentSummary appt={appointment} />

          <div className="border-t border-gray-200 pt-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
              Registro de la atención
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Diagnóstico <span className="text-red-500">*</span>
                  <span className="text-gray-400 font-normal ml-1">(máx. 500 caracteres)</span>
                </label>
                <textarea
                  rows={3}
                  maxLength={500}
                  placeholder="Describa el diagnóstico de la consulta..."
                  value={diagnosis}
                  onChange={(e) => onDiagnosisChange(e.target.value)}
                  autoFocus
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none text-sm ${
                    diagnosisError ? 'border-red-400 bg-red-50' : 'border-gray-300'
                  }`}
                />
                <div className="flex justify-between mt-1">
                  {diagnosisError ? <p className="text-red-500 text-xs">{diagnosisError}</p> : <span />}
                  <span className={`text-xs ${diagnosis.length >= 500 ? 'text-red-500' : 'text-gray-400'}`}>
                    {diagnosis.length}/500
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tratamiento indicado
                  <span className="text-gray-400 font-normal ml-1">(opcional, máx. 500 caracteres)</span>
                </label>
                <textarea
                  rows={3}
                  maxLength={500}
                  placeholder="Describa el tratamiento indicado al paciente..."
                  value={treatment}
                  onChange={(e) => onTreatmentChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none text-sm"
                />
                <p className="text-right text-xs text-gray-400 mt-0.5">{treatment.length}/500</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observaciones
                  <span className="text-gray-400 font-normal ml-1">(opcional, máx. 1000 caracteres)</span>
                </label>
                <textarea
                  rows={3}
                  maxLength={1000}
                  placeholder="Observaciones adicionales de la consulta..."
                  value={observations}
                  onChange={(e) => onObservationsChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none text-sm"
                />
                <p className="text-right text-xs text-gray-400 mt-0.5">{observations.length}/1000</p>
              </div>

              <div className="flex items-start gap-2.5 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
                <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800">
                  Los medicamentos indicados pueden agregarse desde el{' '}
                  <span className="font-medium">historial del paciente</span> después de guardar.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Confirmar y vincular al historial
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
