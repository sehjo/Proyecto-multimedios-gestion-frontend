import { useMemo, useState } from 'react';
import { getPatients } from '../services/medicalHistoryService';

// Owns the patients list search for the medical history landing page.
export function useMedicalHistoryPatients() {
  const [searchTerm, setSearchTerm] = useState('');
  const patients = useMemo(() => getPatients(), []);

  const filteredPatients = useMemo(() => {
    const lower = searchTerm.toLowerCase();
    return patients.filter(
      (p) =>
        (p.name ?? '').toLowerCase().includes(lower) ||
        (p.lastname ?? '').toLowerCase().includes(lower) ||
        (p.nick ?? '').toLowerCase().includes(lower) ||
        String(p.id).includes(lower)
    );
  }, [patients, searchTerm]);

  return { searchTerm, setSearchTerm, filteredPatients };
}
