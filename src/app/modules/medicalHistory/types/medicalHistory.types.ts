// Re-exported from the shared mock API: HistoryContext (used by Appointments
// to link an attended appointment into the history) also depends on this type.
export type { HistoryEntry } from '@/api/mockData';

export interface Patient {
  id: number;
  name: string;
  lastname: string;
  nick: string;
}

export interface Doctor {
  id: number;
  name: string;
  lastname: string;
}

export interface Disease {
  id: number;
  name: string;
}

export interface Drug {
  id: number;
  name: string;
}

export interface Medication {
  id: number;
  drug_id: number | null;
  drug_name: string;
  dose: string;
  frequency: string;
}

// A medication row inside the create/edit form (ids as strings, matching <select>/<input> values).
export interface MedItem {
  drug_id: string;
  drug_name: string;
  dose: string;
  frequency: string;
}

export interface MedError {
  drug_name?: string;
  dose?: string;
  frequency?: string;
}

export interface HistoryEntryPayload {
  consultation_date: string;
  disease_id: string;
  diagnosis: string;
  treatment: string;
  observations: string;
}

export interface HistoryFormErrors {
  consultation_date?: string;
  diagnosis?: string;
}
