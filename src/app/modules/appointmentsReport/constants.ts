import type { AppointmentReportFilters } from './types/appointmentsReport.types';

export const DOCTOR_OPTIONS = [
  { value: '', label: 'Todos los doctores' },
  { value: '1', label: 'Dr. Carlos Méndez' },
  { value: '2', label: 'Dra. Ana Rodríguez' },
  { value: '3', label: 'Dra. María Jiménez' },
  { value: '4', label: 'Dr. Luis Herrera' },
];

export const SPECIALTY_OPTIONS = [
  { value: '', label: 'Todas las especialidades' },
  { value: '1', label: 'Medicina General' },
  { value: '2', label: 'Cardiología' },
  { value: '3', label: 'Pediatría' },
  { value: '4', label: 'Ortopedia' },
  { value: '5', label: 'Ginecología' },
];

export const STATUS_OPTIONS = [
  { value: '', label: 'Todos los estados' },
  { value: 'attended', label: 'Atendida' },
  { value: 'cancelled', label: 'Cancelada' },
  { value: 'pending', label: 'Pendiente' },
];

export const DEFAULT_FILTERS: AppointmentReportFilters = {
  dateFrom: '2026-06-01',
  dateTo: '2026-06-07',
  doctor: '',
  specialty: '',
  status: '',
};

export const STATUS_CONFIG: Record<string, { label: string; classes: string }> = {
  attended: { label: 'Atendida',  classes: 'bg-green-100 text-green-700'  },
  cancelled: { label: 'Cancelada', classes: 'bg-red-100 text-red-700'     },
  pending:   { label: 'Pendiente', classes: 'bg-yellow-100 text-yellow-700' },
};
