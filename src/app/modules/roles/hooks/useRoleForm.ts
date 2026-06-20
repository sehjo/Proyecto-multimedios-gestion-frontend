import { useState, FormEvent } from 'react';
import { toast } from 'sonner';
import { enableWithDeps, disableWithDeps } from '../../../lib/permissions';
import { createRole, updateRole } from '../services/rolesService';
import { NAME_MAX, NAME_REGEX, isProtectedRole } from '../constants';
import type { Role, RoleFormErrors } from '../types/roles.types';

// Owns the create/edit role form: name, permission set (with coupled toggling),
// validation and submit (create vs update with a no-op guard). onSaved lets the
// page refresh the list and show the result banner.
export function useRoleForm(onSaved: (msg: string, type?: 'success' | 'info') => void) {
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [name, setName] = useState('');
  const [permissions, setPermissions] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState<RoleFormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setEditingRole(null);
    setName('');
    setPermissions(new Set());
    setErrors({});
  };

  const openCreate = () => {
    reset();
    setShowModal(true);
  };

  const openEdit = (role: Role) => {
    setEditingRole(role);
    setName(role.name);
    setPermissions(new Set(role.permissions));
    setErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    reset();
  };

  const updateName = (value: string) => {
    setName(value);
    if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
  };

  // Coupled toggling: enabling cascades forward (write → read); disabling read
  // cascades backward (drops the module's write actions).
  const togglePermission = (permName: string) => {
    setPermissions((prev) =>
      prev.has(permName) ? disableWithDeps(prev, permName) : enableWithDeps(prev, permName)
    );
    if (errors.permissions) setErrors((p) => ({ ...p, permissions: undefined }));
  };

  const validate = (): boolean => {
    const next: RoleFormErrors = {};
    const trimmed = name.trim();
    if (!trimmed) next.name = 'El nombre del rol es obligatorio.';
    else if (trimmed.length > NAME_MAX) next.name = `El nombre no debe superar los ${NAME_MAX} caracteres.`;
    else if (!NAME_REGEX.test(trimmed)) next.name = 'Solo se permiten letras, números, espacios y guiones.';
    if (permissions.size === 0) next.permissions = 'Seleccione al menos un permiso.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return; // ignore rapid double clicks
    if (!validate()) return;
    setSubmitting(true);
    try {
      const effective = [...permissions]; // already coupled-resolved
      const trimmed = name.trim();

      if (editingRole) {
        // PUT /roles/{id} validates `name` as required even when only the
        // permissions change, so always send the name; permissions go only when
        // they actually changed.
        const nameChanged = trimmed !== editingRole.name;
        const before = new Set(editingRole.permissions);
        const permsChanged =
          effective.length !== before.size || effective.some((p) => !before.has(p));

        // No-op guard: nothing to save.
        if (!nameChanged && !permsChanged) {
          closeModal();
          onSaved('No hay cambios por guardar.', 'info');
          return;
        }

        const payload: { name: string; permissions?: string[] } = { name: trimmed };
        if (permsChanged) payload.permissions = effective;

        await updateRole(editingRole.id, payload);
        onSaved('Se ha actualizado correctamente el registro.');
      } else {
        await createRole({ name: trimmed, permissions: effective });
        onSaved('Se ha creado correctamente el registro.');
      }
      closeModal();
    } catch (error: any) {
      // Map field errors back into the form; keep the modal open to retry.
      const apiErrors = error?.response?.data?.errors;
      if (apiErrors) {
        setErrors({
          name: apiErrors.name?.[0],
          permissions: apiErrors.permissions?.[0],
        });
      }
      toast.error(error?.response?.data?.message || 'Error al guardar el rol.');
    } finally {
      setSubmitting(false);
    }
  };

  // Protected (system) roles can't be renamed; their permissions can still change.
  const nameLocked = !!editingRole && isProtectedRole(editingRole.name);

  return {
    showModal,
    editingRole,
    name,
    permissions,
    errors,
    submitting,
    nameLocked,
    openCreate,
    openEdit,
    closeModal,
    updateName,
    togglePermission,
    handleSubmit,
  };
}
