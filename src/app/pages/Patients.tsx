import { useState, useEffect, useMemo } from 'react';
import { Plus, Search, AlertTriangle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';
import DataTable from '../components/DataTable';
import { getPatients, createPatient, updatePatient, deletePatient, getDiseases, getUsers } from '../../api/services';
import { toast } from 'sonner';
import { useActivity } from '../../context/ActivityContext';

export default function Patients() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logActivity } = useActivity();
  const [patients, setPatients] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<any>(null);
  const [editingPatient, setEditingPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    nick: '',
    suffering: '',
    register_by: '',
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
      const [patientsData, diseasesData, usersData] = await Promise.all([
        getPatients().catch(() => ({ data: [] })),
        getDiseases().catch(() => ({ data: [] })),
        getUsers().catch(() => ({ data: [] })),
      ]);
      
      setPatients(patientsData.data || []);
      setDiseases(diseasesData.data || []);
      setUsers(usersData.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        suffering: formData.suffering ? parseInt(formData.suffering) : undefined,
        register_by: formData.register_by ? parseInt(formData.register_by) : undefined,
      };

      if (editingPatient) {
        await updatePatient(editingPatient.id, payload);
        toast.success('Paciente actualizado exitosamente');
        logActivity({
          type: 'Paciente actualizado',
          name: `${payload.name} ${payload.lastname}`,
        });
      } else {
        await createPatient(payload);
        toast.success('Paciente creado exitosamente');
        logActivity({
          type: 'Nuevo paciente',
          name: `${payload.name} ${payload.lastname}`,
        });
      }
      
      setShowModal(false);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Error saving patient:', error);
      toast.error('Error al guardar el paciente');
    }
  };

  const handleEdit = (patient: any) => {
    setEditingPatient(patient);
    setFormData({
      name: patient.name,
      lastname: patient.lastname,
      nick: patient.nick,
      suffering: patient.suffering || '',
      register_by: patient.register_by || '',
    });
    setShowModal(true);
  };

  const handleDelete = (patient: any) => {
    setPatientToDelete(patient);
  };

  const confirmDelete = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (patientToDelete) {
      try {
        await deletePatient(patientToDelete.id);
        toast.success('Paciente eliminado exitosamente');
        logActivity({
          type: 'Paciente eliminado',
          name: `${patientToDelete.name} ${patientToDelete.lastname}`,
        });
        await loadData();
      } catch (error: any) {
        console.error('Error deleting patient:', error);
        
        let errorMessage = 'Error al eliminar el paciente';
        if (error.response?.status === 500) {
          errorMessage = 'No se puede eliminar el paciente porque tiene registros asociados (como diagnósticos). Elimine primero los registros dependientes.';
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }

        toast.error(errorMessage);
      } finally {
        setPatientToDelete(null);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      lastname: '',
      nick: '',
      suffering: '',
      register_by: '',
    });
    setEditingPatient(null);
  };

  const diseasesMap = useMemo(() => new Map(diseases.map((d: any) => [d.id, d])), [diseases]);

  const filteredPatients = useMemo(() => {
    const lower = searchTerm.toLowerCase();
    return patients.filter((patient: any) =>
      patient.name?.toLowerCase().includes(lower) ||
      patient.lastname?.toLowerCase().includes(lower) ||
      patient.nick?.toLowerCase().includes(lower)
    );
  }, [patients, searchTerm]);

  const columns = useMemo(() => [
    { header: 'ID', accessor: 'id' },
    { header: 'Nombre', accessor: 'name' },
    { header: 'Apellido', accessor: 'lastname' },
    { header: 'Apodo', accessor: 'nick' },
    {
      header: 'Enfermedad',
      accessor: 'suffering',
      render: (value: any) => {
        const disease = diseasesMap.get(value);
        return disease ? disease.name : '-';
      }
    },
  ], [diseasesMap]);

  return (
    <div className="app-page p-8">
      <div className="app-page-header flex items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Pacientes</h1>
          <p className="text-gray-500">Gestión de pacientes registrados</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nuevo Paciente
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="app-page-search relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar pacientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500">Cargando...</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredPatients}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Modal */}
      {showModal && (
        <div className="app-modal-overlay fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="app-modal-panel bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingPatient ? 'Editar Paciente' : 'Nuevo Paciente'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
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
                  Apellido *
                </label>
                <input
                  type="text"
                  required
                  maxLength={255}
                  value={formData.lastname}
                  onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="text-right mt-1">
                  <span className={`text-xs ${formData.lastname.length >= 255 ? 'text-red-500' : 'text-gray-500'}`}>
                    {formData.lastname.length}/255
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apodo *
                </label>
                <input
                  type="text"
                  required
                  maxLength={255}
                  value={formData.nick}
                  onChange={(e) => setFormData({ ...formData, nick: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="text-right mt-1">
                  <span className={`text-xs ${formData.nick.length >= 255 ? 'text-red-500' : 'text-gray-500'}`}>
                    {formData.nick.length}/255
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enfermedad
                </label>
                <div className="relative">
                  <select
                    value={formData.suffering}
                    onChange={(e) => setFormData({ ...formData, suffering: e.target.value })}
                    className="w-full appearance-none px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Seleccionar...</option>
                    {diseases.map((disease) => {
                      const diseaseName = disease.name;
                      return (
                        <option key={disease.id} value={disease.id}>
                          {diseaseName.length > 40 ? diseaseName.substring(0, 37) + '...' : diseaseName}
                        </option>
                      );
                    })}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg className="h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="mt-1 h-4" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Registrado por
                </label>
                <div className="relative">
                  <select
                    value={formData.register_by}
                    onChange={(e) => setFormData({ ...formData, register_by: e.target.value })}
                    className="w-full appearance-none px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Seleccionar...</option>
                    {users.map((user) => {
                      const fullName = `${user.name} ${user.lastname}`;
                      return (
                        <option key={user.id} value={user.id}>
                          {fullName.length > 40 ? fullName.substring(0, 37) + '...' : fullName}
                        </option>
                      );
                    })}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg className="h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="mt-1 h-4" />
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
                  {editingPatient ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {patientToDelete && (
        <div className="app-modal-overlay fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Eliminar Paciente</h3>
              <p className="text-sm text-gray-500 mb-6">
                ¿Está seguro de que desea eliminar a <strong>{patientToDelete.name} {patientToDelete.lastname}</strong>? Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setPatientToDelete(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
