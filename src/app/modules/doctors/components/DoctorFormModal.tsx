import { FormEvent } from 'react';
import { Loader2 } from 'lucide-react';
import type { Doctor, DoctorFormData, Speciality } from '../types/doctors.types';
import { IDENTIFIER_MAX, NAME_MAX, EMAIL_MAX } from '../hooks/useDoctorForm';

interface DoctorFormModalProps {
  editingDoctor: Doctor | null;
  formData: DoctorFormData;
  specialities: Speciality[];
  submitting: boolean;
  onFieldChange: (field: keyof DoctorFormData, value: string | string[]) => void;
  onCancel: () => void;
  onSubmit: (e: FormEvent) => void;
}

// Character counter shown to the right of each input (red when at the max).
function Counter({ value, max }: { value: number; max: number }) {
  return (
    <div className="text-right mt-1">
      <span className={`text-xs ${value >= max ? 'text-red-500' : 'text-gray-500'}`}>
        {value}/{max}
      </span>
    </div>
  );
}

const INPUT_CLASS =
  'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500';

// Create/edit doctor modal. State lives in useDoctorForm; this only renders it.
export default function DoctorFormModal({
  editingDoctor,
  formData,
  specialities,
  submitting,
  onFieldChange,
  onCancel,
  onSubmit,
}: DoctorFormModalProps) {
  const onSpecialitiesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions).map((option) => option.value);
    onFieldChange('speciality_ids', selected);
  };

  return (
    <div className="app-modal-overlay fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="app-modal-panel bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {editingDoctor ? 'Editar Doctor' : 'Nuevo Doctor'}
        </h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Identificación *</label>
            <input
              type="text"
              required
              maxLength={IDENTIFIER_MAX}
              value={formData.identifier}
              onChange={(e) => onFieldChange('identifier', e.target.value)}
              className={INPUT_CLASS}
            />
            <Counter value={formData.identifier.length} max={IDENTIFIER_MAX} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
            <input
              type="text"
              required
              maxLength={NAME_MAX}
              value={formData.name}
              onChange={(e) => onFieldChange('name', e.target.value)}
              className={INPUT_CLASS}
            />
            <Counter value={formData.name.length} max={NAME_MAX} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              required
              maxLength={EMAIL_MAX}
              value={formData.email}
              onChange={(e) => onFieldChange('email', e.target.value)}
              className={INPUT_CLASS}
            />
            <Counter value={formData.email.length} max={EMAIL_MAX} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Especialidades</label>
            <select
              multiple
              value={formData.speciality_ids}
              onChange={onSpecialitiesChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              size={Math.min(5, Math.max(3, specialities.length))}
            >
              {specialities.map((speciality) => (
                <option key={speciality.id} value={speciality.id}>
                  {speciality.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-400 mt-1">Mantenga Ctrl (Cmd en Mac) para seleccionar varias.</p>
          </div>

          <p className="text-xs text-gray-400">* Los campos son requeridos</p>

          <div className="app-modal-actions flex gap-2 pt-4">
            <button
              type="button"
              disabled={submitting}
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {editingDoctor ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
