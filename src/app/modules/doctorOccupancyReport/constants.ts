import type { DoctorOccupancyFilters } from './types/doctorOccupancyReport.types';

export const SPECIALTY_OPTIONS = [
  { value: '',  label: 'Todas las especialidades' },
  { value: '1', label: 'Medicina General' },
  { value: '2', label: 'Cardiología' },
  { value: '3', label: 'Pediatría' },
  { value: '4', label: 'Ortopedia' },
  { value: '5', label: 'Ginecología' },
];

export const DEFAULT_FILTERS: DoctorOccupancyFilters = {
  dateFrom: '2026-04-10',
  dateTo:   '2026-06-09',
  specialty: '',
};
