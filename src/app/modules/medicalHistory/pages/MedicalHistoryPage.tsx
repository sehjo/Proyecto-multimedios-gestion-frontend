import { useNavigate } from 'react-router';
import PageContainer from '../../../components/PageContainer';
import PageHeader from '../../../components/PageHeader';
import { useMedicalHistoryPatients } from '../hooks/useMedicalHistoryPatients';
import { PatientsSearchBar, PatientsTable, PatientsEmptyState } from '../components';
import type { Patient } from '../types/medicalHistory.types';

export default function MedicalHistoryPage() {
  const navigate = useNavigate();
  const { searchTerm, setSearchTerm, filteredPatients } = useMedicalHistoryPatients();

  const showEmptyState = filteredPatients.length === 0 && !searchTerm;

  const viewHistory = (patient: Patient) => navigate(`/medical-history/${patient.id}`);

  return (
    <PageContainer>
      <PageHeader title="Historial Médico" subtitle="Consulta el historial médico completo de cada paciente" />
      <PatientsSearchBar value={searchTerm} onChange={setSearchTerm} />
      {showEmptyState ? (
        <PatientsEmptyState />
      ) : (
        <PatientsTable patients={filteredPatients} onView={viewHistory} />
      )}
    </PageContainer>
  );
}
