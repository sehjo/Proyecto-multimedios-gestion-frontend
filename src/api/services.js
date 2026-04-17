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

// Priorities
export const getPriorities = async (page = 1) => {
  const response = await api.get('/priorities', { params: { page } });
  return response.data;
};

export const createPriority = async (name) => {
  const response = await api.post('/priorities', { name });
  return response.data;
};

export const updatePriority = async (id, name) => {
  const response = await api.put(`/priorities/${id}`, { name });
  return response.data;
};

export const deletePriority = async (id) => {
  await api.delete(`/priorities/${id}`);
};

// Drugs
export const getDrugs = async (page = 1) => {
  const response = await api.get('/drugs', { params: { page } });
  return response.data;
};

export const createDrug = async (payload) => {
  const response = await api.post('/drugs', payload);
  return response.data;
};

export const updateDrug = async (id, payload) => {
  const response = await api.put(`/drugs/${id}`, payload);
  return response.data;
};

export const deleteDrug = async (id) => {
  await api.delete(`/drugs/${id}`);
};

// Diseases
export const getDiseases = async (page = 1) => {
  const response = await api.get('/diseases', { params: { page } });
  return response.data;
};

export const getDisease = async (id) => {
  const response = await api.get(`/diseases/${id}`);
  return response.data;
};

export const createDisease = async (payload) => {
  const response = await api.post('/diseases', payload);
  return response.data;
};

export const updateDisease = async (id, payload) => {
  const response = await api.put(`/diseases/${id}`, payload);
  return response.data;
};

export const deleteDisease = async (id) => {
  await api.delete(`/diseases/${id}`);
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

export const getDiagnosisHasTreatment = async (id) => {
  const response = await api.get(`/diagnoses-has-treatments/${id}`);
  return response.data;
};

export const createDiagnosisHasTreatment = async (payload) => {
  const response = await api.post('/diagnoses-has-treatments', payload);
  return response.data;
};

export const updateDiagnosisHasTreatment = async (id, payload) => {
  const response = await api.put(`/diagnoses-has-treatments/${id}`, payload);
  return response.data;
};

export const deleteDiagnosisHasTreatment = async (id) => {
  await api.delete(`/diagnoses-has-treatments/${id}`);
};

// Disease Has Treatments
export const getDiseaseHasTreatments = async (page = 1) => {
  const response = await api.get('/disease-has-treatments', { params: { page } });
  return response.data;
};

export const getDiseaseHasTreatment = async (id) => {
  const response = await api.get(`/disease-has-treatments/${id}`);
  return response.data;
};

export const createDiseaseHasTreatment = async (payload) => {
  const response = await api.post('/disease-has-treatments', payload);
  return response.data;
};

export const updateDiseaseHasTreatment = async (id, payload) => {
  const response = await api.put(`/disease-has-treatments/${id}`, payload);
  return response.data;
};

export const deleteDiseaseHasTreatment = async (id) => {
  await api.delete(`/disease-has-treatments/${id}`);
};