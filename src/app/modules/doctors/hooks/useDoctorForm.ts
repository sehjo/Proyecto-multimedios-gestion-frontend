import { useState, FormEvent } from 'react';
import { useActivity } from '@/context/ActivityContext';
import { useDoctorsMock } from '@/context/DoctorsMockContext';
import type { Doctor, DoctorFormData } from '../types/doctors.types';

// Max lengths mirror the `varchar(255)` columns on `doctors`.
export const IDENTIFIER_MAX = 255;
export const NAME_MAX = 255;
export const EMAIL_MAX = 255;

const EMPTY_FORM: DoctorFormData = {
  identifier: '',
  name: '',
  email: '',
  speciality_ids: [],
};

// Owns the create/edit form: state, edit seeding and submit (create vs update).
// Writes go through DoctorsMockContext (POC, no backend yet) — swap this for
// the real createDoctor()/updateDoctor() services once the API is ready.
// onSaved lets the page show the success banner.
export function useDoctorForm(onSaved: (msg: string) => void) {
  const { logActivity } = useActivity();
  const { addDoctor, editDoctor } = useDoctorsMock();

  const [showModal, setShowModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [formData, setFormData] = useState<DoctorFormData>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field: keyof DoctorFormData, value: string | string[]) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setEditingDoctor(null);
  };

  const openCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      identifier: doctor.identifier,
      name: doctor.name,
      email: doctor.email,
      speciality_ids: (doctor.specialities ?? []).map((s) => String(s.id)),
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
      const payload = {
        identifier: formData.identifier,
        name: formData.name,
        email: formData.email,
        speciality_ids: formData.speciality_ids.map(Number),
      };
      if (editingDoctor) {
        editDoctor(editingDoctor.id, payload);
        logActivity({ type: 'Doctor actualizado', name: formData.name });
        onSaved('Se ha actualizado correctamente el registro.');
      } else {
        addDoctor(payload);
        logActivity({ type: 'Nuevo doctor', name: formData.name });
        onSaved('Se ha creado correctamente el registro.');
      }
      closeModal();
    } finally {
      setSubmitting(false);
    }
  };

  return {
    showModal,
    editingDoctor,
    formData,
    submitting,
    updateField,
    openCreate,
    openEdit,
    closeModal,
    handleSubmit,
  };
}
