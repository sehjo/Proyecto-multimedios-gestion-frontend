import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { bookedSlotsForDoctor } from '../services/appointmentsService';
import { TIME_SLOTS, formatDate } from '../constants';
import type { Appointment, AppointmentStatus, EnrichedAppointment } from '../types/appointments.types';

// Owns the "Reprogramar cita" modal: new date/time, available slots for the
// same doctor (excluding the appointment being moved) and the submit that
// closes the original record and opens the new one.
export function useRescheduleAppointment(
  appointments: Appointment[],
  onRescheduled: (id: number, newAppt: Appointment) => void
) {
  const [appointmentToReschedule, setAppointmentToReschedule] = useState<EnrichedAppointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');

  useEffect(() => {
    setRescheduleTime('');
  }, [rescheduleDate]);

  const availableSlots = useMemo(() => {
    if (!appointmentToReschedule || !rescheduleDate) return [];
    const booked = bookedSlotsForDoctor(
      appointments,
      appointmentToReschedule.doctor_id,
      rescheduleDate,
      appointmentToReschedule.id
    );
    const originalSlot = appointmentToReschedule.appointment_time.substring(0, 5);
    return TIME_SLOTS.filter((s) => {
      if (booked.includes(s)) return false;
      if (rescheduleDate === appointmentToReschedule.appointment_date && s === originalSlot) return false;
      return true;
    });
  }, [appointments, appointmentToReschedule, rescheduleDate]);

  const openReschedule = (appt: EnrichedAppointment) => {
    setAppointmentToReschedule(appt);
    setRescheduleDate('');
    setRescheduleTime('');
  };

  const closeModal = () => {
    setAppointmentToReschedule(null);
    setRescheduleDate('');
    setRescheduleTime('');
  };

  const handleConfirm = () => {
    if (!appointmentToReschedule || !rescheduleDate || !rescheduleTime) return;
    const newAppt: Appointment = {
      id: appointments.length + 1,
      patient_id: appointmentToReschedule.patient_id,
      doctor_id: appointmentToReschedule.doctor_id,
      specialty: appointmentToReschedule.specialty,
      appointment_date: rescheduleDate,
      appointment_time: rescheduleTime,
      status: 'confirmed' as AppointmentStatus,
      notes: appointmentToReschedule.notes,
    };
    onRescheduled(appointmentToReschedule.id, newAppt);
    toast.success('Cita reprogramada exitosamente');
    toast.info(
      `Notificación enviada a ${appointmentToReschedule.patient_name} con la nueva fecha: ${formatDate(rescheduleDate)} a las ${rescheduleTime}.`
    );
    closeModal();
  };

  return {
    appointmentToReschedule,
    rescheduleDate,
    setRescheduleDate,
    rescheduleTime,
    setRescheduleTime,
    availableSlots,
    openReschedule,
    closeModal,
    handleConfirm,
  };
}
