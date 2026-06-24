import { Fragment } from 'react';
import PageContainer from '../../../components/PageContainer';
import PageHeader from '../../../components/PageHeader';
import {
  AgendaFilterBar,
  AgendaToolbar,
  AgendaWorkspace,
  AppointmentTooltipCard,
  DayView,
  ListView,
  MiniCalendar,
  MonthView,
  MoveAppointmentModal,
  StatusLegend,
  WeekView,
} from '../components';
import { useAgendaFilters } from '../hooks/useAgendaFilters';
import { useAgendaView } from '../hooks/useAgendaView';
import { useAppointmentDragDrop } from '../hooks/useAppointmentDragDrop';
import { useAppointmentTooltip } from '../hooks/useAppointmentTooltip';

export default function AgendaPage() {
  const filters = useAgendaFilters();
  const view = useAgendaView(filters.allAppts);
  const dragDrop = useAppointmentDragDrop();
  const tooltipState = useAppointmentTooltip();

  return (
    <PageContainer onClick={tooltipState.clearTooltip}>
      <PageHeader title="Agenda Médica" subtitle="Consulta y gestión de citas por doctor" />

      <AgendaFilterBar
        filteredDoctors={filters.filteredDoctors}
        selectedDoctor={filters.selectedDoctor}
        onDoctorChange={filters.setSelectedDoctor}
        selectedSpecialty={filters.selectedSpecialty}
        onSpecialtyChange={filters.setSelectedSpecialty}
        selectedBranch={filters.selectedBranch}
        onBranchChange={filters.setSelectedBranch}
        selectedDoctorInfo={filters.selectedDoctorInfo}
      />

      <AgendaWorkspace
        sidebar={
          <Fragment>
            <MiniCalendar allAppts={filters.allAppts} onSelectDay={view.goToDay} />
            <StatusLegend />
          </Fragment>
        }
      >
        <AgendaToolbar
          viewMode={view.viewMode}
          onViewModeChange={view.setViewMode}
          periodLabel={view.periodLabel}
        />

        {view.viewMode === 'day' && (
          <DayView
            appointments={view.dayAppts}
            selectedDate={view.selectedDate}
            onDragStart={dragDrop.handleDragStart}
            onDrop={dragDrop.handleDrop}
            onHover={tooltipState.handleHover}
            onLeave={tooltipState.handleLeave}
          />
        )}
        {view.viewMode === 'week' && (
          <WeekView
            weekAppts={view.weekAppts}
            onDragStart={dragDrop.handleDragStart}
            onDrop={dragDrop.handleDrop}
            onHover={tooltipState.handleHover}
            onLeave={tooltipState.handleLeave}
          />
        )}
        {view.viewMode === 'month' && (
          <MonthView
            appointments={filters.allAppts}
            onHover={tooltipState.handleHover}
            onLeave={tooltipState.handleLeave}
          />
        )}
        {view.viewMode === 'list' && (
          <ListView
            appointments={filters.allAppts}
            onHover={tooltipState.handleHover}
            onLeave={tooltipState.handleLeave}
          />
        )}
      </AgendaWorkspace>

      {tooltipState.tooltip && <AppointmentTooltipCard tooltip={tooltipState.tooltip} />}

      {dragDrop.pendingDrop && (
        <MoveAppointmentModal
          pendingDrop={dragDrop.pendingDrop}
          onCancel={dragDrop.cancelDrop}
          onConfirm={dragDrop.confirmDrop}
        />
      )}
    </PageContainer>
  );
}
