import type { AffectedAppointment } from './types/holidays.types';

// localStorage key for the persisted holidays list (mock backend).
export const HOLIDAYS_STORAGE_KEY = 'institution_holidays';

// Spanish month names indexed 0-11 (January = 0).
export const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

// Returns today's date as "YYYY-MM-DD" in local time (matches <input type="date">).
export function todayISO(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Returns an ISO date `days` days from today (used to seed demo appointments
// that always fall in the future, so scenario 3 stays demonstrable).
export function isoFromToday(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Mock upcoming appointments used to identify which ones a new holiday affects
// (HU-039, scenario 3). Kept local to the module; the real appointments module
// owns its own state and lives on another branch.
export const MOCK_UPCOMING_APPOINTMENTS: AffectedAppointment[] = [
  { id: 101, patientName: 'Carlos Méndez', doctorName: 'Dr. Ricardo Solano', specialty: 'Cardiología', date: isoFromToday(3), time: '07:30' },
  { id: 102, patientName: 'María González', doctorName: 'Dr. Ricardo Solano', specialty: 'Cardiología', date: isoFromToday(3), time: '08:00' },
  { id: 103, patientName: 'Luis Herrera', doctorName: 'Dra. Elena Mora', specialty: 'Pediatría', date: isoFromToday(3), time: '09:00' },
  { id: 104, patientName: 'Ana Vargas', doctorName: 'Dr. Andrés Castro', specialty: 'Medicina General', date: isoFromToday(7), time: '10:30' },
  { id: 105, patientName: 'Jorge Ramírez', doctorName: 'Dra. Elena Mora', specialty: 'Pediatría', date: isoFromToday(10), time: '08:30' },
];
