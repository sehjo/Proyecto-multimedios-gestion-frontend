import PageContainer from '../../../components/PageContainer';
import PageHeader from '../../../components/PageHeader';
import { useDoctorOccupancyReport } from '../hooks/useDoctorOccupancyReport';
import {
  DoctorOccupancyInfoBanner,
  DoctorOccupancyFilterPanel,
  DoctorOccupancyStatsGrid,
  DoctorOccupancyResultsCard,
} from '../components';

export default function DoctorOccupancyPage() {
  const {
    filters, setFilters,
    specialtyFilter, setSpecialtyFilter,
    filteredRows, totals, overallDailyAvg,
    handleGenerate, handleApplySpecialtyFilter, handleClear,
  } = useDoctorOccupancyReport();

  return (
    <PageContainer>
      <PageHeader
        title="Reporte de ocupación por doctor"
        subtitle="Carga de trabajo del personal médico: citas asignadas, atendidas, canceladas y promedio diario por doctor."
      />
      <DoctorOccupancyInfoBanner />
      <DoctorOccupancyFilterPanel
        filters={filters}
        onFilterChange={setFilters}
        onGenerate={handleGenerate}
        onClear={handleClear}
      />
      <DoctorOccupancyStatsGrid totals={totals} overallDailyAvg={overallDailyAvg} />
      <DoctorOccupancyResultsCard
        rows={filteredRows}
        totals={totals}
        overallDailyAvg={overallDailyAvg}
        specialtyFilter={specialtyFilter}
        onSpecialtyFilterChange={setSpecialtyFilter}
        onApplySpecialtyFilter={handleApplySpecialtyFilter}
      />
    </PageContainer>
  );
}
