import { useState, useEffect, useMemo } from 'react';
import { Plus, Search } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';
import DataTable from '../components/DataTable';
import { getDiseases, createDisease, updateDisease, deleteDisease, getPriorities } from '../../api/services';
import { toast } from 'sonner';
import { useActivity } from '../../context/ActivityContext';

export default function Diseases() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logActivity } = useActivity();
  const [diseases, setDiseases] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDisease, setEditingDisease] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    technincal_name: '',
    description: '',
    priority_id: '',
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
      const [diseasesData, prioritiesData] = await Promise.all([
        getDiseases().catch(() => ({ data: [] })),
        getPriorities().catch(() => ({ data: [] })),
      ]);
      
      setDiseases(diseasesData.data || []);
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
    try {
      const payload = {
        ...formData,
        priority_id: parseInt(formData.priority_id),
      };

      if (editingDisease) {
        await updateDisease(editingDisease.id, payload);
        toast.success('Enfermedad actualizada exitosamente');
        logActivity({
          type: 'Enfermedad actualizada',
          name: payload.name,
        });
      } else {
        await createDisease(payload);
        toast.success('Enfermedad creada exitosamente');
        logActivity({
          type: 'Nueva enfermedad',
          name: payload.name,
        });
      }
      
      setShowModal(false);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Error saving disease:', error);
      toast.error('Error al guardar la enfermedad');
    }
  };

  const handleEdit = (disease: any) => {
    setEditingDisease(disease);
    setFormData({
      name: disease.name,
      technincal_name: disease.technincal_name,
      description: disease.description,
      priority_id: disease.priority_id,
    });
    setShowModal(true);
  };

  const handleDelete = async (disease: any) => {
    if (window.confirm('¿Está seguro de eliminar esta enfermedad?')) {
      try {
        await deleteDisease(disease.id);
        toast.success('Enfermedad eliminada exitosamente');
        logActivity({
          type: 'Enfermedad eliminada',
          name: disease.name,
        });
        loadData();
      } catch (error) {
        console.error('Error deleting disease:', error);
        toast.error('Error al eliminar la enfermedad');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      technincal_name: '',
      description: '',
      priority_id: '',
    });
    setEditingDisease(null);
  };

  const prioritiesMap = useMemo(() => new Map(priorities.map((p: any) => [p.id, p])), [priorities]);

  const filteredDiseases = useMemo(() => {
    const lower = searchTerm.toLowerCase();
    return diseases.filter((disease: any) =>
      disease.name?.toLowerCase().includes(lower) ||
      disease.technincal_name?.toLowerCase().includes(lower)
    );
  }, [diseases, searchTerm]);

  const columns = useMemo(() => [
    { header: 'ID', accessor: 'id' },
    { header: 'Nombre', accessor: 'name' },
    { header: 'Nombre Técnico', accessor: 'technincal_name' },
    { header: 'Descripción', accessor: 'description' },
    {
      header: 'Prioridad',
      accessor: 'priority_id',
      render: (value: any) => {
        const priority = prioritiesMap.get(value);
        return priority ? (
          <span className={`px-2 py-1 text-xs rounded-full ${
            priority.name === 'High' || priority.name === 'Alta'
              ? 'bg-red-100 text-red-700'
              : priority.name === 'Medium' || priority.name === 'Media'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-green-100 text-green-700'
          }`}>
            {priority.name}
          </span>
        ) : '-';
      }
    },
  ], [prioritiesMap]);

  return (
    <div className="app-page p-8">
      <div className="app-page-header flex items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Enfermedades</h1>
          <p className="text-gray-500">Catálogo de enfermedades registradas</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nueva Enfermedad
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="app-page-search relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar enfermedades..."
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
          data={filteredDiseases}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Modal */}
      {showModal && (
        <div className="app-modal-overlay fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="app-modal-panel bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingDisease ? 'Editar Enfermedad' : 'Nueva Enfermedad'}
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
                  Nombre Técnico *
                </label>
                <input
                  type="text"
                  required
                  maxLength={255}
                  value={formData.technincal_name}
                  onChange={(e) => setFormData({ ...formData, technincal_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="text-right mt-1">
                  <span className={`text-xs ${formData.technincal_name.length >= 255 ? 'text-red-500' : 'text-gray-500'}`}>
                    {formData.technincal_name.length}/255
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción *
                </label>
                <textarea
                  required
                  maxLength={255}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="text-right mt-1">
                  <span className={`text-xs ${formData.description.length >= 255 ? 'text-red-500' : 'text-gray-500'}`}>
                    {formData.description.length}/255
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prioridad *
                </label>
                <select
                  required
                  value={formData.priority_id}
                  onChange={(e) => setFormData({ ...formData, priority_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar...</option>
                  {priorities.map((priority) => (
                    <option key={priority.id} value={priority.id}>
                      {priority.name}
                    </option>
                  ))}
                </select>
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
                  {editingDisease ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
