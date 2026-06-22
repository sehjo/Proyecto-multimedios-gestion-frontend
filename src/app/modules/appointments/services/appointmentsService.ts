import { MOCK_APPOINTMENTS, MOCK_DOCTORS, MOCK_PATIENTS } from '@/api/mockData';
import type { Appointment, Doctor, Patient } from '../types/appointments.types';

// Mock-backed today; swap the bodies for axios calls once /appointments lands
// for real (see src/api/services.js getAppointments/createAppointment stubs).
export function getAppointments(): Appointment[] {
  return MOCK_APPOINTMENTS;
}

export function getPatients(): Patient[] {
  return MOCK_PATIENTS;
}

export function getDoctors(): Doctor[] {
  return MOCK_DOCTORS;
}

export function bookedSlotsForDoctor(
  appointments: Appointment[],
  doctorId: number,
  date: string,
  excludeId?: number
): string[] {
  return appointments
    .filter(
      (a) =>
        a.doctor_id === doctorId &&
        a.appointment_date === date &&
        a.status !== 'cancelled' &&
        a.status !== 'rescheduled' &&
        a.id !== excludeId
    )
    .map((a) => a.appointment_time.substring(0, 5));
}
