import type { ReportRow } from '../types/patientsReport.types';

const MOCK_DATA: ReportRow[] = [
  { doctor: 'Dr. Carlos Méndez',  specialty: 'Medicina General', uniquePatients: 8, consultations: 12, newPatients: 3, recurringPatients: 5 },
  { doctor: 'Dra. Ana Rodríguez', specialty: 'Cardiología',      uniquePatients: 5, consultations: 7,  newPatients: 2, recurringPatients: 3 },
  { doctor: 'Dra. María Jiménez', specialty: 'Pediatría',        uniquePatients: 6, consultations: 9,  newPatients: 4, recurringPatients: 2 },
  { doctor: 'Dr. Luis Herrera',   specialty: 'Ortopedia',        uniquePatients: 4, consultations: 5,  newPatients: 1, recurringPatients: 3 },
  { doctor: 'Dra. María Jiménez', specialty: 'Ginecología',      uniquePatients: 3, consultations: 4,  newPatients: 2, recurringPatients: 1 },
];

export function getReportData(): ReportRow[] {
  return MOCK_DATA;
}
