import PageContainer from '../../../components/PageContainer';
import PageHeader from '../../../components/PageHeader';
import { usePatientsReport } from '../hooks/usePatientsReport';
import {
  PatientsReportInfoBanner,
  PatientsReportFilterPanel,
  PatientsReportStatsGrid,
  PatientsReportResultsCard,
} from '../components';

export default function PatientsReportPage() {
  const { filters, setFilters, filteredRows, totals, handleGenerate, handleClear } = usePatientsReport();

  return (
    <PageContainer>
      <PageHeader
        title="Reporte de pacientes atendidos"
        subtitle="Análisis de pacientes únicos, nuevos y recurrentes por doctor y especialidad en el período seleccionado."
      />
      <PatientsReportInfoBanner />
      <PatientsReportFilterPanel
        filters={filters}
        onFilterChange={setFilters}
        onGenerate={handleGenerate}
        onClear={handleClear}
      />
      <PatientsReportStatsGrid totals={totals} />
      <PatientsReportResultsCard rows={filteredRows} totals={totals} />
    </PageContainer>
  );
}
