import { useState, useMemo } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Search,
  Stethoscope,
  User,
  Activity,
  FileText,
  Calendar,
  ShieldOff,
} from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router';
import {
  MOCK_CURRENT_USER,
  MOCK_PATIENTS,
  MOCK_USERS,
  MOCK_HISTORY_ENTRIES,
} from '../../api/mockData';

const ALLOWED_ROLES = ['doctor', 'admin'];

const formatDate = (dateStr: string) => {
  try {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return dateStr;
  }
};

export default function PatientHistory() {
  const { patientId } = useParams();
  const navigate = useNavigate();

  const id = Number(patientId);
  const patient = MOCK_PATIENTS.find((p) => p.id === id) ?? null;

  const allEntries = useMemo(
    () =>
      MOCK_HISTORY_ENTRIES.filter((e) => e.patient_id === id).sort(
        (a, b) =>
          new Date(b.consultation_date).getTime() - new Date(a.consultation_date).getTime()
      ),
    [id]
  );

  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [doctorSearch, setDoctorSearch] = useState('');
  const [diagnosisSearch, setDiagnosisSearch] = useState('');

  const getDoctorName = (doctorId: number) => {
    const u = MOCK_USERS.find((x) => x.id === doctorId);
    return u ? `${u.name} ${u.lastname}` : `Dr. #${doctorId}`;
  };

  const filteredEntries = useMemo(() => {
    return allEntries.filter((entry) => {
      const entryDate = new Date(entry.consultation_date);

      if (dateFrom) {
        const from = new Date(dateFrom);
        from.setHours(0, 0, 0, 0);
        if (entryDate < from) return false;
      }
      if (dateTo) {
        const to = new Date(dateTo);
        to.setHours(23, 59, 59, 999);
        if (entryDate > to) return false;
      }
      if (doctorSearch.trim()) {
        const name = getDoctorName(entry.doctor_id).toLowerCase();
        if (!name.includes(doctorSearch.trim().toLowerCase())) return false;
      }
      if (diagnosisSearch.trim()) {
        if (!entry.diagnosis.toLowerCase().includes(diagnosisSearch.trim().toLowerCase()))
          return false;
      }
      return true;
    });
  }, [allEntries, dateFrom, dateTo, doctorSearch, diagnosisSearch]);

  const hasActiveFilters =
    dateFrom || dateTo || doctorSearch.trim() || diagnosisSearch.trim();

  const toggleExpanded = (entryId: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(entryId) ? next.delete(entryId) : next.add(entryId);
      return next;
    });
  };

  const allExpanded =
    filteredEntries.length > 0 && filteredEntries.every((e) => expandedIds.has(e.id));

  const toggleAll = () => {
    if (allExpanded) {
      setExpandedIds(new Set());
    } else {
      setExpandedIds(new Set(filteredEntries.map((e) => e.id)));
    }
  };

  if (!ALLOWED_ROLES.includes(MOCK_CURRENT_USER.role)) {
    return (
      <div className="app-page p-8">
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <ShieldOff className="w-12 h-12 text-red-300 mx-auto mb-4" />
          <p className="text-red-500 font-medium">No tienes permiso para acceder a esta sección</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="app-page p-8">
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500 font-medium">Paciente no encontrado</p>
          <button
            onClick={() => navigate('/medical-history')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver al historial
          </button>
        </div>
      </div>
    );
  }

  const initials = `${patient.name?.[0] || ''}${patient.lastname?.[0] || ''}`.toUpperCase();

  return (
    <div className="app-page p-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/medical-history" className="hover:text-blue-600 transition-colors">
          Historial Médico
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">
          {patient.name} {patient.lastname}
        </span>
      </nav>

      {/* Patient header */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <span className="text-blue-700 font-bold text-xl">{initials}</span>
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {patient.name} {patient.lastname}
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              Apodo: <span className="font-medium text-gray-700">{patient.nick}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Fecha desde</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Fecha hasta</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Médico tratante</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar por médico..."
                value={doctorSearch}
                onChange={(e) => setDoctorSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Diagnóstico</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar diagnóstico..."
                value={diagnosisSearch}
                onChange={(e) => setDiagnosisSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results count + expand toggle */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          {filteredEntries.length === 0
            ? 'Sin registros'
            : `${filteredEntries.length} registro${filteredEntries.length !== 1 ? 's' : ''}`}
        </p>
        {filteredEntries.length > 1 && (
          <button
            onClick={toggleAll}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {allExpanded ? 'Colapsar todos' : 'Expandir todos'}
          </button>
        )}
      </div>

      {/* Timeline / Empty states */}
      {allEntries.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Stethoscope className="w-14 h-14 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">
            Este paciente no tiene registros en su historial médico
          </p>
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Search className="w-14 h-14 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">
            No se encontraron registros con los criterios seleccionados
          </p>
        </div>
      ) : (
        <div className="relative">
          {filteredEntries.length > 1 && (
            <div className="absolute left-4 top-9 bottom-9 w-0.5 bg-gray-200" />
          )}
          <div className="space-y-4">
            {filteredEntries.map((entry) => {
              const isExpanded = expandedIds.has(entry.id);
              const doctorName = getDoctorName(entry.doctor_id);

              return (
                <div key={entry.id} className="relative pl-12">
                  <div className="absolute left-0 top-4 w-8 h-8 rounded-full bg-blue-100 border-2 border-blue-400 flex items-center justify-center z-10">
                    <Stethoscope className="w-4 h-4 text-blue-600" />
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <button
                      type="button"
                      className="w-full text-left p-4 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                      onClick={() => toggleExpanded(entry.id)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-medium text-gray-400 block mb-1">
                            {formatDate(entry.consultation_date)}
                          </span>
                          <h3 className="font-semibold text-gray-900 truncate">
                            {entry.diagnosis}
                          </h3>
                          <span className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                            <User className="w-3.5 h-3.5" />
                            {doctorName}
                          </span>
                        </div>
                        <div className="flex-shrink-0 text-gray-400 mt-1">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="border-t border-gray-100 bg-gray-50 p-4 space-y-3">
                        <div className="bg-white rounded-lg border border-gray-200 p-3">
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5" />
                            Médico tratante
                          </p>
                          <p className="text-sm text-gray-900 font-medium">{doctorName}</p>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 p-3">
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5" />
                            Diagnóstico
                          </p>
                          <p className="text-sm text-gray-900">{entry.diagnosis}</p>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 p-3">
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5" />
                            Tratamiento indicado
                          </p>
                          <p className="text-sm text-gray-900">
                            {entry.treatment || (
                              <span className="text-gray-400 italic">No especificado</span>
                            )}
                          </p>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 p-3">
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                            Observaciones
                          </p>
                          <p className="text-sm text-gray-900">
                            {entry.observations || (
                              <span className="text-gray-400 italic">Sin observaciones</span>
                            )}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
