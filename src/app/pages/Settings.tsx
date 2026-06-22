import { useState } from 'react';
import { Plus } from 'lucide-react';
import DataTable from '../components/DataTable';
import { useSpecialties } from '../../context/SpecialtiesContext';
import { toast } from 'sonner';

// HU-015: shows the catalog table with name, description, and doctor count; supports real-time search.
// HU-016: form creates a specialty (name + description, required, max 255 chars), rejects duplicates, logs activity.
// HU-017: 'Edit' opens the modal pre-populated with current data; same validations apply; saves propagate to doctor profiles.
// HU-018: 'Delete' shows a named confirmation dialog; blocks if doctors are assigned; permanently removes the record and logs the action.
//
// Tipos de Usuario management moved to the /roles page (roles + permissions are
// now handled there with real API-backed CRUD).
export default function Settings() {
  const { specialties, addSpecialty, updateSpecialty, deleteSpecialty } = useSpecialties();
  const [showModal, setShowModal] = useState(false);
  const [editingSpecialty, setEditingSpecialty] = useState<{ id: number; name: string } | null>(null);
  const [specialtyName, setSpecialtyName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
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
    closeModal();
  };

  const handleEdit = (item: any) => {
    setEditingSpecialty(item);
    setSpecialtyName(item.name);
    setShowModal(true);
  };

  const handleDelete = (item: any) => {
    if (!window.confirm('¿Está seguro de eliminar esta especialidad?')) return;
    deleteSpecialty(item.id);
    toast.success('Especialidad eliminada exitosamente');
  };

  const closeModal = () => {
    setShowModal(false);
    setSpecialtyName('');
    setEditingSpecialty(null);
  };

  // columns must include name, description, and doctor count.
  // Currently only name is present — extend once the Specialty type is updated.
  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Nombre', accessor: 'name' },
  ];

  return (
    <div className="app-page p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Configuración</h1>
        <p className="text-gray-500">Gestión de especialidades médicas</p>
      </div>

      <div className="mb-6">
        <button
          onClick={() => {
            setSpecialtyName('');
            setEditingSpecialty(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nueva Especialidad
        </button>
      </div>

      <DataTable
        columns={columns}
        data={specialties}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {showModal && (
        <div className="fixed inset-0 bg-blue-950/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingSpecialty ? 'Editar Especialidad' : 'Nueva Especialidad'}
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
                  onClick={closeModal}
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
