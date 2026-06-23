import { X } from 'lucide-react';
import PermissionGrid from '@/app/components/PermissionGrid';
import { PermissionRow } from '@/app/lib/permissions';
import type { Role } from '../types/roles.types';

interface RoleDetailsModalProps {
  role: Role;
  grid: PermissionRow[];
  canUpdate: boolean;
  onClose: () => void;
  onEdit: (role: Role) => void;
}

// Read-only role details (opened by clicking the role name). The permission grid
// is disabled; "Editar" only shows when allowed (not your own role).
export default function RoleDetailsModal({
  role,
  grid,
  canUpdate,
  onClose,
  onEdit,
}: RoleDetailsModalProps) {
  return (
    <div className="app-modal-overlay fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mx-auto">Ver Rol</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del rol</label>
            <input
              type="text"
              value={role.name}
              readOnly
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 bg-gray-50"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Configuración de permisos</p>
            <PermissionGrid rows={grid} selected={new Set(role.permissions)} disabled />
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            {canUpdate && (
              <button
                onClick={() => onEdit(role)}
                className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors cursor-pointer"
              >
                Editar
              </button>
            )}
            <button
              onClick={onClose}
              className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
