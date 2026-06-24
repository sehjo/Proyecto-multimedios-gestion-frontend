import api from '@/api/client';
import type { Doctor } from '../types/doctors.types';

// GET /doctors → either a plain array or a paginated {data: [...]} shape.
export const getDoctors = async (): Promise<Doctor[]> => {
  const response = await api.get('/doctors');
  return Array.isArray(response.data) ? response.data : response.data?.data ?? [];
};

// Payload for POST/PUT /doctors. speciality_ids syncs the doctor_specialities
// pivot on the backend (replaces the doctor's full speciality set).
export interface DoctorPayload {
  identifier: string;
  name: string;
  email: string;
  speciality_ids: number[];
}

export const createDoctor = async (payload: DoctorPayload) => {
  const response = await api.post('/doctors', payload);
  return response.data;
};

export const updateDoctor = async (id: number, payload: DoctorPayload) => {
  const response = await api.put(`/doctors/${id}`, payload);
  return response.data;
};

export const deleteDoctor = async (id: number) => {
  const response = await api.delete(`/doctors/${id}`);
  return response.data;
};
