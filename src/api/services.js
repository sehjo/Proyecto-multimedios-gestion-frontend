import api from './api';

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

// Users
export const getUsers = async (page = 1) => {
  const response = await api.get('/users', { params: { page } });
  return response.data;
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

// Appointments
export const getAppointments = async (params = {}) => {
  const response = await api.get('/appointments', { params });
  return response.data;
};

export const createAppointment = async (payload) => {
  const response = await api.post('/appointments', payload);
};
// Diagnoses
export const getDiagnoses = async (page = 1) => {
  const response = await api.get('/diagnoses', { params: { page } });
  return response.data;
};

export const getDiagnosis = async (id) => {
  const response = await api.get(`/diagnoses/${id}`);
  return response.data;
};

export const createDiagnosis = async (payload) => {
  const response = await api.post('/diagnoses', payload);
  return response.data;
};

export const updateDiagnosis = async (id, payload) => {
  const response = await api.put(`/diagnoses/${id}`, payload);
  return response.data;
};

export const deleteDiagnosis = async (id) => {
  await api.delete(`/diagnoses/${id}`);
};

// Diagnoses Has Treatments
export const getDiagnosesHasTreatments = async (page = 1) => {
  const response = await api.get('/diagnoses-has-treatments', { params: { page } });
  return response.data;
};

export const createDiagnosisHasTreatment = async (payload) => {
  const response = await api.post('/diagnoses-has-treatments', payload);
  return response.data;
};

export const deleteDiagnosisHasTreatment = async (id) => {
  await api.delete(`/diagnoses-has-treatments/${id}`);
};

// Diseases
export const getDiseases = async (page = 1) => {
  const response = await api.get('/diseases', { params: { page } });
  return response.data;
};

// Drugs
export const getDrugs = async (page = 1) => {
  const response = await api.get('/drugs', { params: { page } });
  return response.data;
};

