import { useState, useMemo } from 'react';
import { getReportData } from '../services/doctorOccupancyReportService';
import { DEFAULT_FILTERS } from '../constants';
import type { DoctorOccupancyFilters, DoctorOccupancyTotals } from '../types/doctorOccupancyReport.types';

export function useDoctorOccupancyReport() {
  const allRows = useMemo(() => getReportData(), []);
  const [filters,         setFilters]         = useState<DoctorOccupancyFilters>(DEFAULT_FILTERS);
  const [appliedFilters,  setAppliedFilters]  = useState<DoctorOccupancyFilters>(DEFAULT_FILTERS);
  const [specialtyFilter, setSpecialtyFilter] = useState('');

  const handleGenerate = () => {
    setAppliedFilters({ ...filters });
    setSpecialtyFilter('');
  };

  const handleApplySpecialtyFilter = () => {
    setAppliedFilters(prev => ({ ...prev, specialty: specialtyFilter }));
  };

  const handleClear = () => {
    setFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
    setSpecialtyFilter('');
  };

  const filteredRows = useMemo(
    () => allRows.filter(row => !appliedFilters.specialty || row.specialtyValue === appliedFilters.specialty),
    [allRows, appliedFilters],
  );

  const totals: DoctorOccupancyTotals = useMemo(
    () => filteredRows.reduce(
      (acc, row) => ({
        assigned:  acc.assigned  + row.assigned,
        attended:  acc.attended  + row.attended,
        cancelled: acc.cancelled + row.cancelled,
      }),
      { assigned: 0, attended: 0, cancelled: 0 },
    ),
    [filteredRows],
  );

  const overallDailyAvg = filteredRows.length > 0 ? (totals.assigned / 60).toFixed(1) : '0.0';

  return {
    filters, setFilters,
    specialtyFilter, setSpecialtyFilter,
    filteredRows, totals, overallDailyAvg,
    handleGenerate, handleApplySpecialtyFilter, handleClear,
  };
}
