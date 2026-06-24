import { useState, useMemo, useCallback } from 'react';
import { useDoctorsMock } from '@/context/DoctorsMockContext';
import type { Speciality, Banner } from '../types/doctors.types';

// Owns the specialities catalog: search and deletion. Shared by the doctor
// form's speciality picker and the nested specialities manager modal. Data
// comes from DoctorsMockContext (POC, no backend yet) — swap this for the
// real getSpecialities()/deleteSpeciality() services once the API is ready.
export function useSpecialities() {
  const { specialities, removeSpeciality: removeSpecialityMock } = useDoctorsMock();

  const [search, setSearch] = useState('');
  const [banner, setBanner] = useState<Banner | null>(null);
  const [confirming, setConfirming] = useState(false);

  const showBanner = useCallback((msg: string, type: Banner['type'] = 'success') => {
    const next: Banner = { type, msg };
    setBanner(next);
    window.setTimeout(() => setBanner((b) => (b === next ? null : b)), 5000);
  }, []);

  const dismissBanner = useCallback(() => setBanner(null), []);

  // No-op: the mock context already holds the catalog reactively. Kept so
  // callers' "refresh after save" calls don't need to change for the real API.
  const loadSpecialities = useCallback(async () => {}, []);

  const visibleSpecialities = useMemo(() => {
    const lower = search.trim().toLowerCase();
    if (!lower) return specialities;
    return specialities.filter((s) => s.name.toLowerCase().includes(lower));
  }, [specialities, search]);

  const removeSpeciality = useCallback(
    async (speciality: Speciality): Promise<boolean> => {
      if (confirming) return false; // ignore rapid double clicks
      setConfirming(true);
      try {
        removeSpecialityMock(speciality.id);
        showBanner('Se ha eliminado correctamente el registro.');
        return true;
      } finally {
        setConfirming(false);
      }
    },
    [confirming, showBanner, removeSpecialityMock]
  );

  return {
    specialities,
    loading: false,
    search,
    setSearch,
    visibleSpecialities,
    banner,
    showBanner,
    dismissBanner,
    loadSpecialities,
    removeSpeciality,
    confirming,
  };
}
