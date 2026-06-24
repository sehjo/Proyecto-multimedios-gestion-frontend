export type AppointmentStatus = 'confirmed' | 'pending' | 'cancelled' | 'in-progress' | 'blocked';
export type ViewMode = 'day' | 'week' | 'month' | 'list';

export interface Appointment {
  id: string;
  patientName: string;
  time: string;
  endTime: string;
  reason: string;
  insuranceType: string;
  duration: number;
  status: AppointmentStatus;
  doctorId: string;
  date: string;
  phone: string;
  notes: string;
  hour: number;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  branch: string;
}

export interface StatusConfigEntry {
  label: string;
  color: string;
  dot: string;
  badge: string;
}

export interface PendingDrop {
  appt: Appointment;
  date: string;
  hour: number;
}

export interface TooltipState {
  appt: Appointment;
  x: number;
  y: number;
}
