import { useState, FormEvent } from 'react';
import { useDoctorsMock } from '@/context/DoctorsMockContext';
import type { Speciality, SpecialityFormData } from '../types/doctors.types';

// Max length mirrors the `varchar(255)` `name` column on `specialities`.
export const SPECIALITY_NAME_MAX = 255;

const EMPTY_FORM: SpecialityFormData = {
  name: '',
  description: '',
};

// Owns the speciality create/edit form, nested inside the specialities
// manager modal. Writes go through DoctorsMockContext (POC, no backend yet) —
// swap this for the real createSpeciality()/updateSpeciality() services once
// the API is ready. onSaved lets the caller refresh the result banner.
export function useSpecialityForm(onSaved: (msg: string) => void) {
  const { addSpeciality, editSpeciality } = useDoctorsMock();

  const [showModal, setShowModal] = useState(false);
  const [editingSpeciality, setEditingSpeciality] = useState<Speciality | null>(null);
  const [formData, setFormData] = useState<SpecialityFormData>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field: keyof SpecialityFormData, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setEditingSpeciality(null);
  };

  const openCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = (speciality: Speciality) => {
    setEditingSpeciality(speciality);
    setFormData({
      name: speciality.name,
      description: speciality.description ?? '',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return; // ignore rapid double clicks
    setSubmitting(true);
    try {
      const payload = { name: formData.name, description: formData.description };
      if (editingSpeciality) {
        editSpeciality(editingSpeciality.id, payload);
        onSaved('Se ha actualizado correctamente el registro.');
      } else {
        addSpeciality(payload);
        onSaved('Se ha creado correctamente el registro.');
      }
      closeModal();
    } finally {
      setSubmitting(false);
    }
  };

  return {
    showModal,
    editingSpeciality,
    formData,
    submitting,
    updateField,
    openCreate,
    openEdit,
    closeModal,
    handleSubmit,
  };
}
