import { useState, useMemo } from 'react';
import { getReportData } from '../services/patientsReportService';
import { DEFAULT_FILTERS, DOCTOR_OPTIONS, SPECIALTY_OPTIONS } from '../constants';
import type { PatientsReportFilters, ReportTotals } from '../types/patientsReport.types';

export function usePatientsReport() {
  const allRows = useMemo(() => getReportData(), []);
  const [filters, setFilters] = useState<PatientsReportFilters>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<PatientsReportFilters>(DEFAULT_FILTERS);

  const handleGenerate = () => setAppliedFilters({ ...filters });

  const handleClear = () => {
    setFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
  };

  const filteredRows = useMemo(() => {
    return allRows.filter((row) => {
      if (appliedFilters.doctor) {
        const name = DOCTOR_OPTIONS.find((d) => d.value === appliedFilters.doctor)?.label ?? '';
        if (row.doctor !== name) return false;
      }
      if (appliedFilters.specialty) {
        const name = SPECIALTY_OPTIONS.find((s) => s.value === appliedFilters.specialty)?.label ?? '';
        if (row.specialty !== name) return false;
      }
      return true;
    });
  }, [allRows, appliedFilters]);

  const totals: ReportTotals = useMemo(
    () =>
      filteredRows.reduce(
        (acc, row) => ({
          uniquePatients:    acc.uniquePatients    + row.uniquePatients,
          consultations:     acc.consultations     + row.consultations,
          newPatients:       acc.newPatients       + row.newPatients,
          recurringPatients: acc.recurringPatients + row.recurringPatients,
        }),
        { uniquePatients: 0, consultations: 0, newPatients: 0, recurringPatients: 0 },
      ),
    [filteredRows],
  );

  return { filters, setFilters, filteredRows, totals, handleGenerate, handleClear };
}
