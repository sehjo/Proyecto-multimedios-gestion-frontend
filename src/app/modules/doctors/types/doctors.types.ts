// A speciality row, as returned by GET /specialities (table `specialities`).
export interface Speciality {
  id: number;
  name: string;
  description?: string | null;
}

// Shape of the speciality create/edit form.
export interface SpecialityFormData {
  name: string;
  description: string;
}

// A doctor row, as returned by GET /doctors (table `doctors`). `specialities`
// comes from the `doctor_specialities` pivot, expanded to full objects.
export interface Doctor {
  id: number;
  identifier: string;
  name: string;
  email: string;
  specialities?: Speciality[];
}

// Shape of the doctor create/edit form. `speciality_ids` holds the selected
// speciality ids as strings (native <select multiple> values), converted to
// numbers only when building the request payload.
export interface DoctorFormData {
  identifier: string;
  name: string;
  email: string;
  speciality_ids: string[];
}

// Inline result banner shown above the search bar. 'success' = green, 'info' = blue.
export interface Banner {
  type: 'success' | 'info';
  msg: string;
}
