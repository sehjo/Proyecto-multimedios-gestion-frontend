import { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/app/modules/auth';
import { useActivity } from '../../../../context/ActivityContext';
import { getAllUsers, getRoles, changeUserStatus } from '../services/usersService';
import type { User, Role, Banner } from '../types/users.types';

const PER_PAGE = 15;

// Owns the users list: loading, search, pagination, status changes and the
// inline result banner. Keeps the data/CRUD concerns out of the page.
export function useUsers() {
  const { user: authUser, can } = useAuth();
  const { logActivity } = useActivity();

  // Permission gate (UX only; the backend enforces each endpoint).
  const canView = can('users.read');

  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [banner, setBanner] = useState<Banner | null>(null);
  const [confirming, setConfirming] = useState(false);

  const showBanner = useCallback((msg: string, type: Banner['type'] = 'success') => {
    const next: Banner = { type, msg };
    setBanner(next);
    window.setTimeout(() => setBanner((b) => (b === next ? null : b)), 5000);
  }, []);

  const dismissBanner = useCallback(() => setBanner(null), []);

  const loadData = useCallback(async () => {
    // Don't hit the endpoint without permission (avoids a guaranteed 403).
    if (!canView) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const [usersData, rolesData] = await Promise.all([
        getAllUsers().catch(() => ({ data: [] as User[] })),
        getRoles().catch(() => [] as Role[]),
      ]);
      setUsers(usersData.data || []);
      setRoles(rolesData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  }, [canView]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Search across the whole user base; hide the logged-in user (the backend
  // forbids self-modification, so the row is never shown).
  const filteredUsers = useMemo(() => {
    const lower = searchTerm.trim().toLowerCase();
    return users
      .filter((user) => user.id !== authUser?.id)
      .filter(
        (user) =>
          !lower ||
          user.name?.toLowerCase().includes(lower) ||
          user.lastname?.toLowerCase().includes(lower) ||
          user.email?.toLowerCase().includes(lower)
      );
  }, [users, searchTerm, authUser?.id]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PER_PAGE));

  // Reset to page 1 when the search changes; clamp if the list shrank.
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pagedUsers = useMemo(
    () => filteredUsers.slice((page - 1) * PER_PAGE, page * PER_PAGE),
    [filteredUsers, page]
  );

  // Toggle ACTIVE/INACTIVE. Owns its own loading flag (confirming) and returns
  // true on success so the caller can close the confirmation modal.
  const changeStatus = useCallback(
    async (user: User): Promise<boolean> => {
      if (confirming) return false; // ignore rapid double clicks
      const isActive = user.status === 'ACTIVE';
      const newStatus = isActive ? 'INACTIVE' : 'ACTIVE';
      setConfirming(true);
      try {
        await changeUserStatus(user.id, newStatus);
        logActivity({
          type: isActive ? 'Usuario desactivado' : 'Usuario activado',
          name: `${user.name} ${user.lastname}`,
        });
        showBanner(`Usuario ${isActive ? 'desactivado' : 'activado'} exitosamente.`);
        await loadData();
        return true;
      } catch (error: any) {
        console.error('Error changing user status:', error);
        // Surface backend messages for SELF_ACTION_FORBIDDEN / LAST_ADMIN, etc.
        toast.error(error?.response?.data?.message || 'Error al cambiar el estado del usuario');
        return false;
      } finally {
        setConfirming(false);
      }
    },
    [confirming, logActivity, showBanner, loadData]
  );

  return {
    canView,
    users,
    roles,
    loading,
    searchTerm,
    setSearchTerm,
    page,
    setPage,
    totalPages,
    filteredUsers,
    pagedUsers,
    banner,
    showBanner,
    dismissBanner,
    loadData,
    changeStatus,
    confirming,
  };
}
