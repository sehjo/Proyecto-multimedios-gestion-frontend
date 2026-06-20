import { Loader2 } from 'lucide-react';
import editIcon from '@/assets/edit.svg';
import deleteIcon from '@/assets/delete.svg';
import { isProtectedRole } from '../constants';
import type { Role } from '../types/roles.types';

interface RolesTableProps {
  roles: Role[];
  loading: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  // Whether the logged-in user holds this role (can't edit your own → 403).
  isOwnRole: (role: Role) => boolean;
  onView: (role: Role) => void;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
}

// Roles list table: name opens the read-only details; protected roles show a
// "sistema" badge; per-row edit/delete actions respect the permission gates.
export default function RolesTable({
  roles,
  loading,
  canUpdate,
  canDelete,
  isOwnRole,
  onView,
  onEdit,
  onDelete,
}: RolesTableProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 flex items-center justify-center gap-3 text-gray-400">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">Cargando...</span>
      </div>
    );
  }

  return (
    <div className="responsive-data-table bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['ID', 'Nombre', 'Acciones'].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {roles.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-5 py-12 text-center text-gray-400 text-sm">
                  No hay roles disponibles
                </td>
              </tr>
            ) : (
              roles.map((role) => {
                // Your own role is view-only: neither edit nor delete shows (acting
                // on it would lock yourself out → 403). It also gets a "Tu rol" badge.
                // Edit needs update permission; delete needs delete permission and a
                // non-system role (protected roles can still have permissions edited
                // when they're not yours).
                const own = isOwnRole(role);
                const showEdit = canUpdate && !own;
                const showDelete = canDelete && !own && !isProtectedRole(role.name);
                return (
                  <tr key={role.id} className="hover:bg-gray-50 transition-colors">
                    <td data-label="ID" className="px-5 py-4 text-sm text-gray-500">
                      {role.id}
                    </td>
                    <td data-label="Nombre" className="role-name-cell px-5 py-4">
                      <button
                        onClick={() => onView(role)}
                        className="text-left text-sm font-medium text-blue-600 hover:underline focus:outline-none cursor-pointer"
                      >
                        {role.name}
                      </button>
                      {isProtectedRole(role.name) && (
                        <span className="role-system-badge ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                          sistema
                        </span>
                      )}
                      {own && (
                        <span className="role-own-badge ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          Tu rol
                        </span>
                      )}
                    </td>
                    <td data-label="Acciones" className="px-5 py-4">
                      {!showEdit && !showDelete ? (
                        <span className="text-sm text-gray-300">—</span>
                      ) : (
                        <div className="flex items-center gap-2">
                          {showEdit && (
                            <button
                              onClick={() => onEdit(role)}
                              title="Editar"
                              className="cursor-pointer transition-opacity hover:opacity-80"
                            >
                              <img src={editIcon} alt="Editar" className="w-9 h-9" />
                            </button>
                          )}
                          {showDelete && (
                            <button
                              onClick={() => onDelete(role)}
                              title="Eliminar"
                              className="cursor-pointer transition-opacity hover:opacity-80"
                            >
                              <img src={deleteIcon} alt="Eliminar" className="w-9 h-9" />
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
