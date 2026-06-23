// Domain types for the day-availability semaphore and day detail (HU-039,
// availability scenarios). All dates are "YYYY-MM-DD"; times are "HH:mm".

// Availability level of a day, used for the green/yellow/red color code.
//  - 'free'   : several slots left (green)
//  - 'almost' : few slots left, near the limit (yellow)
//  - 'full'   : no slots left (red)
//  - 'closed' : the institution is closed or it's a holiday (red, no capacity)
export type DayAvailabilityLevel = 'free' | 'almost' | 'full' | 'closed';

// A booked appointment used by the availability views (local mock).
export interface DayAppointment {
  id: number;
  patientName: string;
  doctorName: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

// Computed availability for a single day.
export interface DayAvailability {
  date: string;
  level: DayAvailabilityLevel;
  capacity: number; // total slots derived from the institutional schedule
  bookedCount: number; // active (non-cancelled) appointments
  slotsLeft: number; // capacity - bookedCount (never negative)
  openHours: number; // institutional open hours that day
}

// Full detail for the day modal: the availability plus the day's appointments.
export interface DayDetail extends DayAvailability {
  appointments: DayAppointment[];
}
