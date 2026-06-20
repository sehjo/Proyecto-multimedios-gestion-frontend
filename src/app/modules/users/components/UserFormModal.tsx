import { FormEvent } from 'react';
import { Loader2 } from 'lucide-react';
import type { UserRow, UserFormData, Role } from '../types/users.types';
import { NAME_MAX, EMAIL_MAX, PASSWORD_MAX, PASSWORD_MIN } from '../hooks/useUserForm';

interface UserFormModalProps {
  editingUser: UserRow | null;
  formData: UserFormData;
  roles: Role[];
  submitting: boolean;
  onFieldChange: (field: keyof UserFormData, value: string) => void;
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

// Create/edit user modal. State lives in useUserForm; this only renders it.
export default function UserFormModal({
  editingUser,
  formData,
  roles,
  submitting,
  onFieldChange,
  onCancel,
  onSubmit,
}: UserFormModalProps) {
  return (
    <div className="app-modal-overlay fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="app-modal-panel bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
        </h2>
        <form onSubmit={onSubmit} className="space-y-4">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Apellido *</label>
            <input
              type="text"
              required
              maxLength={NAME_MAX}
              value={formData.lastname}
              onChange={(e) => onFieldChange('lastname', e.target.value)}
              className={INPUT_CLASS}
            />
            <Counter value={formData.lastname.length} max={NAME_MAX} />
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña {editingUser ? '(dejar en blanco para no cambiar)' : '*'}
            </label>
            <input
              type="password"
              required={!editingUser}
              maxLength={PASSWORD_MAX}
              minLength={PASSWORD_MIN}
              value={formData.password}
              onChange={(e) => onFieldChange('password', e.target.value)}
              className={INPUT_CLASS}
            />
            <Counter value={formData.password.length} max={PASSWORD_MAX} />
          </div>

          {/* Role only on CREATE (POST /users requires an initial role). On edit a
              user may hold several roles, managed from the Roles tab. */}
          {!editingUser ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rol *</label>
              <div className="relative">
                <select
                  required
                  value={formData.role}
                  onChange={(e) => onFieldChange('role', e.target.value)}
                  className="w-full appearance-none px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Seleccionar...</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.name}>
                      {role.name}
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
          ) : (
            <p className="text-xs text-center text-gray-400 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5">
              Para editar los roles del usuario, diríjase a la pestaña de Roles.
            </p>
          )}

          {!editingUser && <p className="text-xs text-gray-400">* Los campos son requeridos</p>}

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
              {editingUser ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
