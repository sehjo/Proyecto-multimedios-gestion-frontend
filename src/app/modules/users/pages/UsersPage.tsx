import { useState } from 'react';
import PageContainer from '../../../components/PageContainer';
import PageHeader from '../../../components/PageHeader';
import { useAuth } from '@/app/modules/auth';
import { useUsers } from '../hooks/useUsers';
import { useUserForm } from '../hooks/useUserForm';
import { useOpenCreateFromQuery } from '../hooks/useOpenCreateFromQuery';
import {
  NewUserButton,
  UsersBanner,
  UsersSearchBar,
  UsersTable,
  UsersPagination,
  UsersStatePlaceholder,
  UserDetailsModal,
  UserFormModal,
  ConfirmStatusModal,
} from '../components';
import type { User } from '../types/users.types';

export default function UsersPage() {
  const { can } = useAuth();

  // Permission gates (UX only; the backend enforces each endpoint).
  const canCreate = can('users.create');
  const canUpdate = can('users.update');

  const {
    canView,
    roles,
    loading,
    searchTerm,
    setSearchTerm,
    page,
    setPage,
    totalPages,
    filteredUsers,
    pagedUsers,
    banner,
    showBanner,
    dismissBanner,
    loadData,
    changeStatus,
    confirming,
  } = useUsers();

  const form = useUserForm((msg) => {
    showBanner(msg);
    loadData();
  });

  useOpenCreateFromQuery(form.openCreate);

  // Which user each modal is acting on (view = read-only, confirm = status).
  const [viewUser, setViewUser] = useState<User | null>(null);
  const [confirmUser, setConfirmUser] = useState<User | null>(null);

  const handleConfirmStatus = async () => {
    if (!confirmUser) return;
    const ok = await changeStatus(confirmUser);
    if (ok) setConfirmUser(null);
  };

  const openEditFromView = (user: User) => {
    setViewUser(null);
    form.openEdit(user);
  };

  return (
    <PageContainer>
      <PageHeader title="Usuarios" subtitle="Gestión de usuarios del sistema">
        {canCreate && <NewUserButton onClick={form.openCreate} />}
      </PageHeader>

      <UsersBanner banner={banner} onDismiss={dismissBanner} />

      <UsersSearchBar value={searchTerm} onChange={setSearchTerm} />

      {!canView ? (
        <UsersStatePlaceholder
          title="No tiene acceso a esta sección."
          subtitle="No cuenta con el permiso para ver usuarios."
        />
      ) : loading ? (
        <UsersStatePlaceholder title="Cargando..." />
      ) : (
        <UsersTable
          users={pagedUsers}
          canUpdate={canUpdate}
          onView={setViewUser}
          onEdit={form.openEdit}
          onChangeStatus={setConfirmUser}
        />
      )}

      {canView && !loading && totalPages > 1 && (
        <UsersPagination
          page={page}
          totalPages={totalPages}
          totalItems={filteredUsers.length}
          onPageChange={setPage}
        />
      )}

      {viewUser && (
        <UserDetailsModal
          user={viewUser}
          canUpdate={canUpdate}
          onClose={() => setViewUser(null)}
          onEdit={openEditFromView}
        />
      )}

      {form.showModal && (
        <UserFormModal
          editingUser={form.editingUser}
          formData={form.formData}
          roles={roles}
          submitting={form.submitting}
          onFieldChange={form.updateField}
          onCancel={form.closeModal}
          onSubmit={form.handleSubmit}
        />
      )}

      {confirmUser && (
        <ConfirmStatusModal
          user={confirmUser}
          confirming={confirming}
          onCancel={() => setConfirmUser(null)}
          onConfirm={handleConfirmStatus}
        />
      )}
    </PageContainer>
  );
}
