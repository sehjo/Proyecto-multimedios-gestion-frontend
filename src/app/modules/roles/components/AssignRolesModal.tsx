import { X, Loader2 } from 'lucide-react';
import { useAssignRoles } from '../hooks/useAssignRoles';
import AssignRolesUserList from './AssignRolesUserList';
import AssignRolesRolePicker from './AssignRolesRolePicker';

interface AssignRolesModalProps {
  onClose: () => void;
  // Called after the role set is saved: closes + shows the result on the page.
  onAssigned: (message: string) => void;
}

/**
 * Assign MULTIPLE roles to a user. The backend syncs the whole set atomically
 * (PUT /users/{id}/roles), so this is a multi-select with a diff on save. All
 * logic lives in useAssignRoles; this composes the two columns and the footer.
 */
export default function AssignRolesModal({ onClose, onAssigned }: AssignRolesModalProps) {
  const {
    roles,
    loading,
    search,
    setSearch,
    visibleUsers,
    selectedUser,
    selected,
    loadingRoles,
    saving,
    hasChanges,
    selectUser,
    toggleRole,
    save,
  } = useAssignRoles(onAssigned);

  return (
    <div className="app-modal-overlay fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Asignar Roles a Usuario</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body: two columns */}
        <div className="flex flex-1 min-h-0 flex-col md:flex-row">
          <AssignRolesUserList
            users={visibleUsers}
            loading={loading}
            search={search}
            selectedUserId={selectedUser?.id}
            onSearchChange={setSearch}
            onSelect={selectUser}
          />
          <AssignRolesRolePicker
            roles={roles}
            selectedUser={selectedUser}
            selected={selected}
            loadingRoles={loadingRoles}
            onToggle={toggleRole}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={save}
            disabled={!selectedUser || !hasChanges || saving}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}
