import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export type Specialty = {
  id: number;
  name: string;
};

type SpecialtiesContextType = {
  specialties: Specialty[];
  addSpecialty: (name: string) => void;
  updateSpecialty: (id: number, name: string) => void;
  deleteSpecialty: (id: number) => void;
};

// TODO: replace with API calls (getSpecialties, createSpecialty, etc.) once the endpoint exists
const MOCK_SPECIALTIES: Specialty[] = [
  { id: 1, name: 'Cardiología' },
  { id: 2, name: 'Pediatría' },
  { id: 3, name: 'Medicina General' },
  { id: 4, name: 'Dermatología' },
  { id: 5, name: 'Neurología' },
];

const SpecialtiesContext = createContext<SpecialtiesContextType | undefined>(undefined);

export function SpecialtiesProvider({ children }: { children: ReactNode }) {
  const [specialties, setSpecialties] = useState<Specialty[]>(MOCK_SPECIALTIES);
  const [nextId, setNextId] = useState(MOCK_SPECIALTIES.length + 1);

  const addSpecialty = (name: string) => {
    setSpecialties((prev) => [...prev, { id: nextId, name }]);
    setNextId((n) => n + 1);
  };

  const updateSpecialty = (id: number, name: string) => {
    setSpecialties((prev) => prev.map((s) => (s.id === id ? { ...s, name } : s)));
  };

  const deleteSpecialty = (id: number) => {
    setSpecialties((prev) => prev.filter((s) => s.id !== id));
  };

  const value = useMemo(
    () => ({ specialties, addSpecialty, updateSpecialty, deleteSpecialty }),
    [specialties, nextId]
  );

  return <SpecialtiesContext.Provider value={value}>{children}</SpecialtiesContext.Provider>;
}

export function useSpecialties() {
  const ctx = useContext(SpecialtiesContext);
  if (!ctx) throw new Error('useSpecialties must be used within a SpecialtiesProvider');
  return ctx;
}
