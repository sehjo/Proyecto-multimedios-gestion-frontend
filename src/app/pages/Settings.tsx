import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import DataTable from '../components/DataTable';
import {
  getUserTypes,
  createUserType,
  updateUserType,
  deleteUserType,
} from '../../api/services';
import { toast } from 'sonner';

export default function Settings() {
  const [userTypes, setUserTypes] = useState([]);
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
      const userTypesData = await getUserTypes().catch(() => ({ data: [] }));
      setUserTypes(userTypesData.data || []);
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
      if (editingItem) {
        await updateUserType(editingItem.id, { name: formName });
        toast.success('Tipo de usuario actualizado exitosamente');
      } else {
        await createUserType({ name: formName });
        toast.success('Tipo de usuario creado exitosamente');
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
        await deleteUserType(item.id);
        toast.success('Tipo de usuario eliminado exitosamente');
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
        <p className="text-gray-500">Gestión de tipos de usuario</p>
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
          Nuevo Tipo de Usuario
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500">Cargando...</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={userTypes}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {showModal && (
        <div className="fixed inset-0 bg-blue-950/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingItem ? 'Editar Tipo de Usuario' : 'Nuevo Tipo de Usuario'}
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
                  placeholder="ej. Doctor, Enfermera"
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
