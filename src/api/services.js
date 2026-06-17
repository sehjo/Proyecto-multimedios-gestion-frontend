import api from './api';

// ─── Roles ────────────────────────────────────────────────────────────────────

export const getRoles = async () => {
  const response = await api.get('/roles');
  return response.data;
};

export const createRole = async (payload) => {
  // payload: { name, permissions: [ids] }
  const response = await api.post('/roles', payload);
  return response.data;
};

export const updateRole = async (id, payload) => {
  // payload: { name?, permissions?: [ids] }
  const response = await api.put(`/roles/${id}`, payload);
  return response.data;
};

export const deleteRole = async (id) => {
  const response = await api.delete(`/roles/${id}`);
  return response.data;
};

// ─── Permissions ──────────────────────────────────────────────────────────────

// Read-only catalog used to build the permission grid.
// Backend: GET /roles/permissions → { success, data: [<module>.<action> names] }
export const getPermissions = async () => {
  const response = await api.get('/roles/permissions');
  return response.data;
};

// Users can hold MULTIPLE roles, added/removed individually (the old single-role
// PUT /users/{id}/role was removed → 405).

// Add a role to a user (idempotent). Backend: POST /users/{id}/roles { role: <name> }
export const assignUserRole = async (userId, roleName) => {
  const response = await api.post(`/users/${userId}/roles`, { role: roleName });
  return response.data;
};

// Remove a role from a user. Backend: DELETE /users/{id}/roles/{roleId} (role ID, not name).
export const revokeUserRole = async (userId, roleId) => {
  const response = await api.delete(`/users/${userId}/roles/${roleId}`);
  return response.data;
};

// Replace the user's WHOLE role set atomically (Spatie syncRoles), validating the
// final state in a single call — avoids the 0-roles intermediate state you'd hit
// combining DELETE+POST. Backend: PUT /users/{id}/roles { roles: [names] }.
// Errors: 422 (empty/invalid roles), 409 LAST_ADMIN, 403 SELF_ACTION_FORBIDDEN.
export const syncUserRoles = async (userId, roleNames) => {
  const response = await api.put(`/users/${userId}/roles`, { roles: roleNames });
  return response.data;
};

// Auth
export const loginUser = async (credentials) => {
  // Try the backend login endpoint; if unavailable the AuthContext handles the error
  const response = await api.post('/login', credentials);
  return response.data;
};

export const logoutUser = async () => {
  try {
    const response = await api.post('/logout');
    return response.data;
  } catch {
    // Logout is best-effort; ignore errors if the endpoint doesn't exist
  }
};

// User Types
export const getUserTypes = async (page = 1) => {
  const response = await api.get('/user-types', { params: { page } });
  return response.data;
};

export const getUserType = async (id) => {
  const response = await api.get(`/user-types/${id}`);
  return response.data;
};

export const createUserType = async (payload) => {
  const response = await api.post('/user-types', payload);
  return response.data;
};

export const updateUserType = async (id, payload) => {
  const response = await api.put(`/user-types/${id}`, payload);
  return response.data;
};

export const deleteUserType = async (id) => {
  await api.delete(`/user-types/${id}`);
};

// Users — accepts a filters object (server-side once the backend applies them).
// Builds `params` only with the keys present, so getUsers() with no args still works.
// Backend response: { data: [...], links, meta: { current_page, last_page, per_page, total } }.
export const getUsers = async ({ page = 1, perPage, name, role, status } = {}) => {
  const params = { page };
  if (perPage) params.per_page = perPage;
  if (name)    params.name     = name;
  if (role)    params.role     = role;
  if (status)  params.status   = status;
  const response = await api.get('/users', { params });
  return response.data;
};

// Fetch ALL users by walking every page (used where the full list is needed,
// e.g. the role-assignment modal). Fallback while the backend index doesn't
// filter server-side; safe for the small internal user base.
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

export const getUser = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const createUser = async (payload) => {
  const response = await api.post('/users', payload);
  return response.data;
};

export const updateUser = async (id, payload) => {
  const response = await api.put(`/users/${id}`, payload);
  return response.data;
};

export const deleteUser = async (id) => {
  await api.delete(`/users/${id}`);
};

// Activate / deactivate a user. There is NO DELETE for users (returns 405);
// the "baja" is a status change. Backend: PATCH /users/{id}/status.
export const changeUserStatus = async (id, status) => {
  const response = await api.patch(`/users/${id}/status`, { status });
  return response.data;
};

// Change only a user's role. Backend: PUT /users/{id}/role with { role: <name> }.
export const changeUserRole = async (id, roleName) => {
  const response = await api.put(`/users/${id}/role`, { role: roleName });
  return response.data;
};

// Request Password Reset
export const requestPasswordReset = async (email) => {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
};

// Reset Password
export const resetPassword = async (token, password) => {
  const response = await api.post('/auth/reset-password', { token, password });
  return response.data;
};

// Patients
export const getPatients = async (page = 1) => {
  const response = await api.get('/patients', { params: { page } });
  return response.data;
};

export const getPatient = async (id) => {
  const response = await api.get(`/patients/${id}`);
  return response.data;
};

export const createPatient = async (payload) => {
  const response = await api.post('/patients', payload);
  return response.data;
};

export const updatePatient = async (id, payload) => {
  const response = await api.put(`/patients/${id}`, payload);
  return response.data;
};

export const deletePatient = async (id) => {
  await api.delete(`/patients/${id}`);
};

