import { useState } from 'react';
import { Loader2, Plus, X } from 'lucide-react';
import editIcon from '@/assets/edit.svg';
import deleteIcon from '@/assets/delete.svg';
import DoctorsBanner from './DoctorsBanner';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import SpecialityFormFields from './SpecialityFormFields';
import { useSpecialities } from '../hooks/useSpecialities';
import { useSpecialityForm } from '../hooks/useSpecialityForm';
import type { Speciality } from '../types/doctors.types';

interface SpecialitiesManagerModalProps {
  onClose: () => void;
  // Lets the doctors page refresh its speciality picker after a catalog change.
  onChanged: () => void;
}

// Nested CRUD for the specialities catalog, opened from the doctors page
// header so specialities never need their own route.
export default function SpecialitiesManagerModal({ onClose, onChanged }: SpecialitiesManagerModalProps) {
  const {
    loading,
    search,
    setSearch,
    visibleSpecialities,
    banner,
    showBanner,
    dismissBanner,
    loadSpecialities,
    removeSpeciality,
    confirming,
  } = useSpecialities();

  const form = useSpecialityForm((msg) => {
    showBanner(msg);
    loadSpecialities();
    onChanged();
  });

  const [confirmSpeciality, setConfirmSpeciality] = useState<Speciality | null>(null);

  const handleConfirmDelete = async () => {
    if (!confirmSpeciality) return;
    const ok = await removeSpeciality(confirmSpeciality);
    if (ok) {
      setConfirmSpeciality(null);
      onChanged();
    }
  };

  return (
    <div className="app-modal-overlay fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="app-modal-panel bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Especialidades</h2>
            <p className="text-xs text-gray-400">Catálogo de especialidades médicas.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-4 overflow-y-auto flex-1">
          <DoctorsBanner banner={banner} onDismiss={dismissBanner} />

          {form.showModal ? (
            <SpecialityFormFields
              editingSpeciality={form.editingSpeciality}
              formData={form.formData}
              submitting={form.submitting}
              onFieldChange={form.updateField}
              onCancel={form.closeModal}
              onSubmit={form.handleSubmit}
            />
          ) : (
            <div className="flex items-center gap-3 mb-4">
              <input
                type="text"
                placeholder="Buscar especialidades..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={form.openCreate}
                className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                Nueva
              </button>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center gap-3 text-gray-400 py-10">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Cargando...</span>
            </div>
          ) : visibleSpecialities.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-10">No hay especialidades disponibles</p>
          ) : (
            <ul className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden">
              {visibleSpecialities.map((speciality) => (
                <li key={speciality.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900">{speciality.name}</p>
                    {speciality.description && (
                      <p className="text-xs text-gray-400 truncate">{speciality.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => form.openEdit(speciality)}
                      title="Editar"
                      className="cursor-pointer transition-opacity hover:opacity-80"
                    >
                      <img src={editIcon} alt="Editar" className="w-8 h-8" />
                    </button>
                    <button
                      onClick={() => setConfirmSpeciality(speciality)}
                      title="Eliminar"
                      className="cursor-pointer transition-opacity hover:opacity-80"
                    >
                      <img src={deleteIcon} alt="Eliminar" className="w-8 h-8" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {confirmSpeciality && (
        <ConfirmDeleteModal
          message="¿Seguro que deseas eliminar esta especialidad?"
          confirming={confirming}
          onCancel={() => setConfirmSpeciality(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}
