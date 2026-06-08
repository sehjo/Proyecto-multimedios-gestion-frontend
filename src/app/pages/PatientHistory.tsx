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
  Plus,
  X,
  Pencil,
  Clock,
} from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router';
import { toast } from 'sonner';
import { useActivity } from '../../context/ActivityContext';
import {
  MOCK_CURRENT_USER,
  MOCK_PATIENTS,
  MOCK_USERS,
  MOCK_DISEASES,
  MOCK_HISTORY_ENTRIES,
} from '../../api/mockData';

const ALLOWED_ROLES = ['doctor', 'admin'];

const todayISO = () => new Date().toISOString().split('T')[0];

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

const formatDateTime = (dateStr: string) => {
  try {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  } catch {
    return dateStr;
  }
};

type Entry = (typeof MOCK_HISTORY_ENTRIES)[number];

type FormErrors = {
  consultation_date?: string;
  diagnosis?: string;
};

const emptyForm = () => ({
  consultation_date: todayISO(),
  disease_id: '',
  diagnosis: '',
  treatment: '',
  observations: '',
});

const entryToForm = (entry: Entry) => ({
  consultation_date: entry.consultation_date.split('T')[0],
  disease_id: entry.disease_id ? String(entry.disease_id) : '',
  diagnosis: entry.diagnosis,
  treatment: entry.treatment,
  observations: entry.observations,
});

export default function PatientHistory() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { logActivity } = useActivity();

  const id = Number(patientId);
  const patient = MOCK_PATIENTS.find((p) => p.id === id) ?? null;

  const [entries, setEntries] = useState<Entry[]>(() =>
    MOCK_HISTORY_ENTRIES.filter((e) => e.patient_id === id).sort(
      (a, b) => new Date(b.consultation_date).getTime() - new Date(a.consultation_date).getTime()
    )
  );

  // HU-034: filter state
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [doctorSearch, setDoctorSearch] = useState('');
  const [diagnosisSearch, setDiagnosisSearch] = useState('');

  // HU-035: create modal state
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});

  // HU-036: edit modal state
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [editErrors, setEditErrors] = useState<FormErrors>({});

  const getDoctorName = (doctorId: number) => {
    const u = MOCK_USERS.find((x) => x.id === doctorId);
    return u ? `${u.name} ${u.lastname}` : `Dr. #${doctorId}`;
  };

  const currentDoctorName = `${MOCK_CURRENT_USER.name} ${MOCK_CURRENT_USER.lastname}`;

  const canEdit = (entry: Entry) =>
    MOCK_CURRENT_USER.role === 'admin' || MOCK_CURRENT_USER.id === entry.doctor_id;

  // HU-034: filtered + sorted view
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
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
  }, [entries, dateFrom, dateTo, doctorSearch, diagnosisSearch]);

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

  // HU-035: create handlers
  const openModal = () => {
    setFormData(emptyForm());
    setErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setErrors({});
  };

  const handleDiseaseSelect = (diseaseId: string) => {
    const disease = MOCK_DISEASES.find((d) => String(d.id) === diseaseId);
    setFormData((prev) => ({
      ...prev,
      disease_id: diseaseId,
      diagnosis: disease ? disease.name : prev.diagnosis,
    }));
    if (disease) setErrors((prev) => ({ ...prev, diagnosis: undefined }));
  };

  const handleSubmit = (e: { preventDefault(): void }) => {
    e.preventDefault();
    const newErrors: FormErrors = {};
    if (!formData.consultation_date.trim()) newErrors.consultation_date = 'Este campo es obligatorio';
    if (!formData.diagnosis.trim()) newErrors.diagnosis = 'Este campo es obligatorio';
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    const newEntry: Entry = {
      id: Math.max(0, ...entries.map((e) => e.id), ...MOCK_HISTORY_ENTRIES.map((e) => e.id)) + 1,
      patient_id: id,
      consultation_date: new Date(formData.consultation_date).toISOString(),
      doctor_id: MOCK_CURRENT_USER.id,
      diagnosis: formData.diagnosis.trim(),
      disease_id: formData.disease_id ? Number(formData.disease_id) : null,
      treatment: formData.treatment.trim(),
      observations: formData.observations.trim(),
    };

    setEntries((prev) =>
      [newEntry, ...prev].sort(
        (a, b) => new Date(b.consultation_date).getTime() - new Date(a.consultation_date).getTime()
      )
    );
    toast.success('Registro guardado exitosamente');
    logActivity({ type: 'Nuevo registro en historial', name: newEntry.diagnosis });
    closeModal();
  };

  // HU-036: edit handlers
  const openEditModal = (entry: Entry) => {
    if (!canEdit(entry)) {
      toast.error('No tienes permiso para editar este registro');
      return;
    }
    setEditingEntry(entry);
    setEditForm(entryToForm(entry));
    setEditErrors({});
  };

  const closeEditModal = () => {
    setEditingEntry(null);
    setEditErrors({});
  };

  const handleEditDiseaseSelect = (diseaseId: string) => {
    const disease = MOCK_DISEASES.find((d) => String(d.id) === diseaseId);
    setEditForm((prev) => ({
      ...prev,
      disease_id: diseaseId,
      diagnosis: disease ? disease.name : prev.diagnosis,
    }));
    if (disease) setEditErrors((prev) => ({ ...prev, diagnosis: undefined }));
  };

  const handleEditSubmit = (e: { preventDefault(): void }) => {
    e.preventDefault();
    const newErrors: FormErrors = {};
    if (!editForm.consultation_date.trim()) newErrors.consultation_date = 'Este campo es obligatorio';
    if (!editForm.diagnosis.trim()) newErrors.diagnosis = 'Este campo es obligatorio';
    if (Object.keys(newErrors).length > 0) { setEditErrors(newErrors); return; }

    const now = new Date().toISOString();
    setEntries((prev) =>
      prev
        .map((e) =>
          e.id === editingEntry!.id
            ? {
                ...e,
                consultation_date: new Date(editForm.consultation_date).toISOString(),
                diagnosis: editForm.diagnosis.trim(),
                disease_id: editForm.disease_id ? Number(editForm.disease_id) : null,
                treatment: editForm.treatment.trim(),
                observations: editForm.observations.trim(),
                updated_at: now,
              }
            : e
        )
        .sort(
          (a, b) => new Date(b.consultation_date).getTime() - new Date(a.consultation_date).getTime()
        )
    );
    toast.success('Registro actualizado exitosamente');
    logActivity({ type: 'Registro editado en historial', name: editForm.diagnosis });
    closeEditModal();
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
          <button
            onClick={openModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors self-start sm:self-auto"
          >
            <Plus className="w-5 h-5" />
            Nuevo registro
          </button>
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
          <button onClick={toggleAll} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            {allExpanded ? 'Colapsar todos' : 'Expandir todos'}
          </button>
        )}
      </div>

      {/* Timeline / Empty states */}
      {entries.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Stethoscope className="w-14 h-14 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">
            Este paciente no tiene registros en su historial médico
          </p>
          <button
            onClick={openModal}
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
          >
            <Plus className="w-4 h-4" />
            Agregar primer registro
          </button>
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
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-gray-400">
                              {formatDate(entry.consultation_date)}
                            </span>
                            {entry.updated_at && (
                              <span className="flex items-center gap-1 text-xs text-amber-600">
                                <Clock className="w-3 h-3" />
                                Modificado: {formatDateTime(entry.updated_at)}
                              </span>
                            )}
                          </div>
                          <h3 className="font-semibold text-gray-900 truncate">{entry.diagnosis}</h3>
                          <span className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                            <User className="w-3.5 h-3.5" />
                            {doctorName}
                          </span>
                        </div>
                        <div className="flex-shrink-0 text-gray-400 mt-1">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
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

                        {/* HU-036: Edit action */}
                        <div className="flex justify-end border-t border-gray-200 pt-3">
                          <button
                            type="button"
                            onClick={() => openEditModal(entry)}
                            className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                            Editar registro
                          </button>
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

      {/* Modal: Nuevo registro (HU-035) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">Nuevo registro</h2>
              <button type="button" onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de consulta <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.consultation_date}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, consultation_date: e.target.value }));
                    if (e.target.value) setErrors((prev) => ({ ...prev, consultation_date: undefined }));
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.consultation_date ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                />
                {errors.consultation_date && (
                  <p className="text-red-500 text-xs mt-1">{errors.consultation_date}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Médico tratante <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={currentDoctorName}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seleccionar enfermedad del catálogo
                  <span className="text-gray-400 font-normal ml-1">(opcional)</span>
                </label>
                <select
                  value={formData.disease_id}
                  onChange={(e) => handleDiseaseSelect(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none"
                >
                  <option value="">— Seleccionar del catálogo —</option>
                  {MOCK_DISEASES.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-400 mt-1">
                  Al seleccionar, el nombre se carga automáticamente en el campo de diagnóstico.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Diagnóstico <span className="text-red-500">*</span>
                  <span className="text-gray-400 font-normal ml-1">(máx. 500 caracteres)</span>
                </label>
                <textarea
                  rows={3}
                  maxLength={500}
                  placeholder="Describa el diagnóstico de la consulta..."
                  value={formData.diagnosis}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, diagnosis: e.target.value }));
                    if (e.target.value.trim()) setErrors((prev) => ({ ...prev, diagnosis: undefined }));
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${errors.diagnosis ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                />
                <div className="flex justify-between mt-1">
                  {errors.diagnosis ? <p className="text-red-500 text-xs">{errors.diagnosis}</p> : <span />}
                  <span className={`text-xs ${formData.diagnosis.length >= 500 ? 'text-red-500' : 'text-gray-400'}`}>
                    {formData.diagnosis.length}/500
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tratamiento indicado
                  <span className="text-gray-400 font-normal ml-1">(máx. 500 caracteres)</span>
                </label>
                <textarea
                  rows={3}
                  maxLength={500}
                  placeholder="Describa el tratamiento indicado al paciente..."
                  value={formData.treatment}
                  onChange={(e) => setFormData((prev) => ({ ...prev, treatment: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <div className="text-right mt-1">
                  <span className={`text-xs ${formData.treatment.length >= 500 ? 'text-red-500' : 'text-gray-400'}`}>
                    {formData.treatment.length}/500
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observaciones
                  <span className="text-gray-400 font-normal ml-1">(máx. 1000 caracteres)</span>
                </label>
                <textarea
                  rows={4}
                  maxLength={1000}
                  placeholder="Observaciones adicionales de la consulta..."
                  value={formData.observations}
                  onChange={(e) => setFormData((prev) => ({ ...prev, observations: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <div className="text-right mt-1">
                  <span className={`text-xs ${formData.observations.length >= 1000 ? 'text-red-500' : 'text-gray-400'}`}>
                    {formData.observations.length}/1000
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Guardar registro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Editar registro (HU-036) */}
      {editingEntry && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">Editar registro</h2>
              <button type="button" onClick={closeEditModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} noValidate className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de consulta <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={editForm.consultation_date}
                  onChange={(e) => {
                    setEditForm((prev) => ({ ...prev, consultation_date: e.target.value }));
                    if (e.target.value) setEditErrors((prev) => ({ ...prev, consultation_date: undefined }));
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${editErrors.consultation_date ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                />
                {editErrors.consultation_date && (
                  <p className="text-red-500 text-xs mt-1">{editErrors.consultation_date}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Médico tratante <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={getDoctorName(editingEntry.doctor_id)}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seleccionar enfermedad del catálogo
                  <span className="text-gray-400 font-normal ml-1">(opcional)</span>
                </label>
                <select
                  value={editForm.disease_id}
                  onChange={(e) => handleEditDiseaseSelect(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none"
                >
                  <option value="">— Seleccionar del catálogo —</option>
                  {MOCK_DISEASES.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Diagnóstico <span className="text-red-500">*</span>
                  <span className="text-gray-400 font-normal ml-1">(máx. 500 caracteres)</span>
                </label>
                <textarea
                  rows={3}
                  maxLength={500}
                  value={editForm.diagnosis}
                  onChange={(e) => {
                    setEditForm((prev) => ({ ...prev, diagnosis: e.target.value }));
                    if (e.target.value.trim()) setEditErrors((prev) => ({ ...prev, diagnosis: undefined }));
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${editErrors.diagnosis ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                />
                <div className="flex justify-between mt-1">
                  {editErrors.diagnosis ? <p className="text-red-500 text-xs">{editErrors.diagnosis}</p> : <span />}
                  <span className={`text-xs ${editForm.diagnosis.length >= 500 ? 'text-red-500' : 'text-gray-400'}`}>
                    {editForm.diagnosis.length}/500
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tratamiento indicado
                  <span className="text-gray-400 font-normal ml-1">(máx. 500 caracteres)</span>
                </label>
                <textarea
                  rows={3}
                  maxLength={500}
                  value={editForm.treatment}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, treatment: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <div className="text-right mt-1">
                  <span className={`text-xs ${editForm.treatment.length >= 500 ? 'text-red-500' : 'text-gray-400'}`}>
                    {editForm.treatment.length}/500
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observaciones
                  <span className="text-gray-400 font-normal ml-1">(máx. 1000 caracteres)</span>
                </label>
                <textarea
                  rows={4}
                  maxLength={1000}
                  value={editForm.observations}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, observations: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <div className="text-right mt-1">
                  <span className={`text-xs ${editForm.observations.length >= 1000 ? 'text-red-500' : 'text-gray-400'}`}>
                    {editForm.observations.length}/1000
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Guardar cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
