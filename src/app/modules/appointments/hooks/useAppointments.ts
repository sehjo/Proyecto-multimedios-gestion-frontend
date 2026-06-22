import { useMemo, useState } from 'react';
import { getAppointments, getDoctors, getPatients } from '../services/appointmentsService';
import type { Appointment, AppointmentStatus, EnrichedAppointment } from '../types/appointments.types';

// Owns the appointments list: seed data, doctor/patient lookups, filters and
// the mutations every modal hook eventually calls back into.
export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>(getAppointments());
  const patients = getPatients();
  const doctors = getDoctors();

  const [filterDoctor, setFilterDoctor] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const hasActiveFilters = filterDoctor !== '' || filterDate !== '' || filterStatus !== '';

  const clearFilters = () => {
    setFilterDoctor('');
    setFilterDate('');
    setFilterStatus('');
  };

  const enrichedAppointments = useMemo<EnrichedAppointment[]>(
    () =>
      appointments.map((appt) => {
        const patient = patients.find((p) => p.id === appt.patient_id);
        const doctor = doctors.find((d) => d.id === appt.doctor_id);
        return {
          ...appt,
          patient_name: patient ? `${patient.name} ${patient.lastname}` : '-',
          doctor_name: doctor ? `${doctor.name} ${doctor.lastname}` : '-',
        };
      }),
    [appointments, patients, doctors]
  );

  const filteredAppointments = useMemo(
    () =>
      enrichedAppointments.filter((a) => {
        if (filterDoctor && String(a.doctor_id) !== filterDoctor) return false;
        if (filterDate && a.appointment_date !== filterDate) return false;
        if (filterStatus && a.status !== filterStatus) return false;
        return true;
      }),
    [enrichedAppointments, filterDoctor, filterDate, filterStatus]
  );

  const addAppointment = (appt: Appointment) => {
    setAppointments((prev) => [...prev, appt]);
  };

  const markAttended = (id: number, attendedAt: string) => {
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: 'attended' as AppointmentStatus, attended_at: attendedAt } : a
      )
    );
  };

  const markCancelled = (id: number, reason: string) => {
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: 'cancelled' as AppointmentStatus, cancellation_reason: reason } : a
      )
    );
  };

  const markRescheduled = (id: number, newAppt: Appointment) => {
    setAppointments((prev) =>
      prev
        .map((a) => (a.id === id ? { ...a, status: 'rescheduled' as AppointmentStatus } : a))
        .concat(newAppt)
    );
  };

  return {
    appointments,
    patients,
    doctors,
    filterDoctor,
    setFilterDoctor,
    filterDate,
    setFilterDate,
    filterStatus,
    setFilterStatus,
    hasActiveFilters,
    clearFilters,
    enrichedAppointments,
    filteredAppointments,
    addAppointment,
    markAttended,
    markCancelled,
    markRescheduled,
  };
}
