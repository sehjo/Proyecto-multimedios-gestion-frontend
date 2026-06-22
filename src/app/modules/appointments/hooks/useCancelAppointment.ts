import { useState } from 'react';
import { toast } from 'sonner';
import type { EnrichedAppointment } from '../types/appointments.types';

// Owns the "Cancelar cita" modal: which appointment, the cancellation reason
// and its validation.
export function useCancelAppointment(onCancelled: (id: number, reason: string) => void) {
  const [appointmentToCancel, setAppointmentToCancel] = useState<EnrichedAppointment | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  const openCancel = (appt: EnrichedAppointment) => {
    setAppointmentToCancel(appt);
    setCancelReason('');
  };

  const closeModal = () => {
    setAppointmentToCancel(null);
    setCancelReason('');
  };

  const handleConfirm = () => {
    if (!appointmentToCancel || !cancelReason.trim()) return;
    onCancelled(appointmentToCancel.id, cancelReason.trim());
    toast.success('Cita cancelada exitosamente');
    toast.info(`Notificación enviada a ${appointmentToCancel.patient_name} informando la cancelación.`);
    closeModal();
  };

  return {
    appointmentToCancel,
    cancelReason,
    setCancelReason,
    openCancel,
    closeModal,
    handleConfirm,
  };
}
