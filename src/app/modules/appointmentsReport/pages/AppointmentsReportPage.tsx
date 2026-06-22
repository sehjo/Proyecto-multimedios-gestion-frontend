import PageContainer from '../../../components/PageContainer';
import PageHeader from '../../../components/PageHeader';
import { useAppointmentsReport } from '../hooks/useAppointmentsReport';
import {
  AppointmentsReportFilterPanel,
  AppointmentsReportStatsGrid,
  AppointmentsReportResultsCard,
} from '../components';

export default function AppointmentsReportPage() {
  const {
    filters,
    setFilters,
    filtered,
    totalCount,
    attendedCount,
    cancelledCount,
    pendingCount,
    handleApply,
    handleClear,
  } = useAppointmentsReport();

  return (
    <PageContainer>
      <PageHeader
        title="Reporte de citas por período"
        subtitle="Análisis de la actividad de atención médica por rango de fechas y criterios seleccionados."
      />

      <AppointmentsReportFilterPanel
        filters={filters}
        onFilterChange={setFilters}
        onApply={handleApply}
        onClear={handleClear}
      />

      <AppointmentsReportStatsGrid
        totalCount={totalCount}
        attendedCount={attendedCount}
        cancelledCount={cancelledCount}
        pendingCount={pendingCount}
      />

      <AppointmentsReportResultsCard appointments={filtered} />
    </PageContainer>
  );
}
