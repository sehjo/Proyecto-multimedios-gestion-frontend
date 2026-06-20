import { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, Search, X, Shield, Loader2, CheckCircle2, Info } from 'lucide-react';
import { toast } from 'sonner';
import {
  getRoles, createRole, updateRole, deleteRole, getPermissions,
} from '../../api/services';
import { useAuth } from '../../context/AuthContext';
import { buildPermissionGrid, enableWithDeps, disableWithDeps, PermissionRow } from '../lib/permissions';
import PermissionGrid from '../components/PermissionGrid';
import AssignRolesModal from '../components/AssignRolesModal';
import PageHeader from '../components/PageHeader';
import editIcon from '../../assets/edit.svg';
import deleteIcon from '../../assets/delete.svg';

interface RoleRow {
  id: number;
  name: string;
  permissions: string[];   // permission names (<module>.<action>)
}

// System base roles: cannot be renamed or deleted (their permissions can still
// be adjusted). Mirrors RoleController::PROTECTED_ROLES on the backend.
const PROTECTED_ROLES = ['Administrador', 'Medico', 'Enfermero', 'Paciente'];

const NAME_REGEX = /^[\p{L}\p{N}\s-]+$/u;
// Backend caps the role name at max:50 (Store/UpdateRoleRequest).
const NAME_MAX = 50;

export default function Roles() {
  const { can, user: authUser } = useAuth();

  const canView        = can('roles.read');
  const canCreate      = can('roles.create');
  const canUpdate      = can('roles.update');
  const canDelete      = can('roles.delete');
  const canAssignRoles = can('users.update');   // assign a user's role

  // You cannot edit a role you currently hold: PUT /roles/{id} on your own role
  // returns 403 SELF_ACTION_FORBIDDEN (prevents locking yourself out).
  const isOwnRole = (r: RoleRow) => (authUser?.roles ?? []).includes(r.name);

  const [roles, setRoles]             = useState<RoleRow[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');

  // Inline banner (shown above the search bar, per design). 'success' = green,
  // 'info' = blue (e.g. "no changes"). Replaces repeatable toasts for results.
  type Banner = { type: 'success' | 'info'; msg: string };
  const [banner, setBanner]           = useState<Banner | null>(null);
  const showBanner = (msg: string, type: 'success' | 'info' = 'success') => {
    const next: Banner = { type, msg };
    setBanner(next);
    window.setTimeout(() => setBanner((b) => (b === next ? null : b)), 5000);
  };

  // role create/edit modal
  const [modalOpen, setModalOpen]     = useState(false);
  const [editingRole, setEditingRole] = useState<RoleRow | null>(null);
  const [formName, setFormName]       = useState('');
  const [formPerms, setFormPerms]     = useState<Set<string>>(new Set());
  const [formErrors, setFormErrors]   = useState<{ name?: string; permissions?: string }>({});
  const [submitting, setSubmitting]   = useState(false);

  // read-only view modal
  const [viewRole, setViewRole]       = useState<RoleRow | null>(null);

  // confirm delete
  const [confirmRole, setConfirmRole] = useState<RoleRow | null>(null);
  const [confirming, setConfirming]   = useState(false);

  // catalog ("mirar permisos") + assign-role-to-user modals
  const [catalogOpen, setCatalogOpen]   = useState(false);
  const [assignRolesOpen, setAssignRolesOpen] = useState(false);

  const isProtected = (r: RoleRow) => PROTECTED_ROLES.includes(r.name);

  // ── Derived: permission grid ─────────────────────────────────────────────────
  const grid: PermissionRow[] = useMemo(() => buildPermissionGrid(permissions), [permissions]);

  // ── Load data ────────────────────────────────────────────────────────────────
  const loadRoles = useCallback(async () => {
    if (!canView) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      // GET /roles returns a RoleResource collection (array, no `data` wrapper).
      const res = await getRoles();
      setRoles(Array.isArray(res) ? res : res.data ?? []);
    } catch {
      toast.error('Error al cargar los roles.');
    } finally {
      setLoading(false);
    }
  }, [canView]);

  useEffect(() => { loadRoles(); }, [loadRoles]);

  // Permission catalog (for the grid). GET /roles/permissions → { data: [names] }.
  useEffect(() => {
    if (!canView) return;
    getPermissions()
      .then((res) => setPermissions(res.data ?? []))
      .catch(() => setPermissions([]));
  }, [canView]);

  // ── Visible list (client-side search; the role list is small) ────────────────
  const visibleRoles = useMemo(() => {
    if (!search.trim()) return roles;
    const lower = search.toLowerCase();
    return roles.filter((r) => r.name.toLowerCase().includes(lower));
  }, [roles, search]);

  // ── Form helpers ─────────────────────────────────────────────────────────────
  const openCreate = () => {
    setEditingRole(null);
    setFormName('');
    setFormPerms(new Set());
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (r: RoleRow) => {
    setEditingRole(r);
    setFormName(r.name);
    setFormPerms(new Set(r.permissions));
    setFormErrors({});
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingRole(null);
    setFormName('');
    setFormPerms(new Set());
    setFormErrors({});
  };

  const editFromView = (r: RoleRow) => {
    setViewRole(null);
    openEdit(r);
  };

  const togglePerm = (name: string) => {
    // Coupled toggling: enabling cascades forward (write → read);
    // disabling read cascades backward (drops the module's write actions).
    setFormPerms((prev) =>
      prev.has(name)
        ? disableWithDeps(prev, name)
        : enableWithDeps(prev, name)
    );
    if (formErrors.permissions) setFormErrors((p) => ({ ...p, permissions: undefined }));
  };

  const validate = (): boolean => {
    const errors: { name?: string; permissions?: string } = {};
    const name = formName.trim();
    if (!name) errors.name = 'El nombre del rol es obligatorio.';
    else if (name.length > NAME_MAX) errors.name = `El nombre no debe superar los ${NAME_MAX} caracteres.`;
    else if (!NAME_REGEX.test(name)) errors.name = 'Solo se permiten letras, números, espacios y guiones.';
    if (formPerms.size === 0) errors.permissions = 'Seleccione al menos un permiso.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;          // ignore rapid double clicks
    if (!validate()) return;
    setSubmitting(true);
    try {
      // formPerms is already the coupled-resolved set; send the names as-is.
      const effective = [...formPerms];

      if (editingRole) {
        // Build only changed fields (no-op guard).
        const payload: { name?: string; permissions?: string[] } = {};
        if (formName.trim() !== editingRole.name) payload.name = formName.trim();

        const before = new Set(editingRole.permissions);
        const permsChanged =
          effective.length !== before.size || effective.some((p) => !before.has(p));
        if (permsChanged) payload.permissions = effective;

        if (Object.keys(payload).length === 0) {
          // No-op: close and inform once (not a repeatable toast).
          closeModal();
          showBanner('No hay cambios por guardar.', 'info');
          return;
        }
        await updateRole(editingRole.id, payload);
        showBanner('Se ha actualizado correctamente el registro.');
      } else {
        await createRole({ name: formName.trim(), permissions: effective });
        showBanner('Se ha creado correctamente el registro.');
      }
      closeModal();
      loadRoles();
    } catch (error: any) {
      const errs = error?.response?.data?.errors;
      if (errs) {
        const mapped: { name?: string; permissions?: string } = {};
        if (errs.name) mapped.name = errs.name[0];
        if (errs.permissions) mapped.permissions = errs.permissions[0];
        setFormErrors(mapped);
      }
      toast.error(error?.response?.data?.message || 'Error al guardar el rol.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────────
  const handleConfirmDelete = async () => {
    if (!confirmRole || confirming) return;
    setConfirming(true);
    try {
      await deleteRole(confirmRole.id);
      showBanner('Se ha eliminado correctamente el registro.');
      setConfirmRole(null);
      loadRoles();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'No se pudo eliminar el rol.');
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="app-page p-8">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <PageHeader title="Roles" subtitle="Gestión de roles del sistema">
        {canCreate && (
          <button
            onClick={openCreate}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4 flex-shrink-0" />
            Nuevo Rol
          </button>
        )}
        {canAssignRoles && (
          <button
            onClick={() => setAssignRolesOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4 flex-shrink-0" />
            Asignar Roles
          </button>
        )}
      </PageHeader>

      {!canView ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-700 font-medium">No tiene acceso a esta sección.</p>
          <p className="text-gray-400 text-sm mt-1">No cuenta con el permiso para ver roles.</p>
        </div>
      ) : (
        <>
          {/* ── Result banner (inline, above the search bar) ───────────────── */}
          {banner && (
            <div
              className={`mb-4 flex items-center justify-between gap-3 px-4 py-3 rounded-lg border ${
                banner.type === 'success'
                  ? 'border-green-200 bg-green-50 text-green-700'
                  : 'border-blue-200 bg-blue-50 text-blue-700'
              }`}
            >
              <div className="flex items-center gap-2">
                {banner.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <Info className="w-5 h-5 flex-shrink-0" />
                )}
                <span className="text-sm font-medium">{banner.msg}</span>
              </div>
              <button
                onClick={() => setBanner(null)}
                className={`transition-colors cursor-pointer ${
                  banner.type === 'success'
                    ? 'text-green-500 hover:text-green-700'
                    : 'text-blue-500 hover:text-blue-700'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ── Search + acciones ──────────────────────────────────────────── */}
          <div className="mb-6 flex items-center gap-3">
            <div className="app-page-search relative flex-1 max-w-lg">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar roles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => setCatalogOpen(true)}
              className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
            >
              mirar permisos
            </button>
          </div>

          {/* ── Table ──────────────────────────────────────────────────────── */}
          <div>
            <h2 className="text-base font-semibold text-gray-800 mb-3">Lista de roles</h2>
            {loading ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 flex items-center justify-center gap-3 text-gray-400">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Cargando...</span>
              </div>
            ) : (
              <div className="responsive-data-table bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        {['ID', 'Nombre', 'Acciones'].map((h) => (
                          <th
                            key={h}
                            className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {visibleRoles.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="px-5 py-12 text-center text-gray-400 text-sm">
                            No hay roles disponibles
                          </td>
                        </tr>
                      ) : (
                        visibleRoles.map((r) => (
                          <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                            <td data-label="ID" className="px-5 py-4 text-sm text-gray-500">
                              {r.id}
                            </td>
                            <td data-label="Nombre" className="role-name-cell px-5 py-4">
                              <button
                                onClick={() => setViewRole(r)}
                                className="text-left text-sm font-medium text-blue-600 hover:underline focus:outline-none cursor-pointer"
                              >
                                {r.name}
                              </button>
                              {isProtected(r) && (
                                <span className="role-system-badge ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                                  sistema
                                </span>
                              )}
                            </td>
                            <td data-label="Acciones" className="px-5 py-4">
                              {/* Edit: allowed if you can update AND it's not your own role
                                  (PUT /roles/{id} on your own role → 403). Protected roles
                                  can't be renamed/deleted but their permissions can be edited.
                                  Delete: allowed if you can delete AND it's not a base role. */}
                              {(() => {
                                const showEdit = canUpdate && !isOwnRole(r);
                                const showDelete = canDelete && !isProtected(r);
                                if (!showEdit && !showDelete) {
                                  return <span className="text-sm text-gray-300">—</span>;
                                }
                                return (
                                  <div className="flex items-center gap-2">
                                    {showEdit && (
                                      <button
                                        onClick={() => openEdit(r)}
                                        title="Editar"
                                        className="cursor-pointer transition-opacity hover:opacity-80"
                                      >
                                        <img src={editIcon} alt="Editar" className="w-9 h-9" />
                                      </button>
                                    )}
                                    {showDelete && (
                                      <button
                                        onClick={() => setConfirmRole(r)}
                                        title="Eliminar"
                                        className="cursor-pointer transition-opacity hover:opacity-80"
                                      >
                                        <img src={deleteIcon} alt="Eliminar" className="w-9 h-9" />
                                      </button>
                                    )}
                                  </div>
                                );
                              })()}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── Create / Edit role modal ─────────────────────────────────────────── */}
      {modalOpen && (
        <div className="app-modal-overlay fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mx-auto">
                {editingRole ? 'Actualizar Rol' : 'Crear rol'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate className="px-6 py-5 space-y-4 overflow-y-auto">
              {/* Name */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">Nombre del rol</label>
                  <span className={`text-xs ${formName.length >= NAME_MAX ? 'text-red-500' : 'text-gray-400'}`}>
                    {formName.length}/{NAME_MAX}
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={NAME_MAX}
                  value={formName}
                  disabled={!!editingRole && isProtected(editingRole)}
                  onChange={(e) => {
                    setFormName(e.target.value);
                    if (formErrors.name) setFormErrors((p) => ({ ...p, name: undefined }));
                  }}
                  placeholder="Ej. Recepcion"
                  className={`w-full px-3 py-2.5 border rounded-lg text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 ${
                    formErrors.name ? 'border-red-400' : 'border-gray-200'
                  }`}
                />
                {editingRole && isProtected(editingRole) && (
                  <p className="mt-1 text-xs text-gray-400">
                    Este rol del sistema no se puede renombrar; sus permisos sí.
                  </p>
                )}
                {formErrors.name && <p className="mt-1 text-xs text-red-500">{formErrors.name}</p>}
              </div>

              {/* Permission grid */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Configuración de permisos</p>
                <PermissionGrid
                  rows={grid}
                  selected={formPerms}
                  onToggle={togglePerm}
                />
                {formErrors.permissions && (
                  <p className="mt-1 text-xs text-red-500">{formErrors.permissions}</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingRole ? 'Actualizar Registro' : 'Guardar cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── View role modal (read-only) ──────────────────────────────────────── */}
      {viewRole && (
        <div className="app-modal-overlay fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mx-auto">Ver Rol</h2>
              <button
                onClick={() => setViewRole(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del rol</label>
                <input
                  type="text"
                  value={viewRole.name}
                  readOnly
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 bg-gray-50"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Configuración de permisos</p>
                <PermissionGrid
                  rows={grid}
                  selected={new Set(viewRole.permissions)}
                  disabled
                />
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                {canUpdate && !isOwnRole(viewRole) && (
                  <button
                    onClick={() => editFromView(viewRole)}
                    className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors cursor-pointer"
                  >
                    Editar
                  </button>
                )}
                <button
                  onClick={() => setViewRole(null)}
                  className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Confirm delete modal ─────────────────────────────────────────────── */}
      {confirmRole && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4 text-center">
            <p className="text-lg font-semibold text-gray-800 mb-6">
              ¿Seguro que deseas eliminar este rol?
            </p>
            <div className="app-modal-actions flex items-center justify-center gap-3">
              <button
                onClick={() => setConfirmRole(null)}
                disabled={confirming}
                className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={confirming}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {confirming && <Loader2 className="w-4 h-4 animate-spin" />}
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Permission catalog modal ("mirar permisos") ──────────────────────── */}
      {catalogOpen && (
        <div className="app-modal-overlay fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center gap-3 px-6 pt-6 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Catálogo de permisos</h2>
                <p className="text-xs text-gray-400">Permisos disponibles en el sistema.</p>
              </div>
              <button
                onClick={() => setCatalogOpen(false)}
                className="ml-auto text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-5 overflow-y-auto">
              <PermissionGrid rows={grid} selected={new Set(permissions)} disabled />
            </div>
            <div className="flex items-center justify-center px-6 pb-6 pt-1">
              <button
                onClick={() => setCatalogOpen(false)}
                className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Assign role to user modal ────────────────────────────────────────── */}
      {assignRolesOpen && (
        <AssignRolesModal
          onClose={() => setAssignRolesOpen(false)}
          onAssigned={(msg) => {
            setAssignRolesOpen(false);
            showBanner(msg);
          }}
        />
      )}
    </div>
  );
}
