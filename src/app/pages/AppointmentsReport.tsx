import { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  FileDown,
  FileSpreadsheet,
  Filter,
  RotateCcw,
  ChevronDown,
} from 'lucide-react';

const MOCK_DOCTORS = [
  { value: '', label: 'Todos los doctores' },
  { value: '1', label: 'Dr. Carlos Méndez' },
  { value: '2', label: 'Dra. Ana Rodríguez' },
  { value: '3', label: 'Dra. María Jiménez' },
  { value: '4', label: 'Dr. Luis Herrera' },
];

const MOCK_SPECIALTIES = [
  { value: '', label: 'Todas las especialidades' },
  { value: '1', label: 'Medicina General' },
  { value: '2', label: 'Cardiología' },
  { value: '3', label: 'Pediatría' },
  { value: '4', label: 'Ortopedia' },
  { value: '5', label: 'Ginecología' },
];

const MOCK_STATUSES = [
  { value: '', label: 'Todos los estados' },
  { value: 'attended', label: 'Atendida' },
  { value: 'cancelled', label: 'Cancelada' },
  { value: 'pending', label: 'Pendiente' },
];

const MOCK_APPOINTMENTS = [
  { id: 'CIT-001', patient: 'Juan Pérez Mora', doctor: 'Dr. Carlos Méndez', specialty: 'Medicina General', date: '01/06/2026', time: '08:00', status: 'attended' },
  { id: 'CIT-002', patient: 'María Castro López', doctor: 'Dra. María Jiménez', specialty: 'Pediatría', date: '01/06/2026', time: '09:30', status: 'attended' },
  { id: 'CIT-003', patient: 'Roberto Arias Vega', doctor: 'Dr. Luis Herrera', specialty: 'Ortopedia', date: '02/06/2026', time: '10:00', status: 'pending' },
  { id: 'CIT-004', patient: 'Laura Solís Quesada', doctor: 'Dra. Ana Rodríguez', specialty: 'Cardiología', date: '02/06/2026', time: '11:00', status: 'cancelled' },
  { id: 'CIT-005', patient: 'Diego Mora Blanco', doctor: 'Dr. Carlos Méndez', specialty: 'Medicina General', date: '03/06/2026', time: '08:30', status: 'attended' },
  { id: 'CIT-006', patient: 'Andrea Núñez Prado', doctor: 'Dra. María Jiménez', specialty: 'Ginecología', date: '03/06/2026', time: '14:00', status: 'attended' },
  { id: 'CIT-007', patient: 'Carlos Vargas Salas', doctor: 'Dr. Luis Herrera', specialty: 'Ortopedia', date: '04/06/2026', time: '09:00', status: 'cancelled' },
  { id: 'CIT-008', patient: 'Sofía Brenes Araya', doctor: 'Dra. Ana Rodríguez', specialty: 'Cardiología', date: '04/06/2026', time: '10:30', status: 'attended' },
  { id: 'CIT-009', patient: 'Andrés Montoya Cruz', doctor: 'Dr. Carlos Méndez', specialty: 'Medicina General', date: '05/06/2026', time: '15:00', status: 'pending' },
  { id: 'CIT-010', patient: 'Valeria Rojas Fonseca', doctor: 'Dra. María Jiménez', specialty: 'Pediatría', date: '06/06/2026', time: '08:00', status: 'attended' },
];

const STATUS_CONFIG: Record<string, { label: string; classes: string }> = {
  attended: { label: 'Atendida', classes: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Cancelada', classes: 'bg-red-100 text-red-700' },
  pending: { label: 'Pendiente', classes: 'bg-yellow-100 text-yellow-700' },
};

interface Filters {
  dateFrom: string;
  dateTo: string;
  doctor: string;
  specialty: string;
  status: string;
}

const DEFAULT_FILTERS: Filters = {
  dateFrom: '2026-06-01',
  dateTo: '2026-06-07',
  doctor: '',
  specialty: '',
  status: '',
};

export default function AppointmentsReport() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [resultsVisible, setResultsVisible] = useState(true);

  const handleApplyFilters = () => {
    setAppliedFilters({ ...filters });
    setResultsVisible(true);
  };

  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
    setResultsVisible(true);
  };

  const filteredAppointments = MOCK_APPOINTMENTS.filter((appt) => {
    if (appliedFilters.doctor) {
      const doctorName = MOCK_DOCTORS.find((d) => d.value === appliedFilters.doctor)?.label ?? '';
      if (appt.doctor !== doctorName) return false;
    }
    if (appliedFilters.specialty) {
      const specName = MOCK_SPECIALTIES.find((s) => s.value === appliedFilters.specialty)?.label ?? '';
      if (appt.specialty !== specName) return false;
    }
    if (appliedFilters.status && appt.status !== appliedFilters.status) return false;
    return true;
  });

  const totalCount = filteredAppointments.length;
  const attendedCount = filteredAppointments.filter((a) => a.status === 'attended').length;
  const cancelledCount = filteredAppointments.filter((a) => a.status === 'cancelled').length;
  const pendingCount = filteredAppointments.filter((a) => a.status === 'pending').length;

  return (
    <div className="app-page p-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">HU-046</span>
        </div>
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Reporte de citas por período</h1>
        <p className="text-gray-500 text-sm">Análisis de la actividad de atención médica por rango de fechas y criterios seleccionados.</p>
      </div>

      {/* Filter Panel */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-2 mb-5">
          <Filter className="w-4 h-4 text-blue-600" />
          <h2 className="text-base font-semibold text-gray-900">Panel de Filtros</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Date From */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Fecha inicio</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters((f) => ({ ...f, dateFrom: e.target.value }))}
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Date To */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Fecha fin</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters((f) => ({ ...f, dateTo: e.target.value }))}
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Doctor */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Doctor</label>
            <div className="relative">
              <select
                value={filters.doctor}
                onChange={(e) => setFilters((f) => ({ ...f, doctor: e.target.value }))}
                className="w-full appearance-none pl-3 pr-8 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {MOCK_DOCTORS.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Specialty */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Especialidad</label>
            <div className="relative">
              <select
                value={filters.specialty}
                onChange={(e) => setFilters((f) => ({ ...f, specialty: e.target.value }))}
                className="w-full appearance-none pl-3 pr-8 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {MOCK_SPECIALTIES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Estado</label>
            <div className="relative">
              <select
                value={filters.status}
                onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
                className="w-full appearance-none pl-3 pr-8 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {MOCK_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-5 pt-5 border-t border-gray-100">
          <button
            onClick={handleApplyFilters}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Filter className="w-4 h-4" />
            Aplicar filtros
          </button>
          <button
            onClick={handleClearFilters}
            className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-600 text-sm font-medium rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Limpiar
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {resultsVisible && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
            {/* Total */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Citas</p>
                  <p className="text-3xl font-bold text-gray-900">{totalCount}</p>
                  <p className="text-xs text-gray-400 mt-1.5">En el período seleccionado</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Attended */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Atendidas</p>
                  <p className="text-3xl font-bold text-green-600">{attendedCount}</p>
                  <p className="text-xs text-gray-400 mt-1.5">
                    {totalCount > 0 ? Math.round((attendedCount / totalCount) * 100) : 0}% del total
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            {/* Cancelled */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Canceladas</p>
                  <p className="text-3xl font-bold text-red-500">{cancelledCount}</p>
                  <p className="text-xs text-gray-400 mt-1.5">
                    {totalCount > 0 ? Math.round((cancelledCount / totalCount) * 100) : 0}% del total
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                  <XCircle className="w-6 h-6 text-red-500" />
                </div>
              </div>
            </div>

            {/* Pending */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Pendientes</p>
                  <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
                  <p className="text-xs text-gray-400 mt-1.5">
                    {totalCount > 0 ? Math.round((pendingCount / totalCount) * 100) : 0}% del total
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-yellow-50 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Results Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-gray-100">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Resultados</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {filteredAppointments.length} {filteredAppointments.length === 1 ? 'cita encontrada' : 'citas encontradas'}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="flex items-center gap-2 px-4 py-2 border border-red-200 hover:bg-red-50 text-red-600 text-sm font-medium rounded-lg transition-colors">
                  <FileDown className="w-4 h-4" />
                  Exportar PDF
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-green-200 hover:bg-green-50 text-green-700 text-sm font-medium rounded-lg transition-colors">
                  <FileSpreadsheet className="w-4 h-4" />
                  Exportar Excel
                </button>
              </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['ID', 'Paciente', 'Doctor', 'Especialidad', 'Fecha', 'Hora', 'Estado'].map((col) => (
                      <th key={col} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredAppointments.map((appt) => {
                    const statusCfg = STATUS_CONFIG[appt.status];
                    return (
                      <tr key={appt.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4 font-mono text-xs text-gray-500">{appt.id}</td>
                        <td className="px-5 py-4 font-medium text-gray-900">{appt.patient}</td>
                        <td className="px-5 py-4 text-gray-700">{appt.doctor}</td>
                        <td className="px-5 py-4 text-gray-600">{appt.specialty}</td>
                        <td className="px-5 py-4 text-gray-600">{appt.date}</td>
                        <td className="px-5 py-4 text-gray-600">{appt.time}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusCfg.classes}`}>
                            {statusCfg.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredAppointments.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-5 py-12 text-center text-sm text-gray-400">
                        No se encontraron citas con los filtros seleccionados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-100">
              {filteredAppointments.map((appt) => {
                const statusCfg = STATUS_CONFIG[appt.status];
                return (
                  <div key={appt.id} className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900 text-sm">{appt.patient}</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${statusCfg.classes}`}>
                        {statusCfg.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{appt.doctor} — {appt.specialty}</p>
                    <p className="text-xs text-gray-400">{appt.date} a las {appt.time}</p>
                    <p className="font-mono text-xs text-gray-300">{appt.id}</p>
                  </div>
                );
              })}
              {filteredAppointments.length === 0 && (
                <div className="p-8 text-center text-sm text-gray-400">
                  No se encontraron citas con los filtros seleccionados.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
