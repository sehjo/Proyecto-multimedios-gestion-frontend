import type { PatientsReportFilters } from './types/patientsReport.types';

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

export const DEFAULT_FILTERS: PatientsReportFilters = {
  dateFrom: '2026-06-01',
  dateTo: '2026-06-07',
  doctor: '',
  specialty: '',
};
