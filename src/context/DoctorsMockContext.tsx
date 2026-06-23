/**
 * POC in-memory data for the Doctors/Specialities module (no backend yet).
 * Mirrors the shape `doctorsService`/`specialitiesService` expect from the
 * real API, so swapping back to the live endpoints later only means pointing
 * the module's hooks back at those services instead of this context.
 */
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Doctor, Speciality } from '../app/modules/doctors/types/doctors.types';

export interface DoctorPayload {
  identifier: string;
  name: string;
  email: string;
  speciality_ids: number[];
}

export interface SpecialityPayload {
  name: string;
  description?: string;
}

type DoctorsMockContextType = {
  doctors: Doctor[];
  specialities: Speciality[];
  addDoctor: (payload: DoctorPayload) => Doctor;
  editDoctor: (id: number, payload: DoctorPayload) => Doctor;
  removeDoctor: (id: number) => void;
  addSpeciality: (payload: SpecialityPayload) => Speciality;
  editSpeciality: (id: number, payload: SpecialityPayload) => Speciality;
  removeSpeciality: (id: number) => void;
};

const MOCK_SPECIALITIES: Speciality[] = [
  { id: 1, name: 'Cardiología', description: 'Enfermedades del corazón y el sistema circulatorio.' },
  { id: 2, name: 'Pediatría', description: 'Atención médica de niños y adolescentes.' },
  { id: 3, name: 'Medicina General', description: 'Atención primaria y diagnóstico general.' },
  { id: 4, name: 'Dermatología', description: 'Enfermedades de la piel.' },
  { id: 5, name: 'Neurología', description: 'Sistema nervioso central y periférico.' },
];

const byId = (specialities: Speciality[], ids: number[]): Speciality[] =>
  ids
    .map((id) => specialities.find((s) => s.id === id))
    .filter((s): s is Speciality => s != null);

const MOCK_DOCTORS: Doctor[] = [
  {
    id: 1,
    identifier: '1-1234-5678',
    name: 'Ricardo Solano',
    email: 'ricardo.solano@ccss.cr',
    specialities: byId(MOCK_SPECIALITIES, [1]),
  },
  {
    id: 2,
    identifier: '2-2345-6789',
    name: 'Elena Mora',
    email: 'elena.mora@ccss.cr',
    specialities: byId(MOCK_SPECIALITIES, [2]),
  },
  {
    id: 3,
    identifier: '3-3456-7890',
    name: 'Andrés Castro',
    email: 'andres.castro@ccss.cr',
    specialities: byId(MOCK_SPECIALITIES, [3, 4]),
  },
];

const DoctorsMockContext = createContext<DoctorsMockContextType | undefined>(undefined);

export function DoctorsMockProvider({ children }: { children: ReactNode }) {
  const [doctors, setDoctors] = useState<Doctor[]>(MOCK_DOCTORS);
  const [specialities, setSpecialities] = useState<Speciality[]>(MOCK_SPECIALITIES);
  const [nextDoctorId, setNextDoctorId] = useState(MOCK_DOCTORS.length + 1);
  const [nextSpecialityId, setNextSpecialityId] = useState(MOCK_SPECIALITIES.length + 1);

  const addDoctor = (payload: DoctorPayload): Doctor => {
    const doctor: Doctor = { id: nextDoctorId, ...payload, specialities: byId(specialities, payload.speciality_ids) };
    setDoctors((prev) => [...prev, doctor]);
    setNextDoctorId((n) => n + 1);
    return doctor;
  };

  const editDoctor = (id: number, payload: DoctorPayload): Doctor => {
    const updated: Doctor = { id, ...payload, specialities: byId(specialities, payload.speciality_ids) };
    setDoctors((prev) => prev.map((d) => (d.id === id ? updated : d)));
    return updated;
  };

  const removeDoctor = (id: number) => {
    setDoctors((prev) => prev.filter((d) => d.id !== id));
  };

  const addSpeciality = (payload: SpecialityPayload): Speciality => {
    const speciality: Speciality = { id: nextSpecialityId, name: payload.name, description: payload.description ?? '' };
    setSpecialities((prev) => [...prev, speciality]);
    setNextSpecialityId((n) => n + 1);
    return speciality;
  };

  const editSpeciality = (id: number, payload: SpecialityPayload): Speciality => {
    const updated: Speciality = { id, name: payload.name, description: payload.description ?? '' };
    setSpecialities((prev) => prev.map((s) => (s.id === id ? updated : s)));
    // Propagate the rename to doctors already carrying this speciality.
    setDoctors((prev) =>
      prev.map((d) => ({
        ...d,
        specialities: (d.specialities ?? []).map((s) => (s.id === id ? updated : s)),
      }))
    );
    return updated;
  };

  const removeSpeciality = (id: number) => {
    setSpecialities((prev) => prev.filter((s) => s.id !== id));
    // Detach the speciality from any doctor that had it assigned.
    setDoctors((prev) =>
      prev.map((d) => ({ ...d, specialities: (d.specialities ?? []).filter((s) => s.id !== id) }))
    );
  };

  const value = useMemo(
    () => ({ doctors, specialities, addDoctor, editDoctor, removeDoctor, addSpeciality, editSpeciality, removeSpeciality }),
    [doctors, specialities]
  );

  return <DoctorsMockContext.Provider value={value}>{children}</DoctorsMockContext.Provider>;
}

export function useDoctorsMock() {
  const ctx = useContext(DoctorsMockContext);
  if (!ctx) throw new Error('useDoctorsMock must be used within a DoctorsMockProvider');
  return ctx;
}
