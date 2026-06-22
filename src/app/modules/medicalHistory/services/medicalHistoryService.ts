import {
  MOCK_CURRENT_USER,
  MOCK_PATIENTS,
  MOCK_USERS,
  MOCK_DISEASES,
  MOCK_DRUGS,
  MOCK_HISTORY_ENTRIES,
} from '@/api/mockData';
import type {
  Patient,
  Doctor,
  Disease,
  Drug,
  HistoryEntry,
  HistoryEntryPayload,
  MedItem,
} from '../types/medicalHistory.types';

export function getPatients(): Patient[] {
  return MOCK_PATIENTS;
}

export function getPatientById(patientId: number): Patient | null {
  return MOCK_PATIENTS.find((p) => p.id === patientId) ?? null;
}

export function getDoctors(): Doctor[] {
  return MOCK_USERS;
}

export function getDoctorById(doctorId: number): Doctor | null {
  return MOCK_USERS.find((u) => u.id === doctorId) ?? null;
}

export function getCurrentDoctor(): Doctor {
  return {
    id: MOCK_CURRENT_USER.id,
    name: MOCK_CURRENT_USER.name,
    lastname: MOCK_CURRENT_USER.lastname,
  };
}

export function getDiseases(): Disease[] {
  return MOCK_DISEASES;
}

export function getDrugs(): Drug[] {
  return MOCK_DRUGS;
}

export function sortEntriesByDateDesc(entries: HistoryEntry[]): HistoryEntry[] {
  return [...entries].sort(
    (a, b) => new Date(b.consultation_date).getTime() - new Date(a.consultation_date).getTime()
  );
}

export function getHistoryEntriesByPatient(patientId: number): HistoryEntry[] {
  return sortEntriesByDateDesc(MOCK_HISTORY_ENTRIES.filter((e) => e.patient_id === patientId));
}

function buildMedications(meds: MedItem[]) {
  return meds.map((m, i) => ({
    id: i + 1,
    drug_id: m.drug_id ? Number(m.drug_id) : null,
    drug_name: m.drug_name.trim(),
    dose: m.dose.trim(),
    frequency: m.frequency.trim(),
  }));
}

export function buildHistoryEntry(
  patientId: number,
  doctorId: number,
  payload: HistoryEntryPayload,
  meds: MedItem[],
  existingEntries: HistoryEntry[]
): HistoryEntry {
  const nextId =
    Math.max(0, ...existingEntries.map((e) => e.id), ...MOCK_HISTORY_ENTRIES.map((e) => e.id)) + 1;
  return {
    id: nextId,
    patient_id: patientId,
    consultation_date: new Date(payload.consultation_date).toISOString(),
    doctor_id: doctorId,
    diagnosis: payload.diagnosis.trim(),
    disease_id: payload.disease_id ? Number(payload.disease_id) : null,
    treatment: payload.treatment.trim(),
    observations: payload.observations.trim(),
    medications: buildMedications(meds),
  };
}

export function applyHistoryEntryUpdate(
  entry: HistoryEntry,
  payload: HistoryEntryPayload,
  meds: MedItem[]
): HistoryEntry {
  return {
    ...entry,
    consultation_date: new Date(payload.consultation_date).toISOString(),
    diagnosis: payload.diagnosis.trim(),
    disease_id: payload.disease_id ? Number(payload.disease_id) : null,
    treatment: payload.treatment.trim(),
    observations: payload.observations.trim(),
    medications: buildMedications(meds),
    updated_at: new Date().toISOString(),
  };
}
