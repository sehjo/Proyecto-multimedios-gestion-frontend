import { Loader2, Check } from 'lucide-react';
import type { AssignableUser, RoleOption } from '../types/roles.types';

interface AssignRolesRolePickerProps {
  roles: RoleOption[];
  selectedUser: AssignableUser | null;
  selected: Set<number>;
  loadingRoles: boolean;
  onToggle: (roleId: number) => void;
}

// Right column of the assign-roles modal: multi-select role checkboxes for the
// chosen user. Blocks unchecking the last remaining role (backend: LAST_ROLE).
export default function AssignRolesRolePicker({
  roles,
  selectedUser,
  selected,
  loadingRoles,
  onToggle,
}: AssignRolesRolePickerProps) {
  return (
    <div className="md:w-2/5 p-5 flex flex-col min-h-0">
      <h3 className="text-sm font-semibold text-gray-800 mb-1">Configurar Roles</h3>
      <p className="text-xs text-gray-400 mb-3">
        {selectedUser
          ? `Usuario seleccionado: ${selectedUser.name}`
          : 'Selecciona un usuario para configurar sus roles'}
      </p>
      <div className="overflow-y-auto flex-1 pr-1">
        {!selectedUser ? (
          <div className="flex items-center justify-center h-full text-gray-300 text-sm py-12">
            Selecciona un usuario de la lista
          </div>
        ) : loadingRoles ? (
          <div className="flex items-center justify-center gap-2 text-gray-400 py-12 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" /> Cargando roles...
          </div>
        ) : (
          <div className="space-y-2">
            {roles.map((role) => {
              const checked = selected.has(role.id);
              const isLastSelected = checked && selected.size === 1;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => !isLastSelected && onToggle(role.id)}
                  disabled={isLastSelected}
                  title={isLastSelected ? 'El usuario debe conservar al menos un rol.' : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition-colors ${
                    isLastSelected ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'
                  } ${checked ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
                >
                  <span
                    className={`flex flex-shrink-0 items-center justify-center w-5 h-5 rounded border transition-colors ${
                      checked ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'
                    }`}
                  >
                    {checked && <Check className="w-3.5 h-3.5 text-white" />}
                  </span>
                  {/* min-w-0 + break-all lets a very long role name wrap instead of overflowing. */}
                  <span className="min-w-0 flex-1 break-all text-sm font-medium text-gray-700">
                    {role.name}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
