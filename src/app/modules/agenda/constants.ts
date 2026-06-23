import type { Appointment, AppointmentStatus, Doctor, StatusConfigEntry } from './types/agenda.types';

export const DOCTORS: Doctor[] = [
  { id: '1', name: 'Dra. Ana Vargas',      specialty: 'Medicina General', branch: 'Sucursal Central' },
  { id: '2', name: 'Dr. Luis Mora',         specialty: 'Cardiología',      branch: 'Sucursal Norte'   },
  { id: '3', name: 'Dra. Carmen Solís',     specialty: 'Pediatría',        branch: 'Sucursal Central' },
  { id: '4', name: 'Dr. Roberto Jiménez',   specialty: 'Ortopedia',        branch: 'Sucursal Sur'     },
];

export const SPECIALTIES = ['Todas', 'Medicina General', 'Cardiología', 'Pediatría', 'Ortopedia'];
export const BRANCHES    = ['Todas', 'Sucursal Central', 'Sucursal Norte', 'Sucursal Sur'];

export const TODAY      = '2026-06-06';
export const WEEK_DAYS  = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'];
export const WEEK_DATES = ['2026-06-08', '2026-06-09', '2026-06-10', '2026-06-11', '2026-06-12'];
export const HOURS      = Array.from({ length: 12 }, (_, i) => i + 7); // 07–18

export const MOCK_APPOINTMENTS: Appointment[] = [
  { id: 'a1',  patientName: 'María González',       time: '08:00', endTime: '08:30', reason: 'Control mensual',         insuranceType: 'CCSS',    duration: 30, status: 'confirmed',   doctorId: '1', date: '2026-06-08', phone: '8888-1234', notes: 'Paciente con historial de hipertensión. Revisar presión arterial.',    hour: 8  },
  { id: 'a2',  patientName: 'Carlos Rodríguez',     time: '09:00', endTime: '09:30', reason: 'Dolor de pecho',          insuranceType: 'INS',     duration: 30, status: 'in-progress', doctorId: '1', date: '2026-06-08', phone: '7777-5566', notes: 'Llegó con 10 min de anticipación. Sin alergias conocidas.',           hour: 9  },
  { id: 'a3',  patientName: 'Laura Méndez',          time: '10:00', endTime: '10:45', reason: 'Revisión postoperatoria', insuranceType: 'CCSS',    duration: 45, status: 'pending',     doctorId: '1', date: '2026-06-08', phone: '6666-9900', notes: 'Primera revisión post-cirugía. Solicitar que traiga radiografías.',    hour: 10 },
  { id: 'a4',  patientName: 'BLOQUEO – Almuerzo',   time: '12:00', endTime: '13:00', reason: 'Descanso',                insuranceType: '-',       duration: 60, status: 'blocked',     doctorId: '1', date: '2026-06-08', phone: '-',        notes: '-',                                                                   hour: 12 },
  { id: 'a5',  patientName: 'Roberto Arias',         time: '13:00', endTime: '13:30', reason: 'Seguimiento diabetes',   insuranceType: 'CCSS',    duration: 30, status: 'cancelled',   doctorId: '1', date: '2026-06-08', phone: '8833-4412', notes: 'Canceló por transporte. Reagendar para la próxima semana.',           hour: 13 },
  { id: 'a6',  patientName: 'Diana Castillo',        time: '14:00', endTime: '14:30', reason: 'Gripe y fiebre',          insuranceType: 'Privado', duration: 30, status: 'confirmed',   doctorId: '1', date: '2026-06-08', phone: '7001-2233', notes: 'Fiebre desde hace 3 días. Solicitar examen de sangre completo.',      hour: 14 },
  { id: 'a7',  patientName: 'Esteban Núñez',         time: '07:30', endTime: '08:00', reason: 'Chequeo anual',           insuranceType: 'CCSS',    duration: 30, status: 'confirmed',   doctorId: '1', date: '2026-06-09', phone: '8855-6677', notes: 'Chequeo rutinario anual. Sin condiciones previas reportadas.',        hour: 7  },
  { id: 'a8',  patientName: 'Sofía Herrera',         time: '10:00', endTime: '10:30', reason: 'Asma',                    insuranceType: 'INS',     duration: 30, status: 'pending',     doctorId: '1', date: '2026-06-09', phone: '6644-9988', notes: 'Crisis asmática recurrente. Recordar que traiga inhalador actual.',   hour: 10 },
  { id: 'a9',  patientName: 'BLOQUEO – Reunión',    time: '11:00', endTime: '12:00', reason: 'Reunión de equipo',       insuranceType: '-',       duration: 60, status: 'blocked',     doctorId: '1', date: '2026-06-10', phone: '-',        notes: '-',                                                                   hour: 11 },
  { id: 'a10', patientName: 'Jorge Salazar',          time: '14:00', endTime: '14:30', reason: 'Dolor lumbar',            insuranceType: 'Privado', duration: 30, status: 'confirmed',   doctorId: '1', date: '2026-06-10', phone: '7711-3344', notes: 'Dolor crónico de espalda baja. Lleva aproximadamente 2 semanas.',    hour: 14 },
  { id: 'a11', patientName: 'Andrea Vega',            time: '09:00', endTime: '09:30', reason: 'Embarazo – Control',     insuranceType: 'CCSS',    duration: 30, status: 'confirmed',   doctorId: '1', date: '2026-06-11', phone: '8899-0011', notes: 'Semana 28 de embarazo. Control rutinario. Sin complicaciones.',      hour: 9  },
  { id: 'a12', patientName: 'Manuel Rojas',           time: '15:00', endTime: '15:30', reason: 'Hipertensión',            insuranceType: 'CCSS',    duration: 30, status: 'in-progress', doctorId: '1', date: '2026-06-11', phone: '6677-1122', notes: 'Medicación nueva. Controlar presión arterial antes de consulta.',    hour: 15 },
  { id: 'a13', patientName: 'Valeria Torres',         time: '08:00', endTime: '08:45', reason: 'Tiroides',                insuranceType: 'INS',     duration: 45, status: 'confirmed',   doctorId: '1', date: '2026-06-12', phone: '7788-9900', notes: 'Resultados de laboratorio listos. Revisar niveles TSH.',             hour: 8  },
  { id: 'a14', patientName: 'BLOQUEO – Capacitación',time: '16:00', endTime: '17:00', reason: 'Capacitación interna',    insuranceType: '-',       duration: 60, status: 'blocked',     doctorId: '1', date: '2026-06-12', phone: '-',        notes: '-',                                                                   hour: 16 },
];

export const STATUS_CONFIG: Record<AppointmentStatus, StatusConfigEntry> = {
  'confirmed':   { label: 'Confirmada',              color: 'bg-green-50  border-l-green-500  text-green-900',  dot: 'bg-green-500',  badge: 'bg-green-100  text-green-700'  },
  'pending':     { label: 'Pendiente',               color: 'bg-yellow-50 border-l-yellow-500 text-yellow-900', dot: 'bg-yellow-400', badge: 'bg-yellow-100 text-yellow-700' },
  'cancelled':   { label: 'Cancelada',               color: 'bg-red-50    border-l-red-500    text-red-900',    dot: 'bg-red-500',    badge: 'bg-red-100    text-red-700'    },
  'in-progress': { label: 'En curso / En sala',      color: 'bg-blue-50   border-l-blue-500   text-blue-900',   dot: 'bg-blue-500',   badge: 'bg-blue-100   text-blue-700'   },
  'blocked':     { label: 'Bloqueado / Descanso',    color: 'bg-gray-100  border-l-gray-400   text-gray-600',   dot: 'bg-gray-400',   badge: 'bg-gray-200   text-gray-600'   },
};
