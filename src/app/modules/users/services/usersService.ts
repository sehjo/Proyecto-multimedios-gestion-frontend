import api from '@/api/client';
import type { User, UserFormData, Role } from '../types/users.types';

interface UsersQuery {
  page?: number;
  perPage?: number;
  role?: string;
  status?: string;
  name?: string;
  email?: string;
}

interface PaginatedUsers {
  data: User[];
  meta?: { last_page?: number };
}

export const getUsers = async ({
  page = 1,
  perPage = 15,
  role,
  status,
  name,
  email,
}: UsersQuery = {}): Promise<PaginatedUsers> => {
  const params: Record<string, unknown> = { page, per_page: perPage };
  if (role) params.role = role;
  if (status) params.status = status;
  if (name) params.name = name;
  if (email) params.email = email;
  const response = await api.get('/users', { params });
  return response.data;
};

export const getUser = async (id: number): Promise<User> => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

// Fetch ALL users by walking every page. Needed where the full list matters
// (search/pagination run client-side until the backend index filters server-side).
export const getAllUsers = async (filters: UsersQuery = {}): Promise<PaginatedUsers> => {
  const first = await getUsers({ ...filters, page: 1 });
  const lastPage = first?.meta?.last_page ?? 1;
  let data = first?.data ?? [];
  for (let page = 2; page <= lastPage; page++) {
    const res = await getUsers({ ...filters, page });
    data = data.concat(res?.data ?? []);
  }
  return { ...first, data };
};

// POST /users requires the role; backend may generate a temp password.
export const createUser = async (payload: Partial<UserFormData>) => {
  const response = await api.post('/users', payload);
  return response.data;
};

// PUT /users/{id} updates profile fields only — roles are managed from the Roles tab.
export const updateUser = async (id: number, payload: Partial<UserFormData>) => {
  const response = await api.put(`/users/${id}`, payload);
  return response.data;
};

// There is no DELETE for users (405); the "baja" is a status change.
export const changeUserStatus = async (id: number, status: 'ACTIVE' | 'INACTIVE') => {
  const response = await api.patch(`/users/${id}/status`, { status });
  return response.data;
};

// Roles feed the create-form selector. GET /roles returns a RoleResource array.
export const getRoles = async (): Promise<Role[]> => {
  const response = await api.get('/roles');
  return Array.isArray(response.data) ? response.data : response.data?.data ?? [];
};
