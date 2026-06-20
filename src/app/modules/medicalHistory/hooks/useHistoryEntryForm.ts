import { useMemo, useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { getDiseases, getDrugs } from '../services/medicalHistoryService';
import { todayISO } from '../utils';
import type {
  Disease,
  Drug,
  HistoryEntry,
  HistoryEntryPayload,
  HistoryFormErrors,
  MedError,
  MedItem,
} from '../types/medicalHistory.types';

const emptyForm = (): HistoryEntryPayload => ({
  consultation_date: todayISO(),
  disease_id: '',
  diagnosis: '',
  treatment: '',
  observations: '',
});

const entryToForm = (entry: HistoryEntry): HistoryEntryPayload => ({
  consultation_date: entry.consultation_date.split('T')[0],
  disease_id: entry.disease_id ? String(entry.disease_id) : '',
  diagnosis: entry.diagnosis,
  treatment: entry.treatment,
  observations: entry.observations,
});

const entryToMeds = (entry: HistoryEntry): MedItem[] =>
  (entry.medications || []).map((m) => ({
    drug_id: m.drug_id ? String(m.drug_id) : '',
    drug_name: m.drug_name,
    dose: m.dose,
    frequency: m.frequency,
  }));

const validateMeds = (meds: MedItem[]) => {
  const errors = meds.map((m) => {
    const err: MedError = {};
    if (!m.drug_name.trim()) err.drug_name = 'Este campo es obligatorio';
    if (!m.dose.trim()) err.dose = 'Este campo es obligatorio';
    if (!m.frequency.trim()) err.frequency = 'Este campo es obligatorio';
    return err;
  });
  return { errors, hasErrors: errors.some((e) => Object.keys(e).length > 0) };
};

interface UseHistoryEntryFormConfig {
  canEdit: (entry: HistoryEntry) => boolean;
  onSubmit: (payload: HistoryEntryPayload, meds: MedItem[], editingEntry: HistoryEntry | null) => void;
}

// Owns the create/edit history-entry form: one modal, reused for both modes
// (same pattern as useUserForm). Validation is a UI concern, so it lives here.
export function useHistoryEntryForm({ canEdit, onSubmit }: UseHistoryEntryFormConfig) {
  const diseases: Disease[] = useMemo(() => getDiseases(), []);
  const drugs: Drug[] = useMemo(() => getDrugs(), []);

  const [showModal, setShowModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<HistoryEntry | null>(null);
  const [formData, setFormData] = useState<HistoryEntryPayload>(emptyForm);
  const [errors, setErrors] = useState<HistoryFormErrors>({});
  const [meds, setMeds] = useState<MedItem[]>([]);
  const [medErrors, setMedErrors] = useState<MedError[]>([]);

  const openCreate = () => {
    setEditingEntry(null);
    setFormData(emptyForm());
    setErrors({});
    setMeds([]);
    setMedErrors([]);
    setShowModal(true);
  };

  const openEdit = (entry: HistoryEntry) => {
    if (!canEdit(entry)) {
      toast.error('No tienes permiso para editar este registro');
      return;
    }
    setEditingEntry(entry);
    setFormData(entryToForm(entry));
    setErrors({});
    const seededMeds = entryToMeds(entry);
    setMeds(seededMeds);
    setMedErrors(seededMeds.map(() => ({})));
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setErrors({});
    setMedErrors([]);
  };

  const updateField = (field: keyof HistoryEntryPayload, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === 'consultation_date' && value) {
      setErrors((prev) => ({ ...prev, consultation_date: undefined }));
    }
    if (field === 'diagnosis' && value.trim()) {
      setErrors((prev) => ({ ...prev, diagnosis: undefined }));
    }
  };

  const handleDiseaseSelect = (diseaseId: string) => {
    const disease = diseases.find((d) => String(d.id) === diseaseId);
    setFormData((prev) => ({
      ...prev,
      disease_id: diseaseId,
      diagnosis: disease ? disease.name : prev.diagnosis,
    }));
    if (disease) setErrors((prev) => ({ ...prev, diagnosis: undefined }));
  };

  const addMed = () => {
    setMeds((prev) => [...prev, { drug_id: '', drug_name: '', dose: '', frequency: '' }]);
    setMedErrors((prev) => [...prev, {}]);
  };

  const removeMed = (index: number) => {
    setMeds((prev) => prev.filter((_, i) => i !== index));
    setMedErrors((prev) => prev.filter((_, i) => i !== index));
  };

  const clearMedError = (index: number, field: keyof MedError) => {
    setMedErrors((prev) => prev.map((e, i) => (i === index ? { ...e, [field]: undefined } : e)));
  };

  const updateMed = (index: number, patch: Partial<MedItem>) => {
    setMeds((prev) => prev.map((m, i) => (i === index ? { ...m, ...patch } : m)));
    if (patch.drug_name?.trim()) clearMedError(index, 'drug_name');
    if (patch.dose?.trim()) clearMedError(index, 'dose');
    if (patch.frequency?.trim()) clearMedError(index, 'frequency');
  };

  const handleCatalogSelect = (index: number, drugId: string) => {
    const drug = drugs.find((d) => String(d.id) === drugId);
    updateMed(index, { drug_id: drugId, drug_name: drug ? drug.name : '' });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newErrors: HistoryFormErrors = {};
    if (!formData.consultation_date.trim()) newErrors.consultation_date = 'Este campo es obligatorio';
    if (!formData.diagnosis.trim()) newErrors.diagnosis = 'Este campo es obligatorio';
    const { errors: medErrs, hasErrors: medHasErrors } = validateMeds(meds);
    if (Object.keys(newErrors).length > 0 || medHasErrors) {
      setErrors(newErrors);
      setMedErrors(medErrs);
      return;
    }

    onSubmit(formData, meds, editingEntry);
    closeModal();
  };

  return {
    showModal,
    editingEntry,
    formData,
    errors,
    meds,
    medErrors,
    diseases,
    drugs,
    openCreate,
    openEdit,
    closeModal,
    updateField,
    handleDiseaseSelect,
    addMed,
    removeMed,
    updateMed,
    handleCatalogSelect,
    handleSubmit,
  };
}
