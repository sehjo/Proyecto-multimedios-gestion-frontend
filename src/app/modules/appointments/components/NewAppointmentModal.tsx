import { FormEvent } from 'react';
import SelectChevron from './SelectChevron';
import TimeSlotGrid from './TimeSlotGrid';
import type { AppointmentFormData, Doctor, Patient } from '../types/appointments.types';

interface NewAppointmentModalProps {
  formData: AppointmentFormData;
  patients: Patient[];
  doctors: Doctor[];
  availableSlots: string[];
  today: string;
  onFieldChange: (field: keyof AppointmentFormData, value: string) => void;
  onDoctorChange: (doctorId: string) => void;
  onCancel: () => void;
  onSubmit: (e: FormEvent) => void;
}

export default function NewAppointmentModal({
  formData,
  patients,
  doctors,
  availableSlots,
  today,
  onFieldChange,
  onDoctorChange,
  onCancel,
  onSubmit,
}: NewAppointmentModalProps) {
  return (
    <div className="app-modal-overlay fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="app-modal-panel bg-white rounded-xl shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Nueva Cita</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Paciente *</label>
            <div className="relative">
              <select
                required
                value={formData.patient_id}
                onChange={(e) => onFieldChange('patient_id', e.target.value)}
                className="w-full appearance-none px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Seleccionar paciente...</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} {p.lastname}
                  </option>
                ))}
              </select>
              <SelectChevron />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Doctor *</label>
            <div className="relative">
              <select
                required
                value={formData.doctor_id}
                onChange={(e) => onDoctorChange(e.target.value)}
                className="w-full appearance-none px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Seleccionar doctor...</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} {d.lastname}
                  </option>
                ))}
              </select>
              <SelectChevron />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Especialidad *</label>
            <input
              type="text"
              required
              maxLength={255}
              placeholder="ej. Cardiología, Pediatría"
              value={formData.specialty}
              onChange={(e) => onFieldChange('specialty', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha *</label>
            <input
              type="date"
              required
              min={today}
              value={formData.appointment_date}
              onChange={(e) => {
                onFieldChange('appointment_date', e.target.value);
                onFieldChange('appointment_time', '');
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hora disponible *</label>
            {!formData.doctor_id || !formData.appointment_date ? (
              <p className="text-sm text-gray-400 italic">
                Seleccione un doctor y fecha para ver los horarios disponibles.
              </p>
            ) : (
              <TimeSlotGrid
                slots={availableSlots}
                selected={formData.appointment_time}
                onSelect={(slot) => onFieldChange('appointment_time', slot)}
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
            <textarea
              rows={3}
              maxLength={500}
              placeholder="Observaciones adicionales..."
              value={formData.notes}
              onChange={(e) => onFieldChange('notes', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="app-modal-actions flex gap-2 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!formData.appointment_time}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirmar cita
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
