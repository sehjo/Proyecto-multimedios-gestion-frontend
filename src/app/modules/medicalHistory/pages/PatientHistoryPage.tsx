import { useParams } from 'react-router';
import PageContainer from '../../../components/PageContainer';
import { usePatientHistory } from '../hooks/usePatientHistory';
import { useHistoryFilters } from '../hooks/useHistoryFilters';
import { useHistoryEntryForm } from '../hooks/useHistoryEntryForm';
import {
  PatientHistoryBreadcrumb,
  PatientHistoryHeader,
  PatientHistoryFilters,
  HistoryTimeline,
  HistoryEmptyState,
  HistoryEntryForm,
  HistoryEntryFormModal,
  PatientNotFound,
} from '../components';

export default function PatientHistoryPage() {
  const { patientId } = useParams();
  const id = Number(patientId);

  const history = usePatientHistory(id);
  const filters = useHistoryFilters(history.entries, history.getDoctorName);
  const entryForm = useHistoryEntryForm({
    canEdit: history.canEdit,
    onSubmit: history.applyEntry,
  });

  if (!history.patient) {
    return (
      <PageContainer>
        <PatientNotFound />
      </PageContainer>
    );
  }

  const doctorLabel = entryForm.editingEntry
    ? history.getDoctorName(entryForm.editingEntry.doctor_id)
    : history.currentDoctorName;

  return (
    <PageContainer>
      <PatientHistoryBreadcrumb patient={history.patient} />
      <PatientHistoryHeader patient={history.patient} onCreate={entryForm.openCreate} />
      <PatientHistoryFilters
        dateFrom={filters.dateFrom}
        onDateFromChange={filters.setDateFrom}
        dateTo={filters.dateTo}
        onDateToChange={filters.setDateTo}
        doctorSearch={filters.doctorSearch}
        onDoctorSearchChange={filters.setDoctorSearch}
        diagnosisSearch={filters.diagnosisSearch}
        onDiagnosisSearchChange={filters.setDiagnosisSearch}
      />

      {history.entries.length === 0 ? (
        <HistoryEmptyState variant="no-entries" onCreate={entryForm.openCreate} />
      ) : filters.filteredEntries.length === 0 ? (
        <HistoryEmptyState variant="no-results" />
      ) : (
        <HistoryTimeline
          entries={filters.filteredEntries}
          getDoctorName={history.getDoctorName}
          onEdit={entryForm.openEdit}
        />
      )}

      {entryForm.showModal && (
        <HistoryEntryFormModal
          title={entryForm.editingEntry ? 'Editar registro' : 'Nuevo registro'}
          submitLabel={entryForm.editingEntry ? 'Guardar cambios' : 'Guardar registro'}
          onClose={entryForm.closeModal}
          onSubmit={entryForm.handleSubmit}
        >
          <HistoryEntryForm
            formData={entryForm.formData}
            errors={entryForm.errors}
            doctorLabel={doctorLabel}
            diseases={entryForm.diseases}
            onFieldChange={entryForm.updateField}
            onDiseaseSelect={entryForm.handleDiseaseSelect}
            meds={entryForm.meds}
            medErrors={entryForm.medErrors}
            drugs={entryForm.drugs}
            onAddMed={entryForm.addMed}
            onRemoveMed={entryForm.removeMed}
            onUpdateMed={entryForm.updateMed}
            onCatalogSelect={entryForm.handleCatalogSelect}
          />
        </HistoryEntryFormModal>
      )}
    </PageContainer>
  );
}
