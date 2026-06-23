import { useState, useMemo, useCallback } from 'react';
import { useActivity } from '@/context/ActivityContext';
import { useDoctorsMock } from '@/context/DoctorsMockContext';
import type { Doctor, Banner } from '../types/doctors.types';

// Owns the doctors list: search, deletion and the inline result banner. Data
// comes from DoctorsMockContext (POC, no backend yet) — swap this for the real
// getDoctors()/deleteDoctor() services once the API is ready.
export function useDoctors() {
  const { logActivity } = useActivity();
  const { doctors, removeDoctor: removeDoctorMock } = useDoctorsMock();

  const [search, setSearch] = useState('');
  const [banner, setBanner] = useState<Banner | null>(null);
  const [confirming, setConfirming] = useState(false);

  const showBanner = useCallback((msg: string, type: Banner['type'] = 'success') => {
    const next: Banner = { type, msg };
    setBanner(next);
    window.setTimeout(() => setBanner((b) => (b === next ? null : b)), 5000);
  }, []);

  const dismissBanner = useCallback(() => setBanner(null), []);

  // No-op: the mock context already holds the list reactively. Kept so the
  // page's "refresh after save" calls don't need to change when the real API lands.
  const loadDoctors = useCallback(async () => {}, []);

  const visibleDoctors = useMemo(() => {
    const lower = search.trim().toLowerCase();
    if (!lower) return doctors;
    return doctors.filter(
      (doctor) =>
        doctor.name.toLowerCase().includes(lower) ||
        doctor.identifier.toLowerCase().includes(lower) ||
        doctor.email.toLowerCase().includes(lower)
    );
  }, [doctors, search]);

  // Delete a doctor. Owns its own loading flag (confirming) and returns true
  // on success so the caller can close the confirmation modal.
  const removeDoctor = useCallback(
    async (doctor: Doctor): Promise<boolean> => {
      if (confirming) return false; // ignore rapid double clicks
      setConfirming(true);
      try {
        removeDoctorMock(doctor.id);
        logActivity({ type: 'Doctor eliminado', name: doctor.name });
        showBanner('Se ha eliminado correctamente el registro.');
        return true;
      } finally {
        setConfirming(false);
      }
    },
    [confirming, logActivity, showBanner, removeDoctorMock]
  );

  return {
    doctors,
    loading: false,
    search,
    setSearch,
    visibleDoctors,
    banner,
    showBanner,
    dismissBanner,
    loadDoctors,
    removeDoctor,
    confirming,
  };
}
