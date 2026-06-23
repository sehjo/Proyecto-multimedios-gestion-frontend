import PageContainer from '../../../components/PageContainer';
import PageHeader from '../../../components/PageHeader';
import { useAppointments } from '../hooks/useAppointments';
import { useNewAppointmentForm } from '../hooks/useNewAppointmentForm';
import { useOpenCreateFromQuery } from '../hooks/useOpenCreateFromQuery';
import { useAttendAppointment } from '../hooks/useAttendAppointment';
import { useCancelAppointment } from '../hooks/useCancelAppointment';
import { useRescheduleAppointment } from '../hooks/useRescheduleAppointment';
import {
  NewAppointmentButton,
  AppointmentsFilterBar,
  AppointmentsTable,
  NewAppointmentModal,
  AttendAppointmentModal,
  CancelAppointmentModal,
  RescheduleAppointmentModal,
} from '../components';

const today = new Date().toISOString().split('T')[0];

export default function AppointmentsPage() {
  const {
    appointments,
    patients,
    doctors,
    filterDoctor,
    setFilterDoctor,
    filterDate,
    setFilterDate,
    filterStatus,
    setFilterStatus,
    hasActiveFilters,
    clearFilters,
    filteredAppointments,
    addAppointment,
    markAttended,
    markCancelled,
    markRescheduled,
  } = useAppointments();

  const newForm = useNewAppointmentForm(appointments, doctors, addAppointment);
  useOpenCreateFromQuery(newForm.openCreate);

  const attend = useAttendAppointment(markAttended);
  const cancel = useCancelAppointment(markCancelled);
  const reschedule = useRescheduleAppointment(appointments, markRescheduled);

  return (
    <PageContainer>
      <PageHeader title="Citas" subtitle="Gestión de citas médicas">
        <NewAppointmentButton onClick={newForm.openCreate} />
      </PageHeader>

      <AppointmentsFilterBar
        doctors={doctors}
        filterDoctor={filterDoctor}
        onFilterDoctorChange={setFilterDoctor}
        filterDate={filterDate}
        onFilterDateChange={setFilterDate}
        filterStatus={filterStatus}
        onFilterStatusChange={setFilterStatus}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearFilters}
        filteredCount={filteredAppointments.length}
        totalCount={appointments.length}
      />

      <AppointmentsTable
        appointments={filteredAppointments}
        onAttend={attend.openAttend}
        onReschedule={reschedule.openReschedule}
        onCancel={cancel.openCancel}
      />

      {newForm.showModal && (
        <NewAppointmentModal
          formData={newForm.formData}
          patients={patients}
          doctors={doctors}
          availableSlots={newForm.availableSlots}
          today={today}
          onFieldChange={newForm.updateField}
          onDoctorChange={newForm.handleDoctorChange}
          onCancel={newForm.closeModal}
          onSubmit={newForm.handleSubmit}
        />
      )}

      {attend.appointmentToAttend && (
        <AttendAppointmentModal
          appointment={attend.appointmentToAttend}
          diagnosis={attend.diagnosis}
          treatment={attend.treatment}
          observations={attend.observations}
          diagnosisError={attend.diagnosisError}
          onDiagnosisChange={attend.updateDiagnosis}
          onTreatmentChange={attend.setTreatment}
          onObservationsChange={attend.setObservations}
          onCancel={attend.closeModal}
          onConfirm={attend.handleConfirm}
        />
      )}

      {reschedule.appointmentToReschedule && (
        <RescheduleAppointmentModal
          appointment={reschedule.appointmentToReschedule}
          rescheduleDate={reschedule.rescheduleDate}
          rescheduleTime={reschedule.rescheduleTime}
          availableSlots={reschedule.availableSlots}
          today={today}
          onDateChange={reschedule.setRescheduleDate}
          onTimeChange={reschedule.setRescheduleTime}
          onCancel={reschedule.closeModal}
          onConfirm={reschedule.handleConfirm}
        />
      )}

      {cancel.appointmentToCancel && (
        <CancelAppointmentModal
          appointment={cancel.appointmentToCancel}
          cancelReason={cancel.cancelReason}
          onReasonChange={cancel.setCancelReason}
          onCancel={cancel.closeModal}
          onConfirm={cancel.handleConfirm}
        />
      )}
    </PageContainer>
  );
}
