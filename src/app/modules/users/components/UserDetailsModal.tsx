import { UserCog, X } from 'lucide-react';
import type { User } from '../types/users.types';

interface UserDetailsModalProps {
  user: User;
  canUpdate: boolean;
  onClose: () => void;
  onEdit: (user: User) => void;
}

const roleLabel = (roles?: string[]): string =>
  Array.isArray(roles) && roles.length
    ? roles.map((r) => String(r).toUpperCase()).join(', ')
    : '—';

// Read-only details modal (opened by clicking the user's name).
export default function UserDetailsModal({ user, canUpdate, onClose, onEdit }: UserDetailsModalProps) {
  return (
    <div className="app-modal-overlay fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="app-modal-panel bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
            <UserCog className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Detalles del usuario</h2>
            <p className="text-xs text-gray-400">Información del registro seleccionado.</p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">ID</p>
            <p className="text-sm text-gray-900">{user.id}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">Nombre completo</p>
            <input
              type="text"
              readOnly
              value={`${user.name} ${user.lastname ?? ''}`.trim()}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 bg-gray-50 outline-none cursor-default"
            />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">Correo electrónico</p>
            <input
              type="text"
              readOnly
              value={user.email}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 bg-gray-50 outline-none cursor-default"
            />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Roles</p>
            <p className="text-sm text-gray-900 break-all">{roleLabel(user.roles)}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Estado</p>
            {user.status === 'ACTIVE' ? (
              <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Activo</span>
            ) : (
              <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-500">Inactivo</span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 pb-6 pt-1">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors cursor-pointer"
          >
            Cerrar
          </button>
          {canUpdate && (
            <button
              onClick={() => onEdit(user)}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
            >
              Editar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
