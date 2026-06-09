import { useState } from 'react';
import {
  CalendarDays,
  FileDown,
  RotateCcw,
  ChevronDown,
  PlayCircle,
  Info,
  Stethoscope,
  CheckCircle2,
  XCircle,
  BarChart3,
  Filter,
} from 'lucide-react';

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
  specialtyValue: string;
  assigned: number;
  attended: number;
  cancelled: number;
  dailyAverage: number;
}

const FULL_REPORT_DATA: ReportRow[] = [
  {
    doctor: 'Dr. Carlos Méndez',
    specialty: 'Medicina General',
    specialtyValue: '1',
    assigned: 294,
    attended: 270,
    cancelled: 24,
    dailyAverage: 4.9,
  },
  {
    doctor: 'Dra. Ana Rodríguez',
    specialty: 'Cardiología',
    specialtyValue: '2',
    assigned: 180,
    attended: 162,
    cancelled: 18,
    dailyAverage: 3.0,
  },
  {
    doctor: 'Dra. María Jiménez',
    specialty: 'Pediatría',
    specialtyValue: '3',
    assigned: 210,
    attended: 188,
    cancelled: 22,
    dailyAverage: 3.5,
  },
  {
    doctor: 'Dr. Luis Herrera',
    specialty: 'Ortopedia',
    specialtyValue: '4',
    assigned: 156,
    attended: 130,
    cancelled: 26,
    dailyAverage: 2.6,
  },
  {
    doctor: 'Dra. Laura Torres',
    specialty: 'Ginecología',
    specialtyValue: '5',
    assigned: 0,
    attended: 0,
    cancelled: 0,
    dailyAverage: 0.0,
  },
];

interface Filters {
  dateFrom: string;
  dateTo: string;
  specialty: string;
}

const DEFAULT_FILTERS: Filters = {
  dateFrom: '2026-04-10',
  dateTo: '2026-06-09',
  specialty: '',
};

export default function DoctorOccupancyReport() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [resultsVisible, setResultsVisible] = useState(true);

  const handleGenerateReport = () => {
    setAppliedFilters({ ...filters });
    setSpecialtyFilter('');
    setResultsVisible(true);
  };

  const handleApplySpecialtyFilter = () => {
    setAppliedFilters((prev) => ({ ...prev, specialty: specialtyFilter }));
  };

  const handleClear = () => {
    setFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
    setSpecialtyFilter('');
    setResultsVisible(true);
  };

  const filteredRows = FULL_REPORT_DATA.filter((row) => {
    if (appliedFilters.specialty) {
      if (row.specialtyValue !== appliedFilters.specialty) return false;
    }
    return true;
  });

  const totals = filteredRows.reduce(
    (acc, row) => ({
      assigned: acc.assigned + row.assigned,
      attended: acc.attended + row.attended,
      cancelled: acc.cancelled + row.cancelled,
    }),
    { assigned: 0, attended: 0, cancelled: 0 }
  );

  const overallDailyAvg =
    filteredRows.length > 0
      ? (totals.assigned / 60).toFixed(1)
      : '0.0';

  return (
    <div className="app-page p-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">HU-048</span>
        </div>
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Reporte de ocupación por doctor</h1>
        <p className="text-gray-500 text-sm">
          Carga de trabajo del personal médico: citas asignadas, atendidas, canceladas y promedio diario por doctor.
        </p>
      </div>

      {/* Info note */}
      <div className="flex items-start gap-2.5 px-4 py-3 bg-blue-50 border border-blue-100 rounded-lg mb-6 text-sm text-blue-700">
        <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <span>
          El rango de fechas debe cubrir <strong>mínimo 60 días</strong> de historial para asegurar promedios
          representativos. El <strong>Promedio Diario</strong> se calcula dividiendo las citas asignadas entre los días del período.
        </span>
      </div>

      {/* Filter Panel */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-2 mb-5">
          <CalendarDays className="w-4 h-4 text-blue-600" />
          <h2 className="text-base font-semibold text-gray-900">Parámetros del Reporte</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

      {/* Results */}
      {resultsVisible && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Citas Asignadas</p>
                  <p className="text-3xl font-bold text-gray-900">{totals.assigned}</p>
                  <p className="text-xs text-gray-400 mt-1.5">Total en el período</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <Stethoscope className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Citas Atendidas</p>
                  <p className="text-3xl font-bold text-green-600">{totals.attended}</p>
                  <p className="text-xs text-gray-400 mt-1.5">Consultas completadas</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Citas Canceladas</p>
                  <p className="text-3xl font-bold text-red-500">{totals.cancelled}</p>
                  <p className="text-xs text-gray-400 mt-1.5">No realizadas</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                  <XCircle className="w-6 h-6 text-red-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Promedio Diario</p>
                  <p className="text-3xl font-bold text-orange-500">{overallDailyAvg}</p>
                  <p className="text-xs text-gray-400 mt-1.5">Citas / día (promedio)</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                  <BarChart3 className="w-6 h-6 text-orange-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Results Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-gray-100">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Ocupación por Doctor</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {filteredRows.length} {filteredRows.length === 1 ? 'doctor encontrado' : 'doctores encontrados'}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {/* Specialty filter */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <select
                      value={specialtyFilter}
                      onChange={(e) => setSpecialtyFilter(e.target.value)}
                      className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {MOCK_SPECIALTIES.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                  </div>
                  <button
                    onClick={handleApplySpecialtyFilter}
                    className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                  >
                    <Filter className="w-3.5 h-3.5" />
                    Aplicar filtro
                  </button>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-red-200 hover:bg-red-50 text-red-600 text-sm font-medium rounded-lg transition-colors">
                  <FileDown className="w-4 h-4" />
                  Exportar PDF
                </button>
              </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {[
                      'Doctor',
                      'Especialidad',
                      'Citas Asignadas',
                      'Atendidas',
                      'Canceladas',
                      'Promedio Diario',
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
                        {row.assigned === 0 ? (
                          <span className="text-gray-400 text-xs italic">Sin citas</span>
                        ) : (
                          <span className="font-semibold text-blue-600">{row.assigned}</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {row.attended === 0 && row.assigned === 0 ? (
                          <span className="text-gray-400">—</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            <CheckCircle2 className="w-3 h-3" />
                            {row.attended}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {row.cancelled === 0 && row.assigned === 0 ? (
                          <span className="text-gray-400">—</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-600">
                            <XCircle className="w-3 h-3" />
                            {row.cancelled}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {row.assigned === 0 ? (
                          <span className="text-gray-400 text-xs italic">N/A</span>
                        ) : (
                          <span className="font-semibold text-orange-500">{row.dailyAverage.toFixed(1)}</span>
                        )}
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
                      <td className="px-5 py-4 font-bold text-blue-600">{totals.assigned}</td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                          <CheckCircle2 className="w-3 h-3" />
                          {totals.attended}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-600">
                          <XCircle className="w-3 h-3" />
                          {totals.cancelled}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-bold text-orange-500">{overallDailyAvg}</td>
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
                  {row.assigned === 0 ? (
                    <p className="text-xs text-gray-400 italic">Este doctor no tiene citas registradas en el período.</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-blue-50 rounded-lg p-2 text-center">
                        <p className="text-gray-500">Asignadas</p>
                        <p className="font-bold text-blue-600 text-base">{row.assigned}</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-2 text-center">
                        <p className="text-green-600">Atendidas</p>
                        <p className="font-bold text-green-700 text-base">{row.attended}</p>
                      </div>
                      <div className="bg-red-50 rounded-lg p-2 text-center">
                        <p className="text-red-500">Canceladas</p>
                        <p className="font-bold text-red-600 text-base">{row.cancelled}</p>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-2 text-center">
                        <p className="text-orange-500">Prom. Diario</p>
                        <p className="font-bold text-orange-600 text-base">{row.dailyAverage.toFixed(1)}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Mobile totals */}
              {filteredRows.length > 0 && (
                <div className="p-4 bg-gray-50 space-y-2">
                  <p className="font-bold text-gray-900 text-sm">Total general</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-blue-100 rounded-lg p-2 text-center">
                      <p className="text-gray-500">Asignadas</p>
                      <p className="font-bold text-blue-700 text-base">{totals.assigned}</p>
                    </div>
                    <div className="bg-green-100 rounded-lg p-2 text-center">
                      <p className="text-green-700">Atendidas</p>
                      <p className="font-bold text-green-800 text-base">{totals.attended}</p>
                    </div>
                    <div className="bg-red-100 rounded-lg p-2 text-center">
                      <p className="text-red-600">Canceladas</p>
                      <p className="font-bold text-red-700 text-base">{totals.cancelled}</p>
                    </div>
                    <div className="bg-orange-100 rounded-lg p-2 text-center">
                      <p className="text-orange-600">Prom. Diario</p>
                      <p className="font-bold text-orange-700 text-base">{overallDailyAvg}</p>
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
