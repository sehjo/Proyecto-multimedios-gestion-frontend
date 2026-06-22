import { useState, useMemo } from 'react';
import { getAppointments } from '../services/appointmentsReportService';
import { DEFAULT_FILTERS, DOCTOR_OPTIONS, SPECIALTY_OPTIONS } from '../constants';
import type { AppointmentReportFilters } from '../types/appointmentsReport.types';

export function useAppointmentsReport() {
  const appointments = useMemo(() => getAppointments(), []);
  const [filters, setFilters] = useState<AppointmentReportFilters>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<AppointmentReportFilters>(DEFAULT_FILTERS);

  const handleApply = () => setAppliedFilters({ ...filters });

  const handleClear = () => {
    setFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
  };

  const filtered = useMemo(() => {
    return appointments.filter((appt) => {
      if (appliedFilters.doctor) {
        const doctorName = DOCTOR_OPTIONS.find((d) => d.value === appliedFilters.doctor)?.label ?? '';
        if (appt.doctor !== doctorName) return false;
      }
      if (appliedFilters.specialty) {
        const specName = SPECIALTY_OPTIONS.find((s) => s.value === appliedFilters.specialty)?.label ?? '';
        if (appt.specialty !== specName) return false;
      }
      if (appliedFilters.status && appt.status !== appliedFilters.status) return false;
      return true;
    });
  }, [appointments, appliedFilters]);

  const totalCount = filtered.length;
  const attendedCount = filtered.filter((a) => a.status === 'attended').length;
  const cancelledCount = filtered.filter((a) => a.status === 'cancelled').length;
  const pendingCount = filtered.filter((a) => a.status === 'pending').length;

  return {
    filters,
    setFilters,
    filtered,
    totalCount,
    attendedCount,
    cancelledCount,
    pendingCount,
    handleApply,
    handleClear,
  };
}
