import { FormEvent, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { bookedSlotsForDoctor } from '../services/appointmentsService';
import { INITIAL_FORM, TIME_SLOTS } from '../constants';
import type { Appointment, AppointmentStatus, Doctor } from '../types/appointments.types';

// Owns the "Nueva cita" modal: form state, doctor-driven specialty, available
// slots for the chosen doctor/date and the submit that builds the new record.
export function useNewAppointmentForm(
  appointments: Appointment[],
  doctors: Doctor[],
  onCreate: (appt: Appointment) => void
) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);

  const bookedSlots = useMemo(() => {
    if (!formData.doctor_id || !formData.appointment_date) return [];
    return bookedSlotsForDoctor(appointments, parseInt(formData.doctor_id), formData.appointment_date);
  }, [appointments, formData.doctor_id, formData.appointment_date]);

  useEffect(() => {
    setFormData((prev) =>
      bookedSlots.includes(prev.appointment_time) ? { ...prev, appointment_time: '' } : prev
    );
  }, [bookedSlots]);

  const availableSlots = useMemo(
    () => TIME_SLOTS.filter((s) => !bookedSlots.includes(s)),
    [bookedSlots]
  );

  const resetForm = () => setFormData(INITIAL_FORM);

  const openCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const updateField = (field: keyof typeof formData, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleDoctorChange = (doctorId: string) => {
    const doctor = doctors.find((d) => String(d.id) === doctorId);
    setFormData((prev) => ({
      ...prev,
      doctor_id: doctorId,
      specialty: doctor?.specialty ?? '',
      appointment_time: '',
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.appointment_time) {
      toast.error('Por favor seleccione un horario disponible');
      return;
    }
    const newAppt: Appointment = {
      id: appointments.length + 1,
      patient_id: parseInt(formData.patient_id),
      doctor_id: parseInt(formData.doctor_id),
      specialty: formData.specialty,
      appointment_date: formData.appointment_date,
      appointment_time: formData.appointment_time,
      status: 'pending' as AppointmentStatus,
      notes: formData.notes,
    };
    onCreate(newAppt);
    toast.success('Cita agendada exitosamente');
    closeModal();
  };

  return {
    showModal,
    formData,
    availableSlots,
    openCreate,
    closeModal,
    updateField,
    handleDoctorChange,
    handleSubmit,
  };
}
