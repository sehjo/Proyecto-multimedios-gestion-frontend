import { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Copy, UserCheck, UserX, X, Loader2, CheckCircle2, Info } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';
import DataTable from '../components/DataTable';
import { getUsers, createUser, updateUser, changeUserStatus, getRoles } from '../../api/services';
import { toast } from 'sonner';
import { useActivity } from '../../context/ActivityContext';
import { useAuth } from '../../context/AuthContext';

export default function Users() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logActivity } = useActivity();
  const { user: authUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
    try {
      setLoading(true);
      const [usersData, rolesData] = await Promise.all([
        getUsers().catch(() => ({ data: [] })),
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
        // The role is changed separately via the "Cambiar rol" action.
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
      // The backend stores a single role per user (roles[] has one name).
      role: user.roles?.[0] ?? '',
    });
    setShowModal(true);
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

  const columns = useMemo(() => [
    { header: 'ID', accessor: 'id' },
    { header: 'Nombre', accessor: 'name' },
    { header: 'Apellido', accessor: 'lastname' },
    { header: 'Email', accessor: 'email' },
    {
      header: 'Rol',
      accessor: 'roles',
      render: (value: any) => {
        // UserResource returns roles as an array of names (getRoleNames()).
        const role = Array.isArray(value) ? value[0] : value;
        return role ? (
          <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700">
            {role}
          </span>
        ) : '-';
      }
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

      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500">Cargando...</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredUsers}
          onEdit={handleEdit}
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
            {
              // Activate (green) when inactive, deactivate (red) when active.
              icon: (row: any) =>
                row.status === 'ACTIVE'
                  ? <UserX className="w-4 h-4 text-red-600" />
                  : <UserCheck className="w-4 h-4 text-green-600" />,
              label: "Cambiar estado",
              onClick: (row) => setConfirmUser(row),
              className: "hover:bg-gray-100",
            }
          ]}
        />
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
                  maxLength={255}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="text-right mt-1">
                  <span className={`text-xs ${formData.name.length >= 255 ? 'text-red-500' : 'text-gray-500'}`}>
                    {formData.name.length}/255
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
                  maxLength={255}
                  value={formData.lastname}
                  onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="text-right mt-1">
                  <span className={`text-xs ${formData.lastname.length >= 255 ? 'text-red-500' : 'text-gray-500'}`}>
                    {formData.lastname.length}/255
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
                  maxLength={255}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="text-right mt-1">
                  <span className={`text-xs ${formData.email.length >= 255 ? 'text-red-500' : 'text-gray-500'}`}>
                    {formData.email.length}/255
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
                  maxLength={255}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  minLength={8}
                />
                <div className="text-right mt-1">
                  <span className={`text-xs ${formData.password.length >= 255 ? 'text-red-500' : 'text-gray-500'}`}>
                    {formData.password.length}/255
                  </span>
                </div>
              </div>
              {/* Role only on CREATE. On edit the role is changed via the
                  dedicated "Cambiar rol" action (PUT /users/{id}/role); the edit
                  PUT ignores `role`. */}
              {!editingUser && (
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
