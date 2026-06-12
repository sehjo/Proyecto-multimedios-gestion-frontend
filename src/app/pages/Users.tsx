import { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Copy } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';
import DataTable from '../components/DataTable';
import { getUsers, createUser, updateUser, deleteUser } from '../../api/services';
import { toast } from 'sonner';
import { useActivity } from '../../context/ActivityContext';
import { useSpecialties } from '../../context/SpecialtiesContext';
import { useUserTypes } from '../../context/UserTypesContext';

export default function Users() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logActivity } = useActivity();
  const { specialties } = useSpecialties();
  const { userTypes } = useUserTypes();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    password: '',
    user_type_id: '',
    specialty_id: '',
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

  // Fetches the full user list from the API on mount; falls back to an empty array if the request fails.
  const loadData = async () => {
    try {
      setLoading(true);
      const usersData = await getUsers().catch(() => ({ data: [] }));
      setUsers(usersData.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  // Submits the form: HTML5 `required` attributes prevent submission when mandatory fields are empty,
  // showing per-field browser validation messages. On success, persists the record, refreshes the
  // table, and logs the action to the activity history.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        lastname: formData.lastname,
        email: formData.email,
        user_type_id: parseInt(formData.user_type_id),
        ...(formData.password && { password: formData.password }),
        ...(isDoctorSelected && formData.specialty_id && {
          specialty_id: parseInt(formData.specialty_id),
        }),
      };

      if (editingUser) {
        await updateUser(editingUser.id, payload);
        toast.success('Usuario actualizado exitosamente');
        logActivity({
          type: 'Usuario actualizado',
          name: `${payload.name} ${payload.lastname}`,
        });
      } else {
        await createUser(payload);
        toast.success('Usuario creado exitosamente');
        logActivity({
          type: 'Nuevo usuario',
          name: `${payload.name} ${payload.lastname}`,
        });
      }
      
      setShowModal(false);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error('Error al guardar el usuario');
    }
  };

  // Opens the modal pre-populated with the selected user's current data so the admin can edit any field.
  // Password is intentionally left blank — the field is optional on edit (only sent if filled in).
  // Same validations as creation apply; on save the table refreshes and the change is logged.
  const handleEdit = (user: any) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      password: '',
      user_type_id: user.user_type_id,
      specialty_id: user.specialty_id ? String(user.specialty_id) : '',
    });
    setShowModal(true);
  };

  // Shows a named confirmation dialog before deleting. Permanently removes the record,
  // refreshes the table, and logs the action.
  // TODO: block deletion if the doctor has future appointments assigned (data integrity guard).
  const handleDelete = async (user: any) => {
    if (window.confirm('¿Está seguro de eliminar este usuario?')) {
      try {
        await deleteUser(user.id);
        toast.success('Usuario eliminado exitosamente');
        logActivity({
          type: 'Usuario eliminado',
          name: `${user.name} ${user.lastname}`,
        });
        loadData();
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Error al eliminar el usuario');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      lastname: '',
      email: '',
      password: '',
      user_type_id: '',
      specialty_id: '',
    });
    setEditingUser(null);
  };

  // Builds an id→userType lookup so column renderers can resolve names without iterating the array each time.
  const userTypesMap = useMemo(() => new Map(userTypes.map((t: any) => [t.id, t])), [userTypes]);

  // Shows the specialty dropdown only when the selected user type is "doctor",
  // keeping it required so the field is enforced as part of registration validation.
  const isDoctorSelected = useMemo(() => {
    if (!formData.user_type_id) return false;
    const selectedType = userTypesMap.get(parseInt(formData.user_type_id)) ?? userTypesMap.get(formData.user_type_id);
    return selectedType?.name?.toLowerCase() === 'doctor';
  }, [formData.user_type_id, userTypesMap]);

  // Filters the user list in real time as the search term changes; matches against name, lastname, or email.
  const filteredUsers = useMemo(() => {
    const lower = searchTerm.toLowerCase();
    return users.filter((user: any) =>
      user.name?.toLowerCase().includes(lower) ||
      user.lastname?.toLowerCase().includes(lower) ||
      user.email?.toLowerCase().includes(lower)
    );
  }, [users, searchTerm]);

  // Table columns: user_type_id is resolved to a readable label via userTypesMap instead of showing the raw ID.
  const columns = useMemo(() => [
    { header: 'ID', accessor: 'id' },
    { header: 'Nombre', accessor: 'name' },
    { header: 'Apellido', accessor: 'lastname' },
    { header: 'Email', accessor: 'email' },
    {
      header: 'Tipo de Usuario',
      accessor: 'user_type_id',
      render: (value: any) => {
        const type = userTypesMap.get(value);
        return type ? (
          <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700">
            {type.name}
          </span>
        ) : '-';
      }
    },
  ], [userTypesMap]);

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
          onDelete={handleDelete}
          customActions={[
            {
              icon: <Copy className="w-4 h-4" />,
              label: "Copiar correo",
              onClick: (row) => {
                navigator.clipboard.writeText(row.email);
                toast.success('Correo copiado exitosamente');
              },
              className: "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Usuario *
                </label>
                <div className="relative">
                  <select
                    required
                    value={formData.user_type_id}
                    onChange={(e) => {
                      const selectedType = userTypesMap.get(parseInt(e.target.value)) ?? userTypesMap.get(e.target.value);
                      const isDoctor = selectedType?.name?.toLowerCase() === 'doctor';
                      setFormData({
                        ...formData,
                        user_type_id: e.target.value,
                        specialty_id: isDoctor ? formData.specialty_id : '',
                      });
                    }}
                    className="w-full appearance-none px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Seleccionar...</option>
                    {userTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
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

              {isDoctorSelected && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Especialidad *
                  </label>
                  <div className="relative">
                    <select
                      required
                      value={formData.specialty_id}
                      onChange={(e) => setFormData({ ...formData, specialty_id: e.target.value })}
                      className="w-full appearance-none px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="">Seleccionar...</option>
                      {specialties.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
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
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingUser ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
