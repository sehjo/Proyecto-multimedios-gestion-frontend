import type { AppointmentRecord } from '../types/appointmentsReport.types';

const MOCK_APPOINTMENTS: AppointmentRecord[] = [
  { id: 'CIT-001', patient: 'Juan Pérez Mora',       doctor: 'Dr. Carlos Méndez',   specialty: 'Medicina General', date: '01/06/2026', time: '08:00', status: 'attended'  },
  { id: 'CIT-002', patient: 'María Castro López',    doctor: 'Dra. María Jiménez',  specialty: 'Pediatría',        date: '01/06/2026', time: '09:30', status: 'attended'  },
  { id: 'CIT-003', patient: 'Roberto Arias Vega',    doctor: 'Dr. Luis Herrera',    specialty: 'Ortopedia',        date: '02/06/2026', time: '10:00', status: 'pending'   },
  { id: 'CIT-004', patient: 'Laura Solís Quesada',   doctor: 'Dra. Ana Rodríguez',  specialty: 'Cardiología',      date: '02/06/2026', time: '11:00', status: 'cancelled' },
  { id: 'CIT-005', patient: 'Diego Mora Blanco',     doctor: 'Dr. Carlos Méndez',   specialty: 'Medicina General', date: '03/06/2026', time: '08:30', status: 'attended'  },
  { id: 'CIT-006', patient: 'Andrea Núñez Prado',    doctor: 'Dra. María Jiménez',  specialty: 'Ginecología',      date: '03/06/2026', time: '14:00', status: 'attended'  },
  { id: 'CIT-007', patient: 'Carlos Vargas Salas',   doctor: 'Dr. Luis Herrera',    specialty: 'Ortopedia',        date: '04/06/2026', time: '09:00', status: 'cancelled' },
  { id: 'CIT-008', patient: 'Sofía Brenes Araya',    doctor: 'Dra. Ana Rodríguez',  specialty: 'Cardiología',      date: '04/06/2026', time: '10:30', status: 'attended'  },
  { id: 'CIT-009', patient: 'Andrés Montoya Cruz',   doctor: 'Dr. Carlos Méndez',   specialty: 'Medicina General', date: '05/06/2026', time: '15:00', status: 'pending'   },
  { id: 'CIT-010', patient: 'Valeria Rojas Fonseca', doctor: 'Dra. María Jiménez',  specialty: 'Pediatría',        date: '06/06/2026', time: '08:00', status: 'attended'  },
];

export function getAppointments(): AppointmentRecord[] {
  return MOCK_APPOINTMENTS;
}
