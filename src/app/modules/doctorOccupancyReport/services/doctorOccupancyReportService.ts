import type { DoctorOccupancyRow } from '../types/doctorOccupancyReport.types';

export function getReportData(): DoctorOccupancyRow[] {
  return [
    { doctor: 'Dr. Carlos Méndez',   specialty: 'Medicina General', specialtyValue: '1', assigned: 294, attended: 270, cancelled: 24, dailyAverage: 4.9 },
    { doctor: 'Dra. Ana Rodríguez',  specialty: 'Cardiología',      specialtyValue: '2', assigned: 180, attended: 162, cancelled: 18, dailyAverage: 3.0 },
    { doctor: 'Dra. María Jiménez',  specialty: 'Pediatría',        specialtyValue: '3', assigned: 210, attended: 188, cancelled: 22, dailyAverage: 3.5 },
    { doctor: 'Dr. Luis Herrera',    specialty: 'Ortopedia',        specialtyValue: '4', assigned: 156, attended: 130, cancelled: 26, dailyAverage: 2.6 },
    { doctor: 'Dra. Laura Torres',   specialty: 'Ginecología',      specialtyValue: '5', assigned: 0,   attended: 0,   cancelled: 0,  dailyAverage: 0.0 },
  ];
}
