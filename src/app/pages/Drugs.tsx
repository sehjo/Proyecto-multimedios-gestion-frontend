import { useState, useEffect, useMemo } from 'react';
import { Plus, Search } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';
import DataTable from '../components/DataTable';
import { getDrugs, createDrug, updateDrug, deleteDrug } from '../../api/services';
import { toast } from 'sonner';
import { useActivity } from '../../context/ActivityContext';

const DRUG_TYPES = [
  { value: 'tablet', label: 'Tableta' },
  { value: 'capsule', label: 'Cápsula' },
  { value: 'syrup', label: 'Jarabe' },
  { value: 'injection', label: 'Inyección' },
  { value: 'topical', label: 'Tópico' },
  { value: 'other', label: 'Otro' },
];

export default function Drugs() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logActivity } = useActivity();
  const [drugs, setDrugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDrug, setEditingDrug] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
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
      const drugsData = await getDrugs().catch(() => ({ data: [] }));
      setDrugs(drugsData.data || []);
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
      if (editingDrug) {
        await updateDrug(editingDrug.id, formData);
        toast.success('Medicamento actualizado exitosamente');
        logActivity({
          type: 'Medicamento actualizado',
          name: formData.name,
        });
      } else {
        await createDrug(formData);
        toast.success('Medicamento creado exitosamente');
        logActivity({
          type: 'Nuevo medicamento',
          name: formData.name,
        });
      }
      
      setShowModal(false);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Error saving drug:', error);
      toast.error('Error al guardar el medicamento');
    }
  };

  const handleEdit = (drug: any) => {
    setEditingDrug(drug);
    setFormData({
      name: drug.name,
      description: drug.description,
      type: drug.type,
    });
    setShowModal(true);
  };

  const handleDelete = async (drug: any) => {
    if (window.confirm('¿Está seguro de eliminar este medicamento?')) {
      try {
        await deleteDrug(drug.id);
        toast.success('Medicamento eliminado exitosamente');
        logActivity({
          type: 'Medicamento eliminado',
          name: drug.name,
        });
        loadData();
      } catch (error) {
        console.error('Error deleting drug:', error);
        toast.error('Error al eliminar el medicamento');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: '',
    });
    setEditingDrug(null);
  };

  const filteredDrugs = useMemo(() => {
    const lower = searchTerm.toLowerCase();
    return drugs.filter((drug: any) =>
      drug.name?.toLowerCase().includes(lower) ||
      drug.description?.toLowerCase().includes(lower)
    );
  }, [drugs, searchTerm]);

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Nombre', accessor: 'name' },
    { header: 'Descripción', accessor: 'description' },
    { 
      header: 'Tipo', 
      accessor: 'type',
      render: (value: any) => {
        const type = DRUG_TYPES.find(t => t.value === value);
        return type ? (
          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
            {type.label}
          </span>
        ) : value;
      }
    },
  ];

  return (
    <div className="app-page p-8">
      <div className="app-page-header flex items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Medicamentos</h1>
          <p className="text-gray-500">Catálogo de medicamentos disponibles</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nuevo Medicamento
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="app-page-search relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar medicamentos..."
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
          data={filteredDrugs}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Modal */}
      {showModal && (
        <div className="app-modal-overlay fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="app-modal-panel bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingDrug ? 'Editar Medicamento' : 'Nuevo Medicamento'}
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
                  Tipo *
                </label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar...</option>
                  {DRUG_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
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
                  {editingDrug ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
