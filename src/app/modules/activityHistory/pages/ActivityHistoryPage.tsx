import PageContainer from '../../../components/PageContainer';
import PageHeader from '../../../components/PageHeader';
import { useActivityHistory } from '../hooks/useActivityHistory';
import {
  ActivityInfoBanner,
  ActivityFilterPanel,
  ActivityResultsSection,
} from '../components';

export default function ActivityHistoryPage() {
  const {
    draftFilters,
    setDraftFilters,
    filtered,
    paginated,
    page,
    setPage,
    totalPages,
    isFiltered,
    handleApply,
    handleClear,
  } = useActivityHistory();

  return (
    <PageContainer>
      <PageHeader
        title="Historial de actividades del sistema"
        subtitle="Bitácora de auditoría: registro de acciones críticas, usuarios y módulos para el seguimiento administrativo."
      />

      <ActivityInfoBanner />

      <ActivityFilterPanel
        filters={draftFilters}
        onFilterChange={setDraftFilters}
        onApply={handleApply}
        onClear={handleClear}
      />

      <ActivityResultsSection
        filtered={filtered}
        paginated={paginated}
        page={page}
        totalPages={totalPages}
        isFiltered={isFiltered}
        onPageChange={setPage}
      />
    </PageContainer>
  );
}
