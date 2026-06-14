import { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Info,
  Search,
  RotateCcw,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LogIn,
  LogOut,
  FileDown,
  PlusCircle,
  Pencil,
  Trash2,
} from 'lucide-react';

const ACTION_TYPES = [
  { value: '', label: 'Todas las acciones' },
  { value: 'Inicio de sesión', label: 'Inicio de sesión' },
  { value: 'Cierre de sesión', label: 'Cierre de sesión' },
  { value: 'Creación', label: 'Creación' },
  { value: 'Edición', label: 'Edición' },
  { value: 'Eliminación', label: 'Eliminación' },
  { value: 'Exportación', label: 'Exportación' },
];

const MODULES = [
  { value: '', label: 'Todos los módulos' },
  { value: 'Pacientes', label: 'Pacientes' },
  { value: 'Citas', label: 'Citas' },
  { value: 'Historial Médico', label: 'Historial Médico' },
  { value: 'Usuarios', label: 'Usuarios' },
  { value: 'Autenticación', label: 'Autenticación' },
  { value: 'Reportes', label: 'Reportes' },
];

interface ActivityEntry {
  id: number;
  user: string;
  role: string;
  action: string;
  module: string;
  date: string;
  time: string;
  details: string;
  result: 'Exitoso' | 'Fallido';
}

const MOCK_ACTIVITIES: ActivityEntry[] = [
  { id: 1,  user: 'Ricardo Solano',  role: 'Doctor',         action: 'Inicio de sesión', module: 'Autenticación',   date: '2026-06-09', time: '07:02', details: 'Acceso desde IP 192.168.1.10',                 result: 'Exitoso' },
  { id: 2,  user: 'Elena Mora',      role: 'Doctor',         action: 'Inicio de sesión', module: 'Autenticación',   date: '2026-06-09', time: '07:15', details: 'Acceso desde IP 192.168.1.22',                 result: 'Exitoso' },
  { id: 3,  user: 'Admin Sistema',   role: 'Administrador',  action: 'Creación',         module: 'Usuarios',        date: '2026-06-09', time: '08:30', details: 'Nuevo usuario: Dra. Laura Torres',             result: 'Exitoso' },
  { id: 4,  user: 'Ricardo Solano',  role: 'Doctor',         action: 'Creación',         module: 'Pacientes',       date: '2026-06-09', time: '08:45', details: 'Paciente: Jorge Ramírez (ID 5)',               result: 'Exitoso' },
  { id: 5,  user: 'Elena Mora',      role: 'Doctor',         action: 'Edición',          module: 'Historial Médico',date: '2026-06-09', time: '09:10', details: 'Consulta ID 4 – María González',               result: 'Exitoso' },
  { id: 6,  user: 'Andrés Castro',   role: 'Doctor',         action: 'Inicio de sesión', module: 'Autenticación',   date: '2026-06-09', time: '09:20', details: 'Acceso desde IP 192.168.1.35',                 result: 'Exitoso' },
  { id: 7,  user: 'Admin Sistema',   role: 'Administrador',  action: 'Exportación',      module: 'Reportes',        date: '2026-06-09', time: '09:45', details: 'Reporte de pacientes atendidos (PDF)',         result: 'Exitoso' },
  { id: 8,  user: 'Ricardo Solano',  role: 'Doctor',         action: 'Creación',         module: 'Citas',           date: '2026-06-09', time: '10:00', details: 'Cita asignada: Carlos Méndez – 10 jun',        result: 'Exitoso' },
  { id: 9,  user: 'Elena Mora',      role: 'Doctor',         action: 'Eliminación',      module: 'Citas',           date: '2026-06-09', time: '10:30', details: 'Cita ID 5 cancelada (Ana Vargas)',             result: 'Exitoso' },
  { id: 10, user: 'Andrés Castro',   role: 'Doctor',         action: 'Edición',          module: 'Pacientes',       date: '2026-06-09', time: '10:55', details: 'Datos de Luis Herrera actualizados',           result: 'Exitoso' },
  { id: 11, user: 'Admin Sistema',   role: 'Administrador',  action: 'Inicio de sesión', module: 'Autenticación',   date: '2026-06-08', time: '08:00', details: 'Acceso desde IP 10.0.0.1',                    result: 'Exitoso' },
  { id: 12, user: 'Ricardo Solano',  role: 'Doctor',         action: 'Exportación',      module: 'Reportes',        date: '2026-06-08', time: '08:20', details: 'Reporte de ocupación por doctor (PDF)',        result: 'Exitoso' },
  { id: 13, user: 'Elena Mora',      role: 'Doctor',         action: 'Creación',         module: 'Historial Médico',date: '2026-06-08', time: '09:00', details: 'Nueva consulta para Jorge Ramírez',            result: 'Exitoso' },
  { id: 14, user: 'Andrés Castro',   role: 'Doctor',         action: 'Eliminación',      module: 'Pacientes',       date: '2026-06-08', time: '09:30', details: 'Intento de eliminar paciente ID 3 denegado',  result: 'Fallido' },
  { id: 15, user: 'Admin Sistema',   role: 'Administrador',  action: 'Edición',          module: 'Usuarios',        date: '2026-06-08', time: '10:10', details: 'Rol de Elena Mora actualizado a Especialista', result: 'Exitoso' },
  { id: 16, user: 'Ricardo Solano',  role: 'Doctor',         action: 'Cierre de sesión', module: 'Autenticación',   date: '2026-06-08', time: '13:00', details: 'Sesión cerrada manualmente',                  result: 'Exitoso' },
  { id: 17, user: 'Elena Mora',      role: 'Doctor',         action: 'Cierre de sesión', module: 'Autenticación',   date: '2026-06-08', time: '13:05', details: 'Sesión cerrada manualmente',                  result: 'Exitoso' },
  { id: 18, user: 'Admin Sistema',   role: 'Administrador',  action: 'Creación',         module: 'Usuarios',        date: '2026-06-07', time: '07:45', details: 'Nuevo usuario: Andrés Castro (doctor)',        result: 'Exitoso' },
  { id: 19, user: 'Andrés Castro',   role: 'Doctor',         action: 'Inicio de sesión', module: 'Autenticación',   date: '2026-06-07', time: '08:00', details: 'Primer acceso al sistema',                    result: 'Exitoso' },
  { id: 20, user: 'Ricardo Solano',  role: 'Doctor',         action: 'Edición',          module: 'Historial Médico',date: '2026-06-07', time: '09:15', details: 'Consulta ID 1 – Carlos Méndez actualizada',   result: 'Exitoso' },
  { id: 21, user: 'Elena Mora',      role: 'Doctor',         action: 'Creación',         module: 'Citas',           date: '2026-06-07', time: '10:00', details: 'Cita para María González – 12 jun',            result: 'Exitoso' },
  { id: 22, user: 'Admin Sistema',   role: 'Administrador',  action: 'Exportación',      module: 'Reportes',        date: '2026-06-07', time: '11:30', details: 'Reporte de citas exportado (PDF)',             result: 'Exitoso' },
  { id: 23, user: 'Andrés Castro',   role: 'Doctor',         action: 'Edición',          module: 'Citas',           date: '2026-06-07', time: '12:00', details: 'Reprogramación de cita ID 10',                result: 'Exitoso' },
  { id: 24, user: 'Ricardo Solano',  role: 'Doctor',         action: 'Eliminación',      module: 'Historial Médico',date: '2026-06-06', time: '08:30', details: 'Medicamento ID 2 eliminado de consulta ID 3', result: 'Exitoso' },
  { id: 25, user: 'Admin Sistema',   role: 'Administrador',  action: 'Inicio de sesión', module: 'Autenticación',   date: '2026-06-06', time: '09:00', details: 'Acceso desde IP 10.0.0.1',                    result: 'Exitoso' },
  { id: 26, user: 'Elena Mora',      role: 'Doctor',         action: 'Edición',          module: 'Pacientes',       date: '2026-06-06', time: '09:45', details: 'Datos de Ana Vargas actualizados',             result: 'Exitoso' },
  { id: 27, user: 'Andrés Castro',   role: 'Doctor',         action: 'Creación',         module: 'Historial Médico',date: '2026-06-06', time: '10:20', details: 'Consulta para Carlos Méndez registrada',      result: 'Exitoso' },
  { id: 28, user: 'Admin Sistema',   role: 'Administrador',  action: 'Eliminación',      module: 'Usuarios',        date: '2026-06-05', time: '08:00', details: 'Usuario inactivo eliminado (ID 9)',            result: 'Exitoso' },
  { id: 29, user: 'Ricardo Solano',  role: 'Doctor',         action: 'Inicio de sesión', module: 'Autenticación',   date: '2026-06-05', time: '07:58', details: 'Intento con contraseña incorrecta',           result: 'Fallido' },
  { id: 30, user: 'Ricardo Solano',  role: 'Doctor',         action: 'Inicio de sesión', module: 'Autenticación',   date: '2026-06-05', time: '08:02', details: 'Acceso exitoso tras reintento',                result: 'Exitoso' },
];

const PAGE_SIZE = 10;

interface Filters {
  user: string;
  action: string;
  module: string;
  date: string;
}

const EMPTY_FILTERS: Filters = { user: '', action: '', module: '', date: '' };

const ACTION_STYLE: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  'Inicio de sesión': { bg: 'bg-blue-100',   text: 'text-blue-700',   icon: <LogIn   className="w-3 h-3" /> },
  'Cierre de sesión': { bg: 'bg-gray-100',   text: 'text-gray-600',   icon: <LogOut  className="w-3 h-3" /> },
  'Creación':         { bg: 'bg-green-100',  text: 'text-green-700',  icon: <PlusCircle className="w-3 h-3" /> },
  'Edición':          { bg: 'bg-amber-100',  text: 'text-amber-700',  icon: <Pencil  className="w-3 h-3" /> },
  'Eliminación':      { bg: 'bg-red-100',    text: 'text-red-600',    icon: <Trash2  className="w-3 h-3" /> },
  'Exportación':      { bg: 'bg-orange-100', text: 'text-orange-600', icon: <FileDown className="w-3 h-3" /> },
};

export default function ActivityHistory() {
  const [draftFilters, setDraftFilters] = useState<Filters>(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(EMPTY_FILTERS);
  const [page, setPage] = useState(1);

  const handleApply = () => {
    setAppliedFilters({ ...draftFilters });
    setPage(1);
  };

  const handleClear = () => {
    setDraftFilters(EMPTY_FILTERS);
    setAppliedFilters(EMPTY_FILTERS);
    setPage(1);
  };

  const filtered = useMemo(() => {
    return MOCK_ACTIVITIES.filter((entry) => {
      if (appliedFilters.user && !entry.user.toLowerCase().includes(appliedFilters.user.toLowerCase())) return false;
      if (appliedFilters.action && entry.action !== appliedFilters.action) return false;
      if (appliedFilters.module && entry.module !== appliedFilters.module) return false;
      if (appliedFilters.date && entry.date !== appliedFilters.date) return false;
      return true;
    });
  }, [appliedFilters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const isFiltered = Object.values(appliedFilters).some(Boolean);

  return (
    <div className="app-page p-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">HU-049</span>
        </div>
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Historial de actividades del sistema</h1>
        <p className="text-gray-500 text-sm">
          Bitácora de auditoría: registro de acciones críticas, usuarios y módulos para el seguimiento administrativo.
        </p>
      </div>

      {/* Info note */}
      <div className="flex items-start gap-2.5 px-4 py-3 bg-blue-50 border border-blue-100 rounded-lg mb-6 text-sm text-blue-700">
        <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <span>
          Se registran todas las acciones críticas del sistema incluyendo{' '}
          <strong>inicio/cierre de sesión</strong>, <strong>exportaciones</strong>, creaciones, ediciones y eliminaciones.
          La fecha y hora aparecen en columnas separadas para facilitar la lectura.
        </span>
      </div>

      {/* Filter Panel */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-2 mb-5">
          <Filter className="w-4 h-4 text-blue-600" />
          <h2 className="text-base font-semibold text-gray-900">Filtros de Búsqueda</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* User search */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Usuario</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar usuario…"
                value={draftFilters.user}
                onChange={(e) => setDraftFilters((f) => ({ ...f, user: e.target.value }))}
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Action type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Acción</label>
            <div className="relative">
              <select
                value={draftFilters.action}
                onChange={(e) => setDraftFilters((f) => ({ ...f, action: e.target.value }))}
                className="w-full appearance-none pl-3 pr-8 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {ACTION_TYPES.map((a) => (
                  <option key={a.value} value={a.value}>{a.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Module */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Módulo</label>
            <div className="relative">
              <select
                value={draftFilters.module}
                onChange={(e) => setDraftFilters((f) => ({ ...f, module: e.target.value }))}
                className="w-full appearance-none pl-3 pr-8 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {MODULES.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Fecha</label>
            <input
              type="date"
              value={draftFilters.date}
              onChange={(e) => setDraftFilters((f) => ({ ...f, date: e.target.value }))}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-5 pt-5 border-t border-gray-100">
          <button
            onClick={handleApply}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Filter className="w-4 h-4" />
            Aplicar
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

      {/* Results Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Registro de Actividades</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {isFiltered
                ? <>Se encontraron <strong className="text-gray-700">{filtered.length}</strong> {filtered.length === 1 ? 'registro' : 'registros'} que coinciden con los filtros aplicados.</>
                : <>{filtered.length} registros en total</>}
            </p>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Usuario', 'Acción', 'Módulo', 'Fecha', 'Hora', 'Detalles'].map((col) => (
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
              {paginated.map((entry) => {
                const style = ACTION_STYLE[entry.action] ?? { bg: 'bg-gray-100', text: 'text-gray-600', icon: null };
                return (
                  <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">{entry.user}</p>
                      <p className="text-xs text-gray-400">{entry.role}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
                        {style.icon}
                        {entry.action}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{entry.module}</td>
                    <td className="px-5 py-4 text-gray-700 whitespace-nowrap">{entry.date}</td>
                    <td className="px-5 py-4 text-gray-700 whitespace-nowrap font-mono">{entry.time}</td>
                    <td className="px-5 py-4 text-gray-500 text-xs max-w-xs truncate" title={entry.details}>
                      {entry.details}
                      {entry.result === 'Fallido' && (
                        <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-600">
                          Fallido
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {paginated.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm text-gray-400">
                    No se encontraron registros con los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-gray-100">
          {paginated.map((entry) => {
            const style = ACTION_STYLE[entry.action] ?? { bg: 'bg-gray-100', text: 'text-gray-600', icon: null };
            return (
              <div key={entry.id} className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{entry.user}</p>
                    <p className="text-xs text-gray-400">{entry.role}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text} shrink-0`}>
                    {style.icon}
                    {entry.action}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="font-medium text-gray-700">{entry.module}</span>
                  <span>·</span>
                  <span>{entry.date}</span>
                  <span>·</span>
                  <span className="font-mono">{entry.time}</span>
                  {entry.result === 'Fallido' && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-600">
                      Fallido
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 truncate">{entry.details}</p>
              </div>
            );
          })}

          {paginated.length === 0 && (
            <div className="p-8 text-center text-sm text-gray-400">
              No se encontraron registros con los filtros seleccionados.
            </div>
          )}
        </div>

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between gap-4 px-6 py-4 border-t border-gray-100 bg-gray-50">
            <p className="text-sm text-gray-500">
              Página <strong className="text-gray-700">{page}</strong> de <strong className="text-gray-700">{totalPages}</strong>
              {' '}· mostrando {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} de {filtered.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Siguiente
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
