import { FormEvent } from 'react';
import { Loader2 } from 'lucide-react';
import type { Speciality, SpecialityFormData } from '../types/doctors.types';
import { SPECIALITY_NAME_MAX } from '../hooks/useSpecialityForm';

interface SpecialityFormFieldsProps {
  editingSpeciality: Speciality | null;
  formData: SpecialityFormData;
  submitting: boolean;
  onFieldChange: (field: keyof SpecialityFormData, value: string) => void;
  onCancel: () => void;
  onSubmit: (e: FormEvent) => void;
}

// Inline create/edit form for a speciality, shown above the catalog table
// inside the specialities manager modal (nested in the doctors page).
export default function SpecialityFormFields({
  editingSpeciality,
  formData,
  submitting,
  onFieldChange,
  onCancel,
  onSubmit,
}: SpecialityFormFieldsProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-3 mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h3 className="text-sm font-semibold text-gray-800">
        {editingSpeciality ? 'Editar especialidad' : 'Nueva especialidad'}
      </h3>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Nombre *</label>
        <input
          type="text"
          required
          maxLength={SPECIALITY_NAME_MAX}
          value={formData.name}
          onChange={(e) => onFieldChange('name', e.target.value)}
          placeholder="ej. Cardiología, Pediatría"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Descripción</label>
        <textarea
          value={formData.description}
          onChange={(e) => onFieldChange('description', e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex gap-2 pt-1">
        <button
          type="button"
          disabled={submitting}
          onClick={onCancel}
          className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {editingSpeciality ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
}
