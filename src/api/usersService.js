import api from './api';

// ─── Users ────────────────────────────────────────────────────────────────────

export const getUsers = async ({ page = 1, perPage = 15, role, status, name, email } = {}) => {
  const params = { page, per_page: perPage };
  if (role)   params.role   = role;
  if (status) params.status = status;
  if (name)   params.name   = name;
  if (email)  params.email  = email;
  const response = await api.get('/users', { params });
  return response.data;
};

export const getUser = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

// Fetch ALL users by walking every page. Needed where the full list matters
// (role-assignment modal): the backend caps the page size, so a single call
// would miss users beyond the first page.
export const getAllUsers = async (filters = {}) => {
  const first = await getUsers({ ...filters, page: 1 });
  const lastPage = first?.meta?.last_page ?? 1;
  let data = first?.data ?? [];
  for (let page = 2; page <= lastPage; page++) {
    const res = await getUsers({ ...filters, page });
    data = data.concat(res?.data ?? []);
  }
  return { ...first, data };
};

// Admin creates user: {name, email, role} — backend generates temp password and sends it by email
export const createUser = async (payload) => {
  const response = await api.post('/users', payload);
  return response.data;
};

// Update: {name?, email?, role?} — all optional
export const updateUser = async (id, payload) => {
  const response = await api.put(`/users/${id}`, payload);
  return response.data;
};

// Change status: {status: 'ACTIVE' | 'INACTIVE'}
export const changeUserStatus = async (id, status) => {
  const response = await api.patch(`/users/${id}/status`, { status });
  return response.data;
};
