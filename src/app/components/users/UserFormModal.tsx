import type { UserType } from '../../../context/UserTypesContext';
import type { Specialty } from '../../../context/SpecialtiesContext';

export interface UserFormData {
  name: string;
  lastname: string;
  email: string;
  password: string;
  user_type_id: string;
  specialty_id: string;
}

interface UserFormModalProps {
  isEditing: boolean;
  formData: UserFormData;
  userTypes: UserType[];
  specialties: Specialty[];
  isDoctorSelected: boolean;
  onFieldChange: <K extends keyof UserFormData>(field: K, value: UserFormData[K]) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export default function UserFormModal({
  isEditing,
  formData,
  userTypes,
  specialties,
  isDoctorSelected,
  onFieldChange,
  onSubmit,
  onClose,
}: UserFormModalProps) {
  return (
    <div className="app-modal-overlay fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="app-modal-panel bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
        </h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
            <input
              type="text"
              required
              maxLength={255}
              value={formData.name}
              onChange={(e) => onFieldChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="text-right mt-1">
              <span className={`text-xs ${formData.name.length >= 255 ? 'text-red-500' : 'text-gray-500'}`}>
                {formData.name.length}/255
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Apellido *</label>
            <input
              type="text"
              required
              maxLength={255}
              value={formData.lastname}
              onChange={(e) => onFieldChange('lastname', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="text-right mt-1">
              <span className={`text-xs ${formData.lastname.length >= 255 ? 'text-red-500' : 'text-gray-500'}`}>
                {formData.lastname.length}/255
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              required
              maxLength={255}
              value={formData.email}
              onChange={(e) => onFieldChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="text-right mt-1">
              <span className={`text-xs ${formData.email.length >= 255 ? 'text-red-500' : 'text-gray-500'}`}>
                {formData.email.length}/255
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña {isEditing ? '(dejar en blanco para no cambiar)' : '*'}
            </label>
            <input
              type="password"
              required={!isEditing}
              maxLength={255}
              minLength={8}
              value={formData.password}
              onChange={(e) => onFieldChange('password', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="text-right mt-1">
              <span className={`text-xs ${formData.password.length >= 255 ? 'text-red-500' : 'text-gray-500'}`}>
                {formData.password.length}/255
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Usuario *</label>
            <div className="relative">
              <select
                required
                value={formData.user_type_id}
                onChange={(e) => {
                  const selectedType =
                    userTypes.find((t) => String(t.id) === e.target.value);
                  const isDoctor = selectedType?.name?.toLowerCase() === 'doctor';
                  onFieldChange('user_type_id', e.target.value);
                  if (!isDoctor) onFieldChange('specialty_id', '');
                }}
                className="w-full appearance-none px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Seleccionar...</option>
                {userTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg className="h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="mt-1 h-4" />
          </div>

          {isDoctorSelected && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Especialidad *</label>
              <div className="relative">
                <select
                  required
                  value={formData.specialty_id}
                  onChange={(e) => onFieldChange('specialty_id', e.target.value)}
                  className="w-full appearance-none px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Seleccionar...</option>
                  {specialties.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg className="h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="mt-1 h-4" />
            </div>
          )}

          <div className="app-modal-actions flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isEditing ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
