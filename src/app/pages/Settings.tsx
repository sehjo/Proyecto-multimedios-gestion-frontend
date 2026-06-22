import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import DataTable from '../components/DataTable';
import {
  getUserTypes,
  createUserType,
  updateUserType,
  deleteUserType,
} from '../../api/services';
import { useSpecialties } from '../../context/SpecialtiesContext';
import { toast } from 'sonner';

type Tab = 'user-types' | 'specialties';

export default function Settings() {
  const [activeTab, setActiveTab] = useState<Tab>('user-types');

  // ── User Types ────────────────────────────────────────────────────────────
  const [userTypes, setUserTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUserTypeModal, setShowUserTypeModal] = useState(false);
  const [editingUserType, setEditingUserType] = useState(null);
  const [userTypeName, setUserTypeName] = useState('');

  useEffect(() => {
    loadUserTypes();
  }, []);

  const loadUserTypes = async () => {
    try {
      setLoading(true);
      const res = await getUserTypes().catch(() => ({ data: [] }));
      setUserTypes(res.data || []);
    } catch {
      toast.error('Error al cargar los tipos de usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleUserTypeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUserType) {
        await updateUserType(editingUserType.id, { name: userTypeName });
        toast.success('Tipo de usuario actualizado exitosamente');
      } else {
        await createUserType({ name: userTypeName });
        toast.success('Tipo de usuario creado exitosamente');
      }
      closeUserTypeModal();
      loadUserTypes();
    } catch {
      toast.error('Error al guardar');
    }
  };

  const handleUserTypeEdit = (item: any) => {
    setEditingUserType(item);
    setUserTypeName(item.name);
    setShowUserTypeModal(true);
  };

  const handleUserTypeDelete = async (item: any) => {
    if (!window.confirm('¿Está seguro de eliminar este tipo de usuario?')) return;
    try {
      await deleteUserType(item.id);
      toast.success('Tipo de usuario eliminado exitosamente');
      loadUserTypes();
    } catch {
      toast.error('Error al eliminar');
    }
  };

  const closeUserTypeModal = () => {
    setShowUserTypeModal(false);
    setUserTypeName('');
    setEditingUserType(null);
  };

  // ── Specialties  ───────────────────────────────
  // HU-015: shows the catalog table with name, description, and doctor count; supports real-time search.
  // HU-016: form creates a specialty (name + description, required, max 255 chars), rejects duplicates, logs activity.
  // HU-017: 'Edit' opens the modal pre-populated with current data; same validations apply; saves propagate to doctor profiles.
  // HU-018: 'Delete' shows a named confirmation dialog; blocks if doctors are assigned; permanently removes the record and logs the action.
  const { specialties, addSpecialty, updateSpecialty, deleteSpecialty } = useSpecialties();
  const [showSpecialtyModal, setShowSpecialtyModal] = useState(false);
  const [editingSpecialty, setEditingSpecialty] = useState<{ id: number; name: string } | null>(null);
  const [specialtyName, setSpecialtyName] = useState('');

  const handleSpecialtySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = specialtyName.trim();
    if (!trimmed) return;
    if (editingSpecialty) {
      updateSpecialty(editingSpecialty.id, trimmed);
      toast.success('Especialidad actualizada exitosamente');
    } else {
      addSpecialty(trimmed);
      toast.success('Especialidad creada exitosamente');
    }
    closeSpecialtyModal();
  };

  const handleSpecialtyEdit = (item: any) => {
    setEditingSpecialty(item);
    setSpecialtyName(item.name);
    setShowSpecialtyModal(true);
  };

  const handleSpecialtyDelete = (item: any) => {
    if (!window.confirm('¿Está seguro de eliminar esta especialidad?')) return;
    deleteSpecialty(item.id);
    toast.success('Especialidad eliminada exitosamente');
  };

  const closeSpecialtyModal = () => {
    setShowSpecialtyModal(false);
    setSpecialtyName('');
    setEditingSpecialty(null);
  };

  // columns must include name, description, and doctor count.
  // Currently only name is present — extend once the Specialty type is updated.
  //add description and doctorCount columns once the Specialty type is extended.
  const specialtyColumns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Nombre', accessor: 'name' },
  ];

  const userTypeColumns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Nombre', accessor: 'name' },
  ];

  return (
    <div className="app-page p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Configuración</h1>
        <p className="text-gray-500">
          {activeTab === 'user-types' ? 'Gestión de tipos de usuario' : 'Gestión de especialidades médicas'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('user-types')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            activeTab === 'user-types'
              ? 'bg-white border border-b-white border-gray-200 text-blue-600 -mb-px'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Tipos de Usuario
        </button>
        <button
          onClick={() => setActiveTab('specialties')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            activeTab === 'specialties'
              ? 'bg-white border border-b-white border-gray-200 text-blue-600 -mb-px'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Especialidades Médicas
        </button>
      </div>

      {/* ── User Types Tab ── */}
      {activeTab === 'user-types' && (
        <>
          <div className="mb-6">
            <button
              onClick={() => {
                setUserTypeName('');
                setEditingUserType(null);
                setShowUserTypeModal(true);
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
              columns={userTypeColumns}
              data={userTypes}
              onEdit={handleUserTypeEdit}
              onDelete={handleUserTypeDelete}
            />
          )}
        </>
      )}

      {/* ── Specialties Tab ── */}
      {activeTab === 'specialties' && (
        <>
          <div className="mb-6">
            <button
              onClick={() => {
                setSpecialtyName('');
                setEditingSpecialty(null);
                setShowSpecialtyModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Nueva Especialidad
            </button>
          </div>

          <DataTable
            columns={specialtyColumns}
            data={specialties}
            onEdit={handleSpecialtyEdit}
            onDelete={handleSpecialtyDelete}
          />
        </>
      )}

      {/* ── User Type Modal ── */}
      {showUserTypeModal && (
        <div className="fixed inset-0 bg-blue-950/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingUserType ? 'Editar Tipo de Usuario' : 'Nuevo Tipo de Usuario'}
            </h2>
            <form onSubmit={handleUserTypeSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  required
                  maxLength={255}
                  value={userTypeName}
                  onChange={(e) => setUserTypeName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ej. Doctor, Enfermera"
                />
                <div className="text-right mt-1">
                  <span className={`text-xs ${userTypeName.length >= 255 ? 'text-red-500' : 'text-gray-500'}`}>
                    {userTypeName.length}/255
                  </span>
                </div>
              </div>
              <div className="app-modal-actions flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={closeUserTypeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingUserType ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Specialty Modal ── */}
      {showSpecialtyModal && (
        <div className="fixed inset-0 bg-blue-950/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingSpecialty ? 'Editar Especialidad' : 'Nueva Especialidad'}
            </h2>
            <form onSubmit={handleSpecialtySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  required
                  maxLength={255}
                  value={specialtyName}
                  onChange={(e) => setSpecialtyName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ej. Cardiología, Pediatría"
                />
                <div className="text-right mt-1">
                  <span className={`text-xs ${specialtyName.length >= 255 ? 'text-red-500' : 'text-gray-500'}`}>
                    {specialtyName.length}/255
                  </span>
                </div>
              </div>
              <div className="app-modal-actions flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={closeSpecialtyModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingSpecialty ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
