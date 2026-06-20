import type { AppointmentStatus, AppointmentFormData } from './types/appointments.types';

// 07:00 to 16:00 in 30-minute slots.
export const TIME_SLOTS = Array.from({ length: 19 }, (_, i) => {
  const totalMinutes = 420 + i * 30;
  const h = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
  const m = (totalMinutes % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
});

export const STATUS_CONFIG: Record<AppointmentStatus, { label: string; classes: string }> = {
  pending: { label: 'Pendiente', classes: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Confirmada', classes: 'bg-blue-100 text-blue-800' },
  cancelled: { label: 'Cancelada', classes: 'bg-red-100 text-red-800' },
  attended: { label: 'Atendida', classes: 'bg-green-100 text-green-800' },
  rescheduled: { label: 'Reprogramada', classes: 'bg-purple-100 text-purple-800' },
};

export const INITIAL_FORM: AppointmentFormData = {
  patient_id: '',
  doctor_id: '',
  specialty: '',
  appointment_date: '',
  appointment_time: '',
  notes: '',
};

export function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

export interface StatusBlock {
  kind: 'info' | 'error';
  message: string;
}

// Which status transitions are blocked for each table action, and the
// feedback to show instead of performing it. pending/confirmed allow all three.
export function getAttendBlock(status: AppointmentStatus): StatusBlock | null {
  switch (status) {
    case 'attended':
      return { kind: 'info', message: 'Esta cita ya fue marcada como atendida.' };
    case 'cancelled':
      return { kind: 'error', message: 'No se puede atender una cita cancelada.' };
    case 'rescheduled':
      return { kind: 'error', message: 'Esta cita fue reprogramada. Atienda la nueva cita.' };
    default:
      return null;
  }
}

export function getRescheduleBlock(status: AppointmentStatus): StatusBlock | null {
  switch (status) {
    case 'attended':
      return { kind: 'error', message: 'La cita ya fue atendida y no puede modificarse.' };
    case 'cancelled':
      return { kind: 'error', message: 'No se puede reprogramar una cita cancelada.' };
    case 'rescheduled':
      return { kind: 'info', message: 'Esta cita ya fue reprogramada.' };
    default:
      return null;
  }
}

export function getCancelBlock(status: AppointmentStatus): StatusBlock | null {
  switch (status) {
    case 'attended':
      return { kind: 'error', message: 'La cita ya fue atendida y no puede modificarse.' };
    case 'cancelled':
      return { kind: 'info', message: 'Esta cita ya está cancelada.' };
    case 'rescheduled':
      return { kind: 'info', message: 'Esta cita ya fue reprogramada.' };
    default:
      return null;
  }
}
