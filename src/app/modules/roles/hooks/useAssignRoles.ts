import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/app/modules/auth';
import { getAllUsers, getUser, getRoles, syncUserRoles } from '../services/rolesService';
import type { AssignableUser, RoleOption } from '../types/roles.types';

// Owns the assign-roles-to-user modal: loads users + roles, tracks the selected
// user and its role set (with a diff for save), and persists via syncUserRoles.
// onAssigned closes the modal and shows the result banner on the page.
export function useAssignRoles(onAssigned: (msg: string) => void) {
  const { user: authUser } = useAuth();

  const [users, setUsers] = useState<AssignableUser[]>([]);
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<AssignableUser | null>(null);

  // Guards a race: clicking another user before getUser() resolves would let the
  // late response overwrite the current selection. Each selectUser bumps the token
  // and bails if it's no longer the latest after the await.
  const selectionToken = useRef(0);

  // Role ids selected for the user, and the ones it had on load (for the diff).
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [initial, setInitial] = useState<Set<number>>(new Set());
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      getAllUsers().then(setUsers),
      getRoles().then((rs) => setRoles(rs.map((r) => ({ id: r.id, name: r.name })))),
    ])
      .catch(() => toast.error('Error al cargar los datos.'))
      .finally(() => setLoading(false));
  }, []);

  // Hide the logged-in user: the backend forbids changing your own roles
  // (403 SELF_ACTION_FORBIDDEN), so we don't surface the row at all.
  const visibleUsers = useMemo(() => {
    const others = users.filter((u) => u.id !== authUser?.id);
    const lower = search.trim().toLowerCase();
    if (!lower) return others;
    return others.filter(
      (u) => u.name.toLowerCase().includes(lower) || u.email.toLowerCase().includes(lower)
    );
  }, [users, search, authUser?.id]);

  const roleIdByName = useMemo(() => {
    const m = new Map<string, number>();
    roles.forEach((r) => m.set(r.name, r.id));
    return m;
  }, [roles]);

  const selectUser = useCallback(
    async (u: AssignableUser) => {
      const token = ++selectionToken.current; // mark this as the latest selection
      setSelectedUser(u);
      setSelected(new Set());
      setInitial(new Set());
      setLoadingRoles(true);
      try {
        // Fetch the full user. This backend returns it PLAIN (no { data } wrapper)
        // on show, but be defensive: roles may live at res.data.roles or res.roles,
        // and each role may be a name string or a { id, name } object.
        const res: any = await getUser(u.id);
        if (token !== selectionToken.current) return; // a newer click won; discard
        const payload = res?.data ?? res ?? {};
        const rawRoles: any[] = payload.roles ?? u.roles ?? [];

        const ids = new Set<number>(
          rawRoles
            .map((r) => {
              if (r && typeof r === 'object') return r.id ?? roleIdByName.get(r.name);
              return roleIdByName.get(r); // r is a name string
            })
            .filter((id): id is number => typeof id === 'number')
        );
        setSelected(new Set(ids));
        setInitial(new Set(ids));
      } catch {
        if (token === selectionToken.current) toast.error('Error al cargar los roles del usuario.');
      } finally {
        if (token === selectionToken.current) setLoadingRoles(false);
      }
    },
    [roleIdByName]
  );

  const toggleRole = (roleId: number) => {
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

  const save = async () => {
    if (!selectedUser || !hasChanges || saving) return; // ignore double clicks

    // Send the COMPLETE final selection; the backend syncs the whole set
    // atomically (PUT /users/{id}/roles), validating the final state.
    const finalRoleNames = roles.filter((r) => selected.has(r.id)).map((r) => r.name);

    setSaving(true);
    try {
      await syncUserRoles(selectedUser.id, finalRoleNames);
      onAssigned('Los roles se han actualizado correctamente.');
    } catch (error: any) {
      // Keep the modal open; surface 422 / 409 LAST_ADMIN / 403 SELF_ACTION_FORBIDDEN.
      const data = error?.response?.data;
      toast.error(data?.message || data?.errors?.roles?.[0] || 'Error al guardar los roles.');
      // Re-sync from the server so the UI reflects what actually persisted.
      selectUser(selectedUser);
      setSaving(false);
    }
  };

  return {
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
  };
}
