import { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, Search, AlertCircle, Stethoscope } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';
import DataTable, { CustomAction } from '../components/DataTable';
import { 
  getDiagnoses, 
  createDiagnosis, 
  updateDiagnosis, 
  deleteDiagnosis,
  getPatients,
  getDiseases,
  getUsers,
  getPriorities
} from '../../api/services';
import { toast } from 'sonner';
import { useActivity } from '../../context/ActivityContext';
import { useAuth } from '../../context/AuthContext';

export default function Diagnoses() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logActivity } = useActivity();
  const { user } = useAuth();
  const [diagnoses, setDiagnoses] = useState([]);
  const [patients, setPatients] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [users, setUsers] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDiagnosis, setEditingDiagnosis] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAttendingMode, setIsAttendingMode] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'attended'>('pending');
  const [attendedPatients, setAttendedPatients] = useState<number[]>(() => {
    const saved = localStorage.getItem('attendedPatients');
    return saved ? JSON.parse(saved) : [];
  });

  const markPatientAsAttended = (patientId: number) => {
    setAttendedPatients(prev => {
      const newAttended = [...prev, patientId];
      localStorage.setItem('attendedPatients', JSON.stringify(newAttended));
      return newAttended;
    });
  };

  const [formData, setFormData] = useState({
    name: '',
    disease_id: '',
    patient_id: '',
    diagnoses_by: user?.id?.toString() || '',
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('action') === 'new') {
      resetForm();
      setShowModal(true);
      navigate(location.pathname, { replace: true });
    }
  }, [location.search, location.pathname, navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [diagnosesData, patientsData, diseasesData, usersData, prioritiesData] = await Promise.all([
        getDiagnoses().catch(() => ({ data: [] })),
        getPatients().catch(() => ({ data: [] })),
        getDiseases().catch(() => ({ data: [] })),
        getUsers().catch(() => ({ data: [] })),
        getPriorities().catch(() => ({ data: [] })),
      ]);
      
      setDiagnoses(diagnosesData.data || []);
      setPatients(patientsData.data || []);
      setDiseases(diseasesData.data || []);
      setUsers(usersData.data || []);
      setPriorities(prioritiesData.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patient_id) {
      toast.error('Debe seleccionar un paciente antes de guardar.');
      return;
    }
    try {
      const payload = {
        name: formData.name,
        disease_id: formData.disease_id ? parseInt(formData.disease_id) : undefined,
        patient_id: parseInt(formData.patient_id),
        diagnoses_by: parseInt(formData.diagnoses_by),
      };

      if (editingDiagnosis) {
        await updateDiagnosis(editingDiagnosis.id, payload);
        toast.success('Diagnóstico actualizado exitosamente');
        logActivity({
          type: 'Diagnóstico actualizado',
          name: payload.name,
        });
      } else {
        await createDiagnosis(payload);
        toast.success('Diagnóstico creado exitosamente');
        logActivity({
          type: 'Nuevo diagnóstico',
          name: payload.name,
        });
        
        // Si estamos en modo atención y se genera un diagnóstico nuevo, considerar al paciente como atendido
        if (isAttendingMode) {
          markPatientAsAttended(payload.patient_id);
        }
      }
      
      setShowModal(false);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Error saving diagnosis:', error);
      toast.error('Error al guardar el diagnóstico');
    }
  };

  const handleEdit = (diagnosis: any) => {
    setEditingDiagnosis(diagnosis);
    setFormData({
      name: diagnosis.name,
      disease_id: diagnosis.disease_id || '',
      patient_id: diagnosis.patient_id,
      diagnoses_by: diagnosis.diagnoses_by,
    });
    setShowModal(true);
  };

  const handleDelete = async (diagnosis: any) => {
    if (window.confirm('¿Está seguro de eliminar este diagnóstico?')) {
      try {
        await deleteDiagnosis(diagnosis.id);
        toast.success('Diagnóstico eliminado exitosamente');
        logActivity({
          type: 'Diagnóstico eliminado',
          name: diagnosis.name,
        });
        loadData();
      } catch (error) {
        console.error('Error deleting diagnosis:', error);
        toast.error('Error al eliminar el diagnóstico');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      disease_id: '',
      patient_id: '',
      diagnoses_by: user?.id?.toString() || '',
    });
    setEditingDiagnosis(null);
  };

  const patientsMap = useMemo(() => new Map(patients.map((p: any) => [p.id, p])), [patients]);
  const diseasesMap = useMemo(() => new Map(diseases.map((d: any) => [d.id, d])), [diseases]);
  const prioritiesMap = useMemo(() => new Map(priorities.map((p: any) => [p.id, p])), [priorities]);
  const usersMap = useMemo(() => new Map(users.map((u: any) => [u.id, u])), [users]);

  const { pendingDiagnoses, attendedDiagnosesData } = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    const attendedSet = new Set(attendedPatients);

    let pending = diagnoses.filter((diagnosis: any) => {
      const matchesSearch = diagnosis.name?.toLowerCase().includes(lowerSearch);
      return !attendedSet.has(diagnosis.patient_id) && matchesSearch;
    });

    const attended = diagnoses.filter((diagnosis: any) => {
      const matchesSearch = diagnosis.name?.toLowerCase().includes(lowerSearch);
      return attendedSet.has(diagnosis.patient_id) && matchesSearch;
    });

    if (isAttendingMode && pending.length > 0) {
      const getPriorityWeight = (diagnosis: any) => {
        if (!diagnosis.disease_id) return 0;
        const disease = diseasesMap.get(diagnosis.disease_id);
        if (!disease) return 0;
        const priority = prioritiesMap.get(disease.priority_id);
        if (!priority) return 0;
        const pName = priority.name.toLowerCase();
        if (pName.includes('high') || pName.includes('alta')) return 3;
        if (pName.includes('medium') || pName.includes('media')) return 2;
        if (pName.includes('low') || pName.includes('baja')) return 1;
        return 0;
      };
      const sorted = [...pending].sort((a, b) => {
        const diff = getPriorityWeight(b) - getPriorityWeight(a);
        return diff !== 0 ? diff : a.id - b.id;
      });
      pending = [sorted[0]];
    }

    return { pendingDiagnoses: pending, attendedDiagnosesData: attended };
  }, [diagnoses, searchTerm, attendedPatients, isAttendingMode, diseasesMap, prioritiesMap]);

  const dataToDisplay = activeTab === 'pending' ? pendingDiagnoses : attendedDiagnosesData;

  const handleCreateFromExisting = useCallback((diagnosis: any) => {
    setEditingDiagnosis(null);
    setFormData({
      name: '',
      disease_id: diagnosis.disease_id || '',
      patient_id: diagnosis.patient_id || '',
      diagnoses_by: '',
    });
    setShowModal(true);
  }, []);

  const customActions: CustomAction[] = useMemo(() => [
    {
      icon: <Stethoscope className="w-4 h-4" />,
      label: 'Generar Nuevo Diagnóstico',
      className: 'text-emerald-600 hover:bg-emerald-50',
      onClick: handleCreateFromExisting,
    },
  ], [handleCreateFromExisting]);

  const getPriorityBadgeClass = (priorityName: string) => {
    const name = priorityName.toLowerCase();
    if (name.includes('high') || name.includes('alta')) return 'bg-red-100 text-red-700';
    if (name.includes('medium') || name.includes('media')) return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  };

  const columns = useMemo(() => [
    { header: 'ID', accessor: 'id' },
    { header: 'Nombre', accessor: 'name' },
    {
      header: 'Paciente',
      accessor: 'patient_id',
      render: (value: any) => {
        const patient = patientsMap.get(value);
        return patient ? `${patient.name} ${patient.lastname}` : '-';
      }
    },
    {
      header: 'Enfermedad',
      accessor: 'disease_id',
      render: (value: any) => {
        const disease = diseasesMap.get(value);
        return disease ? disease.name : '-';
      }
    },
    {
      header: 'Prioridad',
      accessor: 'disease_id',
      render: (value: any) => {
        const disease = diseasesMap.get(value);
        if (!disease) return '-';
        const priority = prioritiesMap.get(disease.priority_id);
        if (!priority) return '-';
        return (
          <span className={`text-xs w-max px-2 py-0.5 rounded-full ${getPriorityBadgeClass(priority.name)}`}>
            {priority.name}
          </span>
        );
      }
    },
    {
      header: 'Diagnosticado por',
      accessor: 'diagnoses_by',
      render: (value: any) => {
        const user = usersMap.get(value);
        return user ? `${user.name} ${user.lastname}` : '-';
      }
    },
  ], [patientsMap, diseasesMap, prioritiesMap, usersMap]);

  return (
    <div className="app-page p-8">
      <div className="app-page-header flex items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Diagnósticos</h1>
          <p className="text-gray-500">Gestión de diagnósticos y atención de pacientes médicos</p>
        </div>
        <div className="app-page-header-actions flex flex-wrap gap-3">
          {activeTab === 'pending' && (
            <button
              onClick={() => setIsAttendingMode(!isAttendingMode)}
              className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors ${
                isAttendingMode ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              <AlertCircle className="w-5 h-5" />
              {isAttendingMode ? 'Salir de Modo Atención' : 'Atender Siguiente'}
            </button>
          )}

          {attendedPatients.length > 0 && (
            <button
              onClick={() => {
                setAttendedPatients([]);
                localStorage.removeItem('attendedPatients');
                toast.success('Lista de atención reiniciada');
              }}
              className="px-4 py-2 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Reiniciar Atendidos
            </button>
          )}

          {activeTab === 'attended' && (
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Nuevo Diagnóstico
            </button>
          )}
        </div>
      </div>

      {/* Tabs y Search Bar */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
              activeTab === 'pending'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Pendientes por Atender
          </button>
          <button
            onClick={() => setActiveTab('attended')}
            className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
              activeTab === 'attended'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Pacientes Atendidos
          </button>
        </div>

        <div className="app-page-search relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar diagnósticos..."
            disabled={isAttendingMode && activeTab === 'pending'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
          />
        </div>
      </div>

      {isAttendingMode && activeTab === 'pending' && (
        <div className="mb-6">
          <p className="text-sm text-amber-600 font-medium tracking-wide">
            Modo Atención activado: Mostrando únicamente el diagnóstico pendiente con la condición más crítica.
          </p>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500">Cargando...</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={dataToDisplay}
          onEdit={handleEdit}
          onDelete={handleDelete}
          customActions={activeTab === 'pending' ? customActions : []}
        />
      )}

      {/* Modal */}
      {showModal && (
        <div className="app-modal-overlay fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="app-modal-panel bg-white rounded-xl shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingDiagnosis ? 'Editar Diagnóstico' : 'Nuevo Diagnóstico'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre/Título *
                </label>
                <input
                  type="text"
                  required
                  maxLength={255}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="text-right mt-1">
                  <span className={`text-xs ${formData.name.length >= 255 ? 'text-red-500' : 'text-gray-500'}`}>
                    {formData.name.length}/255
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Paciente *
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                  {(() => {
                    const p = patients.find((pat: any) => pat.id === parseInt(formData.patient_id));
                    return p ? `${p.name} ${p.lastname} (${p.nick})` : 'Sin asignar';
                  })()}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enfermedad
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 min-h-[42px]">
                  {(() => {
                    const d = diseases.find((dis: any) => dis.id === parseInt(formData.disease_id));
                    return d ? d.name : 'Sin asignar';
                  })()}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Diagnosticado por *
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                  {users.find((u: any) => u.id === parseInt(formData.diagnoses_by))?.name || user?.name || 'Desconocido'} 
                  {users.find((u: any) => u.id === parseInt(formData.diagnoses_by))?.lastname ? ` ${users.find((u: any) => u.id === parseInt(formData.diagnoses_by))?.lastname}` : ''}
                </div>
              </div>
              <div className="app-modal-actions flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingDiagnosis ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
