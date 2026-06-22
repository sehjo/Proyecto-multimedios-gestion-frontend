import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useHistory } from '../../../../context/HistoryContext';
import type { EnrichedAppointment } from '../types/appointments.types';

// Owns the "Registrar atención" modal: diagnosis/treatment/observations form,
// its validation, and linking the visit into the patient's medical history.
export function useAttendAppointment(onAttended: (id: number, attendedAt: string) => void) {
  const navigate = useNavigate();
  const { linkAppointmentEntry } = useHistory();

  const [appointmentToAttend, setAppointmentToAttend] = useState<EnrichedAppointment | null>(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [observations, setObservations] = useState('');
  const [diagnosisError, setDiagnosisError] = useState('');

  const resetFields = () => {
    setDiagnosis('');
    setTreatment('');
    setObservations('');
    setDiagnosisError('');
  };

  const openAttend = (appt: EnrichedAppointment) => {
    resetFields();
    setAppointmentToAttend(appt);
  };

  const closeModal = () => {
    resetFields();
    setAppointmentToAttend(null);
  };

  const updateDiagnosis = (value: string) => {
    setDiagnosis(value);
    if (value.trim()) setDiagnosisError('');
  };

  const handleConfirm = () => {
    if (!appointmentToAttend) return;
    if (!diagnosis.trim()) {
      setDiagnosisError('El diagnóstico es obligatorio');
      return;
    }
    const now = new Date().toISOString();
    onAttended(appointmentToAttend.id, now);
    linkAppointmentEntry({
      id: 0,
      patient_id: appointmentToAttend.patient_id,
      consultation_date: now,
      doctor_id: appointmentToAttend.doctor_id,
      diagnosis: diagnosis.trim(),
      disease_id: null,
      treatment: treatment.trim(),
      observations: observations.trim(),
      medications: [],
    });
    const patientId = appointmentToAttend.patient_id;
    const patientName = appointmentToAttend.patient_name;
    toast.success('Cita marcada como atendida y vinculada al historial médico', {
      description: `Se creó un registro de atención para ${patientName}.`,
      action: {
        label: 'Ver historial',
        onClick: () => navigate(`/medical-history/${patientId}`),
      },
    });
    closeModal();
  };

  return {
    appointmentToAttend,
    diagnosis,
    treatment,
    observations,
    diagnosisError,
    openAttend,
    closeModal,
    updateDiagnosis,
    setTreatment,
    setObservations,
    handleConfirm,
  };
}
