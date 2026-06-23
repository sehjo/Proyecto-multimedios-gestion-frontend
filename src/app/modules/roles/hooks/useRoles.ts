import { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/app/modules/auth';
import { buildPermissionGrid, PermissionRow } from '../../../lib/permissions';
import { getRoles, getPermissions, deleteRole } from '../services/rolesService';
import type { Role, Banner } from '../types/roles.types';

// Owns the roles list: loading, search, the permission catalog/grid, deletes and
// the inline result banner. Keeps the data/CRUD concerns out of the page.
export function useRoles() {
  const { can } = useAuth();

  // Permission gate (UX only; the backend enforces each endpoint).
  const canView = can('roles.read');

  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [banner, setBanner] = useState<Banner | null>(null);
  const [confirming, setConfirming] = useState(false);

  const showBanner = useCallback((msg: string, type: Banner['type'] = 'success') => {
    const next: Banner = { type, msg };
    setBanner(next);
    window.setTimeout(() => setBanner((b) => (b === next ? null : b)), 5000);
  }, []);

  const dismissBanner = useCallback(() => setBanner(null), []);

  const loadRoles = useCallback(async () => {
    // Don't hit the endpoint without permission (avoids a guaranteed 403).
    if (!canView) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      setRoles(await getRoles());
    } catch {
      toast.error('Error al cargar los roles.');
    } finally {
      setLoading(false);
    }
  }, [canView]);

  useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  // Permission catalog (for the grid). Failure leaves an empty grid, not an error.
  useEffect(() => {
    if (!canView) return;
    getPermissions()
      .then(setPermissions)
      .catch(() => setPermissions([]));
  }, [canView]);

  // Grid rows derived from the flat catalog (modules × actions).
  const grid: PermissionRow[] = useMemo(() => buildPermissionGrid(permissions), [permissions]);

  // Client-side search (the role list is small).
  const visibleRoles = useMemo(() => {
    const lower = search.trim().toLowerCase();
    if (!lower) return roles;
    return roles.filter((r) => r.name.toLowerCase().includes(lower));
  }, [roles, search]);

  // Delete a role. Owns its own loading flag (confirming) and returns true on
  // success so the caller can close the confirmation modal.
  const removeRole = useCallback(
    async (role: Role): Promise<boolean> => {
      if (confirming) return false; // ignore rapid double clicks
      setConfirming(true);
      try {
        await deleteRole(role.id);
        showBanner('Se ha eliminado correctamente el registro.');
        await loadRoles();
        return true;
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'No se pudo eliminar el rol.');
        return false;
      } finally {
        setConfirming(false);
      }
    },
    [confirming, showBanner, loadRoles]
  );

  return {
    canView,
    roles,
    permissions,
    grid,
    loading,
    search,
    setSearch,
    visibleRoles,
    banner,
    showBanner,
    dismissBanner,
    loadRoles,
    removeRole,
    confirming,
  };
}
