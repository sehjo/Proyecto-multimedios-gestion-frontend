// Domain types for institutional holidays / closures (HU-039).

// A registered holiday or institutional closure. `dates` holds every
// "YYYY-MM-DD" the event covers (a single day = one entry; e.g. Semana Santa
// spans several), all blocked for new appointments. `title` is the public event
// name (e.g. "Batalla de Rivas"); `description` is an internal note.
export interface Holiday {
  id: string;
  dates: string[];
  title: string;
  description: string;
}

// Shape of the create-holiday form. `dates` are the days selected in the
// calendar (sorted, "YYYY-MM-DD").
export interface HolidayFormData {
  dates: string[];
  title: string;
  description: string;
}

// Field-level validation errors for the holiday form. Absence means valid.
export interface HolidayFormErrors {
  dates?: string;
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

// An appointment queued for rescheduling after its date became a holiday. Keeps
// the original date/time for reference and the holiday reason that displaced it.
export interface PendingReschedule extends AffectedAppointment {
  originalDate: string;
  originalTime: string;
  holidayTitle: string;
}
