import { FormEvent } from 'react';
import { Loader2, X } from 'lucide-react';
import PermissionGrid from '@/app/components/PermissionGrid';
import { PermissionRow } from '@/app/lib/permissions';
import { NAME_MAX } from '../constants';
import type { Role, RoleFormErrors } from '../types/roles.types';

interface RoleFormModalProps {
  editingRole: Role | null;
  name: string;
  permissions: Set<string>;
  errors: RoleFormErrors;
  submitting: boolean;
  // Protected (system) roles can't be renamed; the name input is locked.
  nameLocked: boolean;
  grid: PermissionRow[];
  onNameChange: (value: string) => void;
  onTogglePermission: (permName: string) => void;
  onCancel: () => void;
  onSubmit: (e: FormEvent) => void;
}

// Create/edit role modal. State lives in useRoleForm; this only renders it.
export default function RoleFormModal({
  editingRole,
  name,
  permissions,
  errors,
  submitting,
  nameLocked,
  grid,
  onNameChange,
  onTogglePermission,
  onCancel,
  onSubmit,
}: RoleFormModalProps) {
  return (
    <div className="app-modal-overlay fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mx-auto">
            {editingRole ? 'Actualizar Rol' : 'Crear rol'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} noValidate className="px-6 py-5 space-y-4 overflow-y-auto">
          {/* Name */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">Nombre del rol</label>
              <span className={`text-xs ${name.length >= NAME_MAX ? 'text-red-500' : 'text-gray-400'}`}>
                {name.length}/{NAME_MAX}
              </span>
            </div>
            <input
              type="text"
              maxLength={NAME_MAX}
              value={name}
              disabled={nameLocked}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Ej. Recepcion"
              className={`w-full px-3 py-2.5 border rounded-lg text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 ${
                errors.name ? 'border-red-400' : 'border-gray-200'
              }`}
            />
            {nameLocked && (
              <p className="mt-1 text-xs text-gray-400">
                Este rol del sistema no se puede renombrar; sus permisos sí.
              </p>
            )}
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          {/* Permission grid */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Configuración de permisos</p>
            <PermissionGrid rows={grid} selected={permissions} onToggle={onTogglePermission} />
            {errors.permissions && (
              <p className="mt-1 text-xs text-red-500">{errors.permissions}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {editingRole ? 'Actualizar Registro' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
