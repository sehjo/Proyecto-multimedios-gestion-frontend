import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useActivity } from '../../../../context/ActivityContext';
import { useHistory } from '../../../../context/HistoryContext';
import {
  applyHistoryEntryUpdate,
  buildHistoryEntry,
  getCurrentDoctor,
  getDoctorById,
  getHistoryEntriesByPatient,
  getPatientById,
  sortEntriesByDateDesc,
} from '../services/medicalHistoryService';
import type { HistoryEntry, HistoryEntryPayload, MedItem } from '../types/medicalHistory.types';

// Owns the patient, their history entries (merged with appointment-linked
// entries) and the create/update mutations. Keeps the data/CRUD concerns out
// of the page.
export function usePatientHistory(patientId: number) {
  const { logActivity } = useActivity();
  const { linkedEntries } = useHistory();

  const patient = useMemo(() => getPatientById(patientId), [patientId]);
  const currentDoctor = useMemo(() => getCurrentDoctor(), []);

  const [entries, setEntries] = useState<HistoryEntry[]>(() =>
    getHistoryEntriesByPatient(patientId)
  );

  // Merge entries linked from the Appointments module (marking as attended).
  const mergedIds = useRef<Set<number>>(new Set());
  useEffect(() => {
    const incoming = linkedEntries.filter(
      (e) => e.patient_id === patientId && !mergedIds.current.has(e.id)
    );
    if (incoming.length === 0) return;
    incoming.forEach((e) => mergedIds.current.add(e.id));
    setEntries((prev) => sortEntriesByDateDesc([...incoming, ...prev]));
  }, [linkedEntries, patientId]);

  const getDoctorName = (doctorId: number) => {
    const doctor = getDoctorById(doctorId);
    return doctor ? `${doctor.name} ${doctor.lastname}` : `Dr. #${doctorId}`;
  };

  const currentDoctorName = `${currentDoctor.name} ${currentDoctor.lastname}`;

  // TODO: habilitar cuando exista auth real
  // const canEdit = (entry: HistoryEntry) =>
  //   MOCK_CURRENT_USER.role === 'admin' || MOCK_CURRENT_USER.id === entry.doctor_id;
  const canEdit = (_entry: HistoryEntry) => true;

  const applyEntry = (
    payload: HistoryEntryPayload,
    meds: MedItem[],
    editingEntry: HistoryEntry | null
  ) => {
    if (editingEntry) {
      const updated = applyHistoryEntryUpdate(editingEntry, payload, meds);
      setEntries((prev) =>
        sortEntriesByDateDesc(prev.map((e) => (e.id === editingEntry.id ? updated : e)))
      );
      toast.success('Registro actualizado exitosamente');
      logActivity({ type: 'Registro editado en historial', name: updated.diagnosis });
    } else {
      const newEntry = buildHistoryEntry(patientId, currentDoctor.id, payload, meds, entries);
      setEntries((prev) => sortEntriesByDateDesc([newEntry, ...prev]));
      toast.success('Registro guardado exitosamente');
      logActivity({ type: 'Nuevo registro en historial', name: newEntry.diagnosis });
    }
  };

  return {
    patient,
    entries,
    getDoctorName,
    currentDoctorName,
    canEdit,
    applyEntry,
  };
}
