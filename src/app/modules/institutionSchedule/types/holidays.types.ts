// Domain types for institutional holidays / closures (HU-039).

// A registered holiday or institutional closure. `date` is "YYYY-MM-DD"; the day
// is blocked for new appointments. `title` is the public event name (e.g.
// "Batalla de Rivas"); `description` is an internal note.
export interface Holiday {
  id: string;
  date: string;
  title: string;
  description: string;
}

// Shape of the create-holiday form.
export interface HolidayFormData {
  date: string;
  title: string;
  description: string;
}

// Field-level validation errors for the holiday form. Absence means valid.
export interface HolidayFormErrors {
  date?: string;
  title?: string;
}

// An appointment scheduled on a date that just became a holiday. Used to build
// the "pending rescheduling" work list (HU-039, scenario 3). This is a local
// mock view of an appointment; the real appointments module owns its own data.
export interface AffectedAppointment {
  id: number;
  patientName: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
}
