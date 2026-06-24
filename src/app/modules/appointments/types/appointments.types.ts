import type { MOCK_DOCTORS, MOCK_PATIENTS, AppointmentStatus } from '@/api/mockData';

export type { AppointmentStatus };

export type Doctor = (typeof MOCK_DOCTORS)[number];
export type Patient = (typeof MOCK_PATIENTS)[number];

export interface Appointment {
  id: number;
  patient_id: number;
  doctor_id: number;
  specialty: string;
  appointment_date: string;
  appointment_time: string;
  status: AppointmentStatus;
  notes: string;
  cancellation_reason?: string;
  attended_at?: string;
}

export type EnrichedAppointment = Appointment & {
  patient_name: string;
  doctor_name: string;
};

export interface AppointmentFormData {
  patient_id: string;
  doctor_id: string;
  specialty: string;
  appointment_date: string;
  appointment_time: string;
  notes: string;
}
