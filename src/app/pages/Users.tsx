import { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Copy, UserCheck, UserX, UserCog, X, Loader2, CheckCircle2, Info } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';
import DataTable from '../components/DataTable';
import { getUsers, createUser, updateUser, changeUserStatus, getRoles } from '../../api/services';
import { toast } from 'sonner';
import { useActivity } from '../../context/ActivityContext';
import { useAuth } from '../../context/AuthContext';

// Max lengths from the backend FormRequest (UserRequest): name/lastname/email/password
// are max:255 (password also min:8). One constant feeds the counter, the input's
// maxLength and the client validation — never hardcode the number in three places.
const NAME_MAX = 255;
const EMAIL_MAX = 255;
const PASSWORD_MAX = 255;
const PASSWORD_MIN = 8;

export default function Users() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logActivity } = useActivity();
  const { user: authUser, can } = useAuth();

  // Permission gates (UX only; the backend enforces each endpoint).
  // changeStatus uses users.update for BOTH directions in this backend.
  const canView   = can('users.read');
  const canCreate = can('users.create');
  const canUpdate = can('users.update');

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Read-only details modal (clicking the name opens this, not the editor).
  const [viewUser, setViewUser] = useState<any>(null);

  // Status-change confirmation modal (replaces window.confirm).
  const [confirmUser, setConfirmUser] = useState<any>(null);
  const [confirming, setConfirming] = useState(false);

  // Inline banner (above the search bar). 'success' = green, 'info' = blue.
  // Replaces repeatable toasts for CRUD results.
  type Banner = { type: 'success' | 'info'; msg: string };
  const [banner, setBanner] = useState<Banner | null>(null);
  const showBanner = (msg: string, type: 'success' | 'info' = 'success') => {
    const next: Banner = { type, msg };
    setBanner(next);
    window.setTimeout(() => setBanner((b) => (b === next ? null : b)), 5000);
  };

  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    password: '',
    role: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('action') === 'new') {
      resetForm();
      setShowModal(true);
      navigate(location.pathname, { replace: true });
    }
  }, [location.search, location.pathname, navigate]);

  const loadData = async () => {
    // Don't hit the endpoint without permission (avoids a guaranteed 403).
    if (!canView) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const [usersData, rolesData] = await Promise.all([
        getUsers().catch(() => ({ data: [] })),
        // Roles feed the create-form selector; needs roles.read (empty if denied).
        getRoles().catch(() => ([])),
      ]);

      setUsers(usersData.data || []);
      // GET /roles returns a RoleResource collection (array, no `data` wrapper).
      setRoles(Array.isArray(rolesData) ? rolesData : rolesData.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;          // ignore rapid double clicks
    setSubmitting(true);
    try {
      if (editingUser) {
        // PUT /users/{id} no longer changes the role — only these fields.
        // Roles are managed from the Roles tab (Asignar Roles).
        const payload = {
          name: formData.name,
          lastname: formData.lastname,
          email: formData.email,
          ...(formData.password && { password: formData.password }),
        };
        await updateUser(editingUser.id, payload);
        logActivity({
          type: 'Usuario actualizado',
          name: `${formData.name} ${formData.lastname}`,
        });
        showBanner('Usuario actualizado exitosamente.');
      } else {
        // POST /users requires the role.
        const payload = {
          name: formData.name,
          lastname: formData.lastname,
          email: formData.email,
          role: formData.role,
          ...(formData.password && { password: formData.password }),
        };
        await createUser(payload);
        logActivity({
          type: 'Nuevo usuario',
          name: `${formData.name} ${formData.lastname}`,
        });
        showBanner('Usuario creado exitosamente.');
      }

      setShowModal(false);
      resetForm();
      loadData();
    } catch (error: any) {
      console.error('Error saving user:', error);
      // Keep the modal open so the user can fix and retry.
      toast.error(error?.response?.data?.message || 'Error al guardar el usuario');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      password: '',
      // role is only used when creating; editing never sends it (roles are
      // managed from the Roles tab). Kept here just to seed the create form shape.
      role: user.roles?.[0] ?? '',
    });
    setShowModal(true);
  };

  // Switch from the read-only details modal into the edit form.
  const handleEditFromView = (user: any) => {
    setViewUser(null);
    handleEdit(user);
  };

  // Users are never deleted (DELETE returns 405); the "baja" is a status change.
  // Confirmation goes through a modal (not window.confirm).
  const handleConfirmStatus = async () => {
    if (!confirmUser || confirming) return;   // ignore rapid double clicks
    const user = confirmUser;
    const isActive = user.status === 'ACTIVE';
    const newStatus = isActive ? 'INACTIVE' : 'ACTIVE';

    setConfirming(true);
    try {
      await changeUserStatus(user.id, newStatus);
      logActivity({
        type: isActive ? 'Usuario desactivado' : 'Usuario activado',
        name: `${user.name} ${user.lastname}`,
      });
      setConfirmUser(null);
      showBanner(`Usuario ${isActive ? 'desactivado' : 'activado'} exitosamente.`);
      loadData();
    } catch (error: any) {
      console.error('Error changing user status:', error);
      // Surface backend messages for SELF_ACTION_FORBIDDEN / LAST_ADMIN, etc.
      toast.error(error?.response?.data?.message || 'Error al cambiar el estado del usuario');
    } finally {
      setConfirming(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      lastname: '',
      email: '',
      password: '',
      role: '',
    });
    setEditingUser(null);
  };

  const filteredUsers = useMemo(() => {
    const lower = searchTerm.toLowerCase();
    return users
      // Hide the logged-in user: the backend forbids self-modification
      // (SELF_ACTION_FORBIDDEN), so we don't show the row at all.
      .filter((user: any) => user.id !== authUser?.id)
      .filter((user: any) =>
        user.name?.toLowerCase().includes(lower) ||
        user.lastname?.toLowerCase().includes(lower) ||
        user.email?.toLowerCase().includes(lower)
      );
  }, [users, searchTerm, authUser?.id]);

  // All role names, uppercase and comma-separated (or "—" if none).
  // roles come as an array of name strings (UserResource.getRoleNames()).
  const roleLabel = (roles: any): string =>
    Array.isArray(roles) && roles.length
      ? roles.map((r: any) => String(r).toUpperCase()).join(', ')
      : '—';

  const columns = useMemo(() => [
    { header: 'ID', accessor: 'id' },
    {
      header: 'Nombre',
      accessor: 'name',
      // Clicking the name opens the read-only details modal, not the editor.
      render: (value: any, row: any) => (
        <button
          type="button"
          onClick={() => setViewUser(row)}
          className="text-left font-medium text-blue-600 hover:underline focus:outline-none cursor-pointer"
        >
          {value}
        </button>
      ),
    },
    { header: 'Apellido', accessor: 'lastname' },
    { header: 'Email', accessor: 'email' },
    {
      header: 'Roles',
      accessor: 'roles',
      // A user can hold several roles. Like MediCode, show them all in uppercase,
      // comma-separated, as plain text (UserResource returns role NAME strings).
      render: (value: any) => (
        <span className="text-sm text-gray-700 font-medium break-all">
          {roleLabel(value)}
        </span>
      ),
    },
    {
      header: 'Estado',
      accessor: 'status',
      render: (value: any) =>
        value === 'ACTIVE' ? (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Activo</span>
        ) : (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-500">Inactivo</span>
        ),
    },
  ], []);

  return (
    <div className="app-page p-8">
      <div className="app-page-header flex items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Usuarios</h1>
          <p className="text-gray-500">Gestión de usuarios del sistema</p>
        </div>
        {canCreate && (
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nuevo Usuario
          </button>
        )}
      </div>

      {/* ── Result banner (inline, above the search bar) ───────────────────── */}
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

      {/* Search Bar */}
      <div className="mb-6">
        <div className="app-page-search relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {!canView ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-700 font-medium">No tiene acceso a esta sección.</p>
          <p className="text-gray-400 text-sm mt-1">No cuenta con el permiso para ver usuarios.</p>
        </div>
      ) : loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500">Cargando...</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredUsers}
          onEdit={canUpdate ? handleEdit : undefined}
          customActions={[
            {
              icon: <Copy className="w-4 h-4" />,
              label: "Copiar correo",
              onClick: (row) => {
                navigator.clipboard.writeText(row.email);
                toast.success('Correo copiado exitosamente');
              },
              className: "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            },
            // Activate/deactivate only if the user can update (users.update).
            ...(canUpdate ? [{
              // Activate (green) when inactive, deactivate (red) when active.
              icon: (row: any) =>
                row.status === 'ACTIVE'
                  ? <UserX className="w-4 h-4 text-red-600" />
                  : <UserCheck className="w-4 h-4 text-green-600" />,
              label: "Cambiar estado",
              onClick: (row: any) => setConfirmUser(row),
              className: "hover:bg-gray-100",
            }] : []),
          ]}
        />
      )}

      {/* ── Details modal (read-only) ───────────────────────────────────────── */}
      {viewUser && (
        <div className="app-modal-overlay fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="app-modal-panel bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
            {/* Header */}
            <div className="flex items-center gap-3 px-6 pt-6 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                <UserCog className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Detalles del usuario</h2>
                <p className="text-xs text-gray-400">Información del registro seleccionado.</p>
              </div>
              <button
                onClick={() => setViewUser(null)}
                className="ml-auto text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4">
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">ID</p>
                <p className="text-sm text-gray-900">{viewUser.id}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">Nombre completo</p>
                <input
                  type="text"
                  readOnly
                  value={`${viewUser.name} ${viewUser.lastname ?? ''}`.trim()}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 bg-gray-50 outline-none cursor-default"
                />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">Correo electrónico</p>
                <input
                  type="text"
                  readOnly
                  value={viewUser.email}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 bg-gray-50 outline-none cursor-default"
                />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Roles</p>
                {/* break-all so a very long role name with no spaces wraps instead
                    of overflowing the modal. */}
                <p className="text-sm text-gray-900 break-all">
                  {roleLabel(viewUser.roles)}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Estado</p>
                {viewUser.status === 'ACTIVE' ? (
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Activo</span>
                ) : (
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-500">Inactivo</span>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 pb-6 pt-1">
              <button
                onClick={() => setViewUser(null)}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors cursor-pointer"
              >
                Cerrar
              </button>
              {canUpdate && (
                <button
                  onClick={() => handleEditFromView(viewUser)}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
                >
                  Editar
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="app-modal-overlay fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="app-modal-panel bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  required
                  maxLength={NAME_MAX}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="text-right mt-1">
                  <span className={`text-xs ${formData.name.length >= NAME_MAX ? 'text-red-500' : 'text-gray-500'}`}>
                    {formData.name.length}/{NAME_MAX}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido *
                </label>
                <input
                  type="text"
                  required
                  maxLength={NAME_MAX}
                  value={formData.lastname}
                  onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="text-right mt-1">
                  <span className={`text-xs ${formData.lastname.length >= NAME_MAX ? 'text-red-500' : 'text-gray-500'}`}>
                    {formData.lastname.length}/{NAME_MAX}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  maxLength={EMAIL_MAX}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="text-right mt-1">
                  <span className={`text-xs ${formData.email.length >= EMAIL_MAX ? 'text-red-500' : 'text-gray-500'}`}>
                    {formData.email.length}/{EMAIL_MAX}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña {editingUser ? '(dejar en blanco para no cambiar)' : '*'}
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  maxLength={PASSWORD_MAX}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  minLength={PASSWORD_MIN}
                />
                <div className="text-right mt-1">
                  <span className={`text-xs ${formData.password.length >= PASSWORD_MAX ? 'text-red-500' : 'text-gray-500'}`}>
                    {formData.password.length}/{PASSWORD_MAX}
                  </span>
                </div>
              </div>
              {/* Role only on CREATE (POST /users requires an initial role). On
                  EDIT a user may hold several roles, so we don't show a single
                  selector that would overwrite them — roles are managed from the
                  Roles tab (Asignar Roles). The edit PUT never sends `role`. */}
              {!editingUser ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rol *
                  </label>
                  <div className="relative">
                    <select
                      required
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full appearance-none px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="">Seleccionar...</option>
                      {roles.map((role: any) => (
                        <option key={role.id} value={role.name}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                      <svg className="h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-1 h-4" />
                </div>
              ) : (
                <p className="text-xs text-center text-gray-400 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5">
                  Para editar los roles del usuario, diríjase a la pestaña de Roles.
                </p>
              )}

              {/* "Required fields" note only on create (on edit all are optional). */}
              {!editingUser && (
                <p className="text-xs text-gray-400">* Los campos son requeridos</p>
              )}
              <div className="app-modal-actions flex gap-2 pt-4">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingUser ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Confirm status change modal ──────────────────────────────────────── */}
      {confirmUser && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4 text-center">
            <p className="text-lg font-semibold text-gray-800 mb-2">
              {confirmUser.status === 'ACTIVE' ? '¿Desactivar usuario?' : '¿Activar usuario?'}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              {confirmUser.status === 'ACTIVE'
                ? `${confirmUser.name} ${confirmUser.lastname} no podrá iniciar sesión.`
                : `${confirmUser.name} ${confirmUser.lastname} podrá iniciar sesión nuevamente.`}
            </p>
            <div className="app-modal-actions flex items-center justify-center gap-3">
              <button
                onClick={() => setConfirmUser(null)}
                disabled={confirming}
                className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmStatus}
                disabled={confirming}
                className={`px-6 py-2.5 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed ${
                  confirmUser.status === 'ACTIVE'
                    ? 'bg-red-600 hover:bg-red-700 disabled:bg-red-300'
                    : 'bg-green-600 hover:bg-green-700 disabled:bg-green-300'
                }`}
              >
                {confirming && <Loader2 className="w-4 h-4 animate-spin" />}
                {confirmUser.status === 'ACTIVE' ? 'Desactivar' : 'Activar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
