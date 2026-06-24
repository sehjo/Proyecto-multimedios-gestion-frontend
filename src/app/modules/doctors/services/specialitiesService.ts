import api from '@/api/client';
import type { Speciality } from '../types/doctors.types';

// GET /specialities → either a plain array or a paginated {data: [...]} shape;
// the catalog is small so it's always loaded in full, unpaginated.
export const getSpecialities = async (): Promise<Speciality[]> => {
  const response = await api.get('/specialities');
  return Array.isArray(response.data) ? response.data : response.data?.data ?? [];
};

export interface SpecialityPayload {
  name: string;
  description?: string;
}

export const createSpeciality = async (payload: SpecialityPayload) => {
  const response = await api.post('/specialities', payload);
  return response.data;
};

export const updateSpeciality = async (id: number, payload: SpecialityPayload) => {
  const response = await api.put(`/specialities/${id}`, payload);
  return response.data;
};

export const deleteSpeciality = async (id: number) => {
  const response = await api.delete(`/specialities/${id}`);
  return response.data;
};
