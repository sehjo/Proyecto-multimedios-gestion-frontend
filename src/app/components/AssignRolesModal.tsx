import { useEffect, useMemo, useState } from 'react';
import { X, Search, Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';
import { getUsers, getUser } from '../../api/usersService';
import { getRoles, syncUserRoles } from '../../api/services';
import { useAuth } from '../../context/AuthContext';

interface UserRow {
  id: number;
  name: string;
  lastname?: string;
  email: string;
  roles: string[];   // role names (UserResource returns getRoleNames())
}

interface Role {
  id: number;
  name: string;
}

interface AssignRolesModalProps {
  onClose: () => void;
  /** Called after at least one role change succeeds: closes + shows the result. */
  onAssigned?: (message: string) => void;
}

/**
 * Assign MULTIPLE roles to a user. The backend adds/removes roles individually
 * (POST /users/{id}/roles by name, DELETE /users/{id}/roles/{roleId} by id), so
 * this is a multi-select with a diff on save.
 */
export default function AssignRolesModal({ onClose, onAssigned }: AssignRolesModalProps) {
  const { user: authUser } = useAuth();
  const [users, setUsers]         = useState<UserRow[]>([]);
  const [roles, setRoles]         = useState<Role[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);

  // Role ids selected for the user, and the ones it had on load (for the diff).
  const [selected, setSelected]   = useState<Set<number>>(new Set());
  const [initial, setInitial]     = useState<Set<number>>(new Set());
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [saving, setSaving]       = useState(false);

  useEffect(() => {
    Promise.all([
      getUsers({ perPage: 50 }).then((res) => setUsers(res.data ?? [])),
      getRoles().then((res) => setRoles(Array.isArray(res) ? res : res.data ?? [])),
    ])
      .catch(() => toast.error('Error al cargar los datos.'))
      .finally(() => setLoading(false));
  }, []);

  // Hide the logged-in user: the backend forbids changing your own roles
  // (403 SELF_ACTION_FORBIDDEN), so we don't surface the row at all.
  const visibleUsers = useMemo(() => {
    const others = users.filter((u) => u.id !== authUser?.id);
    if (!search.trim()) return others;
    const lower = search.toLowerCase();
    return others.filter(
      (u) => u.name.toLowerCase().includes(lower) || u.email.toLowerCase().includes(lower)
    );
  }, [users, search, authUser?.id]);

  const roleIdByName = useMemo(() => {
    const m = new Map<string, number>();
    roles.forEach((r) => m.set(r.name, r.id));
    return m;
  }, [roles]);

  const currentRoleLabel = (u: UserRow): string =>
    u.roles?.length ? u.roles.join(', ') : '—';

  const selectUser = async (u: UserRow) => {
    setSelectedUser(u);
    setSelected(new Set());
    setInitial(new Set());
    setLoadingRoles(true);
    try {
      // Fetch the full user. show() wraps the resource as { data: {...} }, but be
      // defensive: roles may live at res.data.roles or res.roles, and each role may
      // be a name string or a { id, name } object.
      const res: any = await getUser(u.id);
      const payload = res?.data ?? res ?? {};
      const rawRoles: any[] = payload.roles ?? u.roles ?? [];

      const ids = new Set<number>(
        rawRoles
          .map((r) => {
            if (r && typeof r === 'object') return r.id ?? roleIdByName.get(r.name);
            return roleIdByName.get(r);   // r is a name string
          })
          .filter((id): id is number => typeof id === 'number')
      );
      setSelected(new Set(ids));
      setInitial(new Set(ids));
    } catch {
      toast.error('Error al cargar los roles del usuario.');
    } finally {
      setLoadingRoles(false);
    }
  };

  const toggle = (roleId: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(roleId)) next.delete(roleId);
      else next.add(roleId);
      return next;
    });
  };

  const hasChanges = useMemo(() => {
    if (selected.size !== initial.size) return true;
    for (const id of selected) if (!initial.has(id)) return true;
    return false;
  }, [selected, initial]);

  const handleSave = async () => {
    if (!selectedUser || !hasChanges || saving) return;   // ignore double clicks

    // Send the COMPLETE final selection; the backend syncs the whole set
    // atomically (PUT /users/{id}/roles), validating the final state — no more
    // DELETE+POST dance and no 0-roles intermediate.
    const finalRoleNames = roles
      .filter((r) => selected.has(r.id))
      .map((r) => r.name);

    setSaving(true);
    try {
      await syncUserRoles(selectedUser.id, finalRoleNames);

      const msg = 'Los roles se han actualizado correctamente.';
      if (onAssigned) {
        onAssigned(msg);
      } else {
        toast.success(msg);
        onClose();
      }
    } catch (error: any) {
      // Keep the modal open; surface 422 (empty/invalid) / 409 LAST_ADMIN /
      // 403 SELF_ACTION_FORBIDDEN with the backend message.
      const data = error?.response?.data;
      toast.error(data?.message || data?.errors?.roles?.[0] || 'Error al guardar los roles.');
      // Re-sync from the server so the UI reflects what actually persisted.
      selectUser(selectedUser);
      setSaving(false);
    }
  };

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
          {/* Left: user list */}
          <div className="md:w-3/5 border-b md:border-b-0 md:border-r border-gray-100 p-5 flex flex-col min-h-0">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Seleccionar Usuario</h3>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar usuario..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="overflow-y-auto flex-1 -mx-1 px-1">
              {loading ? (
                <div className="flex items-center justify-center gap-2 text-gray-400 py-8 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" /> Cargando...
                </div>
              ) : visibleUsers.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-8">No hay usuarios.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-gray-400 uppercase">
                      <th className="text-left font-semibold px-2 py-1.5">ID</th>
                      <th className="text-left font-semibold px-2 py-1.5">Nombre</th>
                      <th className="text-right font-semibold px-2 py-1.5">Roles actuales</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleUsers.map((u) => (
                      <tr
                        key={u.id}
                        onClick={() => selectUser(u)}
                        className={`cursor-pointer transition-colors ${
                          selectedUser?.id === u.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                        }`}
                      >
                        <td className="px-2 py-2 text-gray-500 align-top">{u.id}</td>
                        <td className="px-2 py-2">
                          <div className="text-gray-900 font-medium">
                            {u.name}{u.lastname ? ` ${u.lastname}` : ''}
                          </div>
                          <div className="text-xs text-gray-400">{u.email}</div>
                        </td>
                        <td className="px-2 py-2 text-right">
                          <span className="text-xs text-blue-600 font-medium">{currentRoleLabel(u)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Right: role checkboxes (multi-select) */}
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
                    // Block unchecking the last remaining role (backend: LAST_ROLE).
                    const isLastSelected = checked && selected.size === 1;
                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => !isLastSelected && toggle(role.id)}
                        disabled={isLastSelected}
                        title={isLastSelected ? 'El usuario debe conservar al menos un rol.' : undefined}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition-colors ${
                          isLastSelected ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'
                        } ${
                          checked
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <span
                          className={`flex flex-shrink-0 items-center justify-center w-5 h-5 rounded border transition-colors ${
                            checked ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'
                          }`}
                        >
                          {checked && <Check className="w-3.5 h-3.5 text-white" />}
                        </span>
                        {/* min-w-0 + break-all lets a very long role name with no
                            spaces wrap instead of overflowing the button. */}
                        <span className="min-w-0 flex-1 break-all text-sm font-medium text-gray-700">{role.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
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
            onClick={handleSave}
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
