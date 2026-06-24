import { useState } from 'react';
import PageContainer from '@/app/components/PageContainer';
import PageHeader from '@/app/components/PageHeader';
import { useDoctors } from '../hooks/useDoctors';
import { useDoctorForm } from '../hooks/useDoctorForm';
import { useSpecialities } from '../hooks/useSpecialities';
import { useOpenCreateFromQuery } from '../hooks/useOpenCreateFromQuery';
import {
  NewDoctorButton,
  DoctorsBanner,
  DoctorsToolbar,
  DoctorsStatePlaceholder,
  DoctorsTable,
  DoctorFormModal,
  ConfirmDeleteModal,
  SpecialitiesManagerModal,
} from '../components';
import type { Doctor } from '../types/doctors.types';

export default function DoctorsPage() {
  const {
    loading,
    search,
    setSearch,
    visibleDoctors,
    banner,
    showBanner,
    dismissBanner,
    loadDoctors,
    removeDoctor,
    confirming,
  } = useDoctors();

  // Feeds the doctor form's speciality picker; reloaded after the nested
  // specialities manager creates/edits/deletes a catalog entry.
  const { specialities, loadSpecialities } = useSpecialities();

  const form = useDoctorForm((msg) => {
    showBanner(msg);
    loadDoctors();
  });

  useOpenCreateFromQuery(form.openCreate);

  const [confirmDoctor, setConfirmDoctor] = useState<Doctor | null>(null);
  const [specialitiesOpen, setSpecialitiesOpen] = useState(false);

  const handleConfirmDelete = async () => {
    if (!confirmDoctor) return;
    const ok = await removeDoctor(confirmDoctor);
    if (ok) setConfirmDoctor(null);
  };

  return (
    <PageContainer>
      <PageHeader title="Doctores" subtitle="Gestión del personal médico">
        <NewDoctorButton onClick={form.openCreate} />
      </PageHeader>

      <DoctorsBanner banner={banner} onDismiss={dismissBanner} />

      <DoctorsToolbar
        search={search}
        onSearchChange={setSearch}
        onOpenSpecialities={() => setSpecialitiesOpen(true)}
      />

      {loading ? (
        <DoctorsStatePlaceholder title="Cargando..." />
      ) : (
        <DoctorsTable
          doctors={visibleDoctors}
          loading={loading}
          onEdit={form.openEdit}
          onDelete={setConfirmDoctor}
        />
      )}

      {form.showModal && (
        <DoctorFormModal
          editingDoctor={form.editingDoctor}
          formData={form.formData}
          specialities={specialities}
          submitting={form.submitting}
          onFieldChange={form.updateField}
          onCancel={form.closeModal}
          onSubmit={form.handleSubmit}
        />
      )}

      {confirmDoctor && (
        <ConfirmDeleteModal
          message="¿Seguro que deseas eliminar este doctor?"
          confirming={confirming}
          onCancel={() => setConfirmDoctor(null)}
          onConfirm={handleConfirmDelete}
        />
      )}

      {specialitiesOpen && (
        <SpecialitiesManagerModal
          onClose={() => setSpecialitiesOpen(false)}
          onChanged={loadSpecialities}
        />
      )}
    </PageContainer>
  );
}
