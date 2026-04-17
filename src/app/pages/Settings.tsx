import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import DataTable from '../components/DataTable';
import { 
  getUserTypes, 
  createUserType, 
  updateUserType, 
  deleteUserType,
  getPriorities,
  createPriority,
  updatePriority,
  deletePriority
} from '../../api/services';
import { toast } from 'sonner';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('userTypes');
  const [userTypes, setUserTypes] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formName, setFormName] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [userTypesData, prioritiesData] = await Promise.all([
        getUserTypes().catch(() => ({ data: [] })),
        getPriorities().catch(() => ({ data: [] })),
      ]);
      
      setUserTypes(userTypesData.data || []);
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
      if (activeTab === 'userTypes') {
        if (editingItem) {
          await updateUserType(editingItem.id, { name: formName });
          toast.success('Tipo de usuario actualizado exitosamente');
        } else {
          await createUserType({ name: formName });
          toast.success('Tipo de usuario creado exitosamente');
        }
      } else {
        if (editingItem) {
          await updatePriority(editingItem.id, formName);
          toast.success('Prioridad actualizada exitosamente');
        } else {
          await createPriority(formName);
          toast.success('Prioridad creada exitosamente');
        }
      }
      
      setShowModal(false);
      setFormName('');
      setEditingItem(null);
      loadData();
    } catch (error) {
      console.error('Error saving:', error);
      toast.error('Error al guardar');
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormName(item.name);
    setShowModal(true);
  };

  const handleDelete = async (item: any) => {
    if (window.confirm('¿Está seguro de eliminar este elemento?')) {
      try {
        if (activeTab === 'userTypes') {
          await deleteUserType(item.id);
          toast.success('Tipo de usuario eliminado exitosamente');
        } else {
          await deletePriority(item.id);
          toast.success('Prioridad eliminada exitosamente');
        }
        loadData();
      } catch (error) {
        console.error('Error deleting:', error);
        toast.error('Error al eliminar');
      }
    }
  };

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Nombre', accessor: 'name' },
  ];

  return (
    <div className="app-page p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Configuración</h1>
        <p className="text-gray-500">Gestión de tipos de usuario y prioridades</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="app-page-tabs flex gap-4">
          <button
            onClick={() => setActiveTab('userTypes')}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === 'userTypes'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Tipos de Usuario
          </button>
          <button
            onClick={() => setActiveTab('priorities')}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === 'priorities'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Prioridades
          </button>
        </nav>
      </div>

      <div className="mb-6">
        <button
          onClick={() => {
            setFormName('');
            setEditingItem(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          {activeTab === 'userTypes' ? 'Nuevo Tipo de Usuario' : 'Nueva Prioridad'}
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500">Cargando...</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={activeTab === 'userTypes' ? userTypes : priorities}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-blue-950/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingItem 
                ? `Editar ${activeTab === 'userTypes' ? 'Tipo de Usuario' : 'Prioridad'}`
                : `Nuevo ${activeTab === 'userTypes' ? 'Tipo de Usuario' : 'Prioridad'}`
              }
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
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={activeTab === 'userTypes' ? 'ej. Doctor, Enfermera' : 'ej. Alta, Media, Baja'}
                />
                <div className="text-right mt-1">
                  <span className={`text-xs ${formName.length >= 255 ? 'text-red-500' : 'text-gray-500'}`}>
                    {formName.length}/255
                  </span>
                </div>
              </div>
              <div className="app-modal-actions flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setFormName('');
                    setEditingItem(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingItem ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
