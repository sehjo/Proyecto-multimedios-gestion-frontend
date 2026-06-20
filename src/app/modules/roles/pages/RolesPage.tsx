import { useState } from 'react';
import PageContainer from '@/app/components/PageContainer';
import PageHeader from '@/app/components/PageHeader';
import { useAuth } from '@/app/modules/auth';
import { useRoles } from '../hooks/useRoles';
import { useRoleForm } from '../hooks/useRoleForm';
import {
  NewRoleButton,
  AssignRolesButton,
  RolesBanner,
  RolesToolbar,
  RolesStatePlaceholder,
  RolesListSection,
  RoleFormModal,
  RoleDetailsModal,
  ConfirmDeleteRoleModal,
  PermissionCatalogModal,
  AssignRolesModal,
} from '../components';
import type { Role } from '../types/roles.types';

export default function RolesPage() {
  const { can, user: authUser } = useAuth();

  // Permission gates (UX only; the backend enforces each endpoint).
  const canCreate = can('roles.create');
  const canUpdate = can('roles.update');
  const canDelete = can('roles.delete');
  const canAssignRoles = can('users.update'); // assigning a user's role

  // You cannot edit a role you currently hold (PUT on your own role → 403).
  const isOwnRole = (role: Role) => (authUser?.roles ?? []).includes(role.name);

  const {
    canView,
    permissions,
    grid,
    loading,
    search,
    setSearch,
    visibleRoles,
    banner,
    showBanner,
    dismissBanner,
    loadRoles,
    removeRole,
    confirming,
  } = useRoles();

  const form = useRoleForm((msg, type) => {
    showBanner(msg, type);
    loadRoles();
  });

  // Local UI state: which modal/role each overlay is acting on.
  const [viewRole, setViewRole] = useState<Role | null>(null);
  const [confirmRole, setConfirmRole] = useState<Role | null>(null);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [assignRolesOpen, setAssignRolesOpen] = useState(false);

  const openEditFromView = (role: Role) => {
    setViewRole(null);
    form.openEdit(role);
  };

  const handleConfirmDelete = async () => {
    if (!confirmRole) return;
    const ok = await removeRole(confirmRole);
    if (ok) setConfirmRole(null);
  };

  return (
    <PageContainer>
      <PageHeader title="Roles" subtitle="Gestión de roles del sistema">
        {canCreate && <NewRoleButton onClick={form.openCreate} />}
        {canAssignRoles && <AssignRolesButton onClick={() => setAssignRolesOpen(true)} />}
      </PageHeader>

      {!canView ? (
        <RolesStatePlaceholder
          title="No tiene acceso a esta sección."
          subtitle="No cuenta con el permiso para ver roles."
        />
      ) : (
        <>
          <RolesBanner banner={banner} onDismiss={dismissBanner} />

          <RolesToolbar
            search={search}
            onSearchChange={setSearch}
            onOpenCatalog={() => setCatalogOpen(true)}
          />

          <RolesListSection
            roles={visibleRoles}
            loading={loading}
            canUpdate={canUpdate}
            canDelete={canDelete}
            isOwnRole={isOwnRole}
            onView={setViewRole}
            onEdit={form.openEdit}
            onDelete={setConfirmRole}
          />
        </>
      )}

      {form.showModal && (
        <RoleFormModal
          editingRole={form.editingRole}
          name={form.name}
          permissions={form.permissions}
          errors={form.errors}
          submitting={form.submitting}
          nameLocked={form.nameLocked}
          grid={grid}
          onNameChange={form.updateName}
          onTogglePermission={form.togglePermission}
          onCancel={form.closeModal}
          onSubmit={form.handleSubmit}
        />
      )}

      {viewRole && (
        <RoleDetailsModal
          role={viewRole}
          grid={grid}
          canUpdate={canUpdate && !isOwnRole(viewRole)}
          onClose={() => setViewRole(null)}
          onEdit={openEditFromView}
        />
      )}

      {confirmRole && (
        <ConfirmDeleteRoleModal
          confirming={confirming}
          onCancel={() => setConfirmRole(null)}
          onConfirm={handleConfirmDelete}
        />
      )}

      {catalogOpen && (
        <PermissionCatalogModal
          grid={grid}
          permissions={permissions}
          onClose={() => setCatalogOpen(false)}
        />
      )}

      {assignRolesOpen && (
        <AssignRolesModal
          onClose={() => setAssignRolesOpen(false)}
          onAssigned={(msg) => {
            setAssignRolesOpen(false);
            showBanner(msg);
          }}
        />
      )}
    </PageContainer>
  );
}
