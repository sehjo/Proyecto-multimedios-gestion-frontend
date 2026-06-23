import { isoFromToday } from './holidays.constants';
import type { DayAppointment, DayAvailabilityLevel } from './types/availability.types';

// Color classes and label per availability level (the green/yellow/red code).
export const LEVEL_STYLE: Record<
  DayAvailabilityLevel,
  { dayClass: string; dot: string; label: string }
> = {
  free: {
    dayClass: 'bg-green-50 border-green-300 text-green-800 hover:bg-green-100',
    dot: 'bg-green-500',
    label: 'Disponibilidad normal',
  },
  almost: {
    dayClass: 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100',
    dot: 'bg-amber-400',
    label: 'Alta ocupación',
  },
  full: {
    dayClass: 'bg-red-50 border-red-300 text-red-700 hover:bg-red-100',
    dot: 'bg-red-500',
    label: 'Sin cupos',
  },
  closed: {
    dayClass: 'bg-gray-100 border-gray-200 text-gray-400',
    dot: 'bg-gray-300',
    label: 'Cerrado / feriado',
  },
};

// Slot length (minutes) used to derive day capacity from open hours.
export const SLOT_MINUTES = 30;

// "Few slots left" threshold for the yellow (almost-full) level.
export const ALMOST_FULL_SLOTS_LEFT = 2;

// Mock appointments keyed by date, used to compute occupancy and the day detail
// (local mock; the real appointments module lives on another branch). Seeded
// relative to today so the semaphore always has something to show:
//  - +2 days: nearly full (yellow)
//  - +4 days: full (red)
//  - others: a few (green)
function makeAppointments(date: string, count: number): DayAppointment[] {
  const doctors = ['Dr. Ricardo Solano', 'Dra. Elena Mora', 'Dr. Andrés Castro'];
  const patients = [
    'Carlos Méndez', 'María González', 'Luis Herrera', 'Ana Vargas', 'Jorge Ramírez',
    'Sofía Rojas', 'Pedro Castro', 'Lucía Mora', 'Diego Salas', 'Elena Vega',
    'Marco Díaz', 'Nadia Pérez', 'Hugo Lara', 'Irene Soto', 'Raúl Campos',
    'Tania Ruiz', 'Bruno Gil', 'Carla Núñez',
  ];
  const statuses: DayAppointment['status'][] = ['confirmed', 'pending', 'cancelled'];
  const result: DayAppointment[] = [];
  for (let i = 0; i < count; i++) {
    const totalMinutes = 7 * 60 + i * SLOT_MINUTES; // from 07:00
    const h = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
    const m = String(totalMinutes % 60).padStart(2, '0');
    result.push({
      id: Number(`${date.replace(/-/g, '')}${i}`),
      patientName: patients[i % patients.length],
      doctorName: doctors[i % doctors.length],
      time: `${h}:${m}`,
      // Mostly confirmed/pending; a couple cancelled for the grouped view.
      status: i % 7 === 6 ? statuses[2] : statuses[i % 2],
    });
  }
  return result;
}

// Day -> appointments. Counts chosen against an ~18-slot weekday capacity
// (07-12 + 13-17 = 9h / 30min) to land on each color.
export const MOCK_DAY_APPOINTMENTS: Record<string, DayAppointment[]> = {
  [isoFromToday(1)]: makeAppointments(isoFromToday(1), 4),
  [isoFromToday(2)]: makeAppointments(isoFromToday(2), 17), // nearly full -> yellow
  [isoFromToday(4)]: makeAppointments(isoFromToday(4), 18), // full -> red
  [isoFromToday(5)]: makeAppointments(isoFromToday(5), 7),
  [isoFromToday(8)]: makeAppointments(isoFromToday(8), 2),
  [isoFromToday(9)]: makeAppointments(isoFromToday(9), 11),
};
