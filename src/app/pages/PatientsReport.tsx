import { useState } from 'react';
import {
  Users,
  UserPlus,
  UserCheck,
  CalendarDays,
  FileDown,
  RotateCcw,
  ChevronDown,
  PlayCircle,
  Info,
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

interface ReportRow {
  doctor: string;
  specialty: string;
  uniquePatients: number;
  consultations: number;
  newPatients: number;
  recurringPatients: number;
}

const FULL_REPORT_DATA: ReportRow[] = [
  { doctor: 'Dr. Carlos Méndez',  specialty: 'Medicina General', uniquePatients: 8, consultations: 12, newPatients: 3, recurringPatients: 5 },
  { doctor: 'Dra. Ana Rodríguez', specialty: 'Cardiología',      uniquePatients: 5, consultations: 7,  newPatients: 2, recurringPatients: 3 },
  { doctor: 'Dra. María Jiménez', specialty: 'Pediatría',        uniquePatients: 6, consultations: 9,  newPatients: 4, recurringPatients: 2 },
  { doctor: 'Dr. Luis Herrera',   specialty: 'Ortopedia',        uniquePatients: 4, consultations: 5,  newPatients: 1, recurringPatients: 3 },
  { doctor: 'Dra. María Jiménez', specialty: 'Ginecología',      uniquePatients: 3, consultations: 4,  newPatients: 2, recurringPatients: 1 },
];

interface Filters {
  dateFrom: string;
  dateTo: string;
  doctor: string;
  specialty: string;
}

const DEFAULT_FILTERS: Filters = {
  dateFrom: '2026-06-01',
  dateTo: '2026-06-07',
  doctor: '',
  specialty: '',
};

export default function PatientsReport() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [resultsVisible, setResultsVisible] = useState(true);

  const handleGenerateReport = () => {
    setAppliedFilters({ ...filters });
    setResultsVisible(true);
  };

  const handleClear = () => {
    setFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
    setResultsVisible(true);
  };

  const filteredRows = FULL_REPORT_DATA.filter((row) => {
    if (appliedFilters.doctor) {
      const name = MOCK_DOCTORS.find((d) => d.value === appliedFilters.doctor)?.label ?? '';
      if (row.doctor !== name) return false;
    }
    if (appliedFilters.specialty) {
      const name = MOCK_SPECIALTIES.find((s) => s.value === appliedFilters.specialty)?.label ?? '';
      if (row.specialty !== name) return false;
    }
    return true;
  });

  const totals = filteredRows.reduce(
    (acc, row) => ({
      uniquePatients: acc.uniquePatients + row.uniquePatients,
      consultations: acc.consultations + row.consultations,
      newPatients: acc.newPatients + row.newPatients,
      recurringPatients: acc.recurringPatients + row.recurringPatients,
    }),
    { uniquePatients: 0, consultations: 0, newPatients: 0, recurringPatients: 0 }
  );

  return (
    <div className="app-page p-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">HU-047</span>
        </div>
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Reporte de pacientes atendidos</h1>
        <p className="text-gray-500 text-sm">Alcance de la atención médica: pacientes únicos por médico y especialidad, diferenciando nuevos de recurrentes.</p>
      </div>

      {/* Info note */}
      <div className="flex items-start gap-2.5 px-4 py-3 bg-blue-50 border border-blue-100 rounded-lg mb-6 text-sm text-blue-700">
        <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <span>
          Un paciente que tuvo múltiples consultas con el mismo médico cuenta como <strong>1 paciente único</strong>.
          Se considera <strong>nuevo</strong> si su primera cita registrada cae dentro del rango seleccionado.
        </span>
      </div>

      {/* Filter Panel */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-2 mb-5">
          <CalendarDays className="w-4 h-4 text-blue-600" />
          <h2 className="text-base font-semibold text-gray-900">Parámetros del Reporte</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Date From */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Fecha inicio</label>
            <div className="relative">
              <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
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
              <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
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
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-5 pt-5 border-t border-gray-100">
          <button
            onClick={handleGenerateReport}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <PlayCircle className="w-4 h-4" />
            Generar reporte
          </button>
          <button
            onClick={handleClear}
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
            {/* Total unique patients */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Pacientes Atendidos</p>
                  <p className="text-3xl font-bold text-gray-900">{totals.uniquePatients}</p>
                  <p className="text-xs text-gray-400 mt-1.5">Pacientes únicos</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            {/* New patients */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Pacientes Nuevos</p>
                  <p className="text-3xl font-bold text-green-600">{totals.newPatients}</p>
                  <p className="text-xs text-gray-400 mt-1.5">Primera cita en el período</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                  <UserPlus className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            {/* Recurring patients */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Pacientes Recurrentes</p>
                  <p className="text-3xl font-bold text-purple-600">{totals.recurringPatients}</p>
                  <p className="text-xs text-gray-400 mt-1.5">Con historial previo</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                  <UserCheck className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Total consultations */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Consultas</p>
                  <p className="text-3xl font-bold text-orange-500">{totals.consultations}</p>
                  <p className="text-xs text-gray-400 mt-1.5">Incluyendo repetidas</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                  <CalendarDays className="w-6 h-6 text-orange-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Results Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-gray-100">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Atendidos por Doctor / Especialidad</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {filteredRows.length} {filteredRows.length === 1 ? 'combinación encontrada' : 'combinaciones encontradas'}
                </p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-red-200 hover:bg-red-50 text-red-600 text-sm font-medium rounded-lg transition-colors self-start sm:self-auto">
                <FileDown className="w-4 h-4" />
                Exportar PDF
              </button>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {[
                      'Doctor',
                      'Especialidad',
                      'Pacientes Únicos',
                      'Total Consultas',
                      'Nuevos',
                      'Recurrentes',
                    ].map((col) => (
                      <th
                        key={col}
                        className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredRows.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 font-medium text-gray-900">{row.doctor}</td>
                      <td className="px-5 py-4 text-gray-600">{row.specialty}</td>
                      <td className="px-5 py-4">
                        <span className="font-semibold text-blue-600">{row.uniquePatients}</span>
                      </td>
                      <td className="px-5 py-4 text-gray-700">{row.consultations}</td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          <UserPlus className="w-3 h-3" />
                          {row.newPatients}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                          <UserCheck className="w-3 h-3" />
                          {row.recurringPatients}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {filteredRows.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-5 py-12 text-center text-sm text-gray-400">
                        No se encontraron datos con los parámetros seleccionados.
                      </td>
                    </tr>
                  )}

                  {/* Totals row */}
                  {filteredRows.length > 0 && (
                    <tr className="bg-gray-50 border-t-2 border-gray-200">
                      <td className="px-5 py-4 font-bold text-gray-900" colSpan={2}>
                        Total general
                      </td>
                      <td className="px-5 py-4 font-bold text-blue-600">{totals.uniquePatients}</td>
                      <td className="px-5 py-4 font-bold text-gray-900">{totals.consultations}</td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                          <UserPlus className="w-3 h-3" />
                          {totals.newPatients}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700">
                          <UserCheck className="w-3 h-3" />
                          {totals.recurringPatients}
                        </span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-100">
              {filteredRows.map((row, i) => (
                <div key={i} className="p-4 space-y-3">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{row.doctor}</p>
                    <p className="text-xs text-gray-500">{row.specialty}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-blue-50 rounded-lg p-2 text-center">
                      <p className="text-gray-500">Únicos</p>
                      <p className="font-bold text-blue-600 text-base">{row.uniquePatients}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                      <p className="text-gray-500">Consultas</p>
                      <p className="font-bold text-gray-700 text-base">{row.consultations}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-2 text-center">
                      <p className="text-green-600">Nuevos</p>
                      <p className="font-bold text-green-700 text-base">{row.newPatients}</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-2 text-center">
                      <p className="text-purple-600">Recurrentes</p>
                      <p className="font-bold text-purple-700 text-base">{row.recurringPatients}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Mobile totals */}
              {filteredRows.length > 0 && (
                <div className="p-4 bg-gray-50 space-y-2">
                  <p className="font-bold text-gray-900 text-sm">Total general</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-blue-100 rounded-lg p-2 text-center">
                      <p className="text-gray-500">Únicos</p>
                      <p className="font-bold text-blue-700 text-base">{totals.uniquePatients}</p>
                    </div>
                    <div className="bg-gray-200 rounded-lg p-2 text-center">
                      <p className="text-gray-500">Consultas</p>
                      <p className="font-bold text-gray-800 text-base">{totals.consultations}</p>
                    </div>
                    <div className="bg-green-100 rounded-lg p-2 text-center">
                      <p className="text-green-700">Nuevos</p>
                      <p className="font-bold text-green-800 text-base">{totals.newPatients}</p>
                    </div>
                    <div className="bg-purple-100 rounded-lg p-2 text-center">
                      <p className="text-purple-700">Recurrentes</p>
                      <p className="font-bold text-purple-800 text-base">{totals.recurringPatients}</p>
                    </div>
                  </div>
                </div>
              )}

              {filteredRows.length === 0 && (
                <div className="p-8 text-center text-sm text-gray-400">
                  No se encontraron datos con los parámetros seleccionados.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
