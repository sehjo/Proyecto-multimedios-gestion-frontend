import api from '@/api/client';
import type { Role, AssignableUser } from '../types/roles.types';

// GET /roles → RoleResource collection (a plain array, no { data } wrapper).
export const getRoles = async (): Promise<Role[]> => {
  const response = await api.get('/roles');
  return Array.isArray(response.data) ? response.data : response.data?.data ?? [];
};

// POST /roles → create a role. payload: { name, permissions: [names] }.
export const createRole = async (payload: { name: string; permissions: string[] }) => {
  const response = await api.post('/roles', payload);
  return response.data;
};

// PUT /roles/{id} → update only the changed fields. PUT on your own role returns
// 403 SELF_ACTION_FORBIDDEN (the page guards against that).
export const updateRole = async (
  id: number,
  payload: { name?: string; permissions?: string[] }
) => {
  const response = await api.put(`/roles/${id}`, payload);
  return response.data;
};

// DELETE /roles/{id}. Protected (system) roles cannot be deleted.
export const deleteRole = async (id: number) => {
  const response = await api.delete(`/roles/${id}`);
  return response.data;
};

// Read-only permission catalog used to build the grid.
// GET /roles/permissions → { success, data: [<module>.<action> names] }.
export const getPermissions = async (): Promise<string[]> => {
  const response = await api.get('/roles/permissions');
  return response.data?.data ?? [];
};

// ─── Users (for the assign-roles modal) ─────────────────────────────────────────

interface PaginatedUsers {
  data: AssignableUser[];
  meta?: { last_page?: number };
}

// Walk every page of GET /users to get the full list (the role-assignment modal
// needs all users; search/pagination run client-side for the small user base).
export const getAllUsers = async (): Promise<AssignableUser[]> => {
  const first = (await api.get('/users', { params: { page: 1 } })).data as PaginatedUsers;
  const lastPage = first?.meta?.last_page ?? 1;
  let data = first?.data ?? [];
  for (let page = 2; page <= lastPage; page++) {
    const res = (await api.get('/users', { params: { page } })).data as PaginatedUsers;
    data = data.concat(res?.data ?? []);
  }
  return data;
};

// GET /users/{id} → the full user (used to read its current roles on selection).
export const getUser = async (id: number) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

// Replace the user's WHOLE role set atomically, validating the final state in a
// single call. PUT /users/{id}/roles { roles: [user_type_id, ...] } — the backend
// expects role IDS (not names); the first id becomes the primary role.
// Errors: 422 (empty/invalid), 409 LAST_ADMIN, 403 SELF_ACTION_FORBIDDEN.
export const syncUserRoles = async (userId: number, roleIds: number[]) => {
  const response = await api.put(`/users/${userId}/roles`, { roles: roleIds });
  return response.data;
};
