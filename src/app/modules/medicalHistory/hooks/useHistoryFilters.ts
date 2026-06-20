import { useMemo, useState } from 'react';
import type { HistoryEntry } from '../types/medicalHistory.types';

// Owns the timeline filters (date range, doctor, diagnosis) for a patient's history.
export function useHistoryFilters(entries: HistoryEntry[], getDoctorName: (doctorId: number) => string) {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [doctorSearch, setDoctorSearch] = useState('');
  const [diagnosisSearch, setDiagnosisSearch] = useState('');

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const entryDate = new Date(entry.consultation_date);
      if (dateFrom) {
        const from = new Date(dateFrom);
        from.setHours(0, 0, 0, 0);
        if (entryDate < from) return false;
      }
      if (dateTo) {
        const to = new Date(dateTo);
        to.setHours(23, 59, 59, 999);
        if (entryDate > to) return false;
      }
      if (
        doctorSearch.trim() &&
        !getDoctorName(entry.doctor_id).toLowerCase().includes(doctorSearch.trim().toLowerCase())
      ) {
        return false;
      }
      if (
        diagnosisSearch.trim() &&
        !entry.diagnosis.toLowerCase().includes(diagnosisSearch.trim().toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [entries, dateFrom, dateTo, doctorSearch, diagnosisSearch, getDoctorName]);

  return {
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    doctorSearch,
    setDoctorSearch,
    diagnosisSearch,
    setDiagnosisSearch,
    filteredEntries,
  };
}
