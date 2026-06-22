import { useState, useEffect, useMemo } from 'react';
import { Plus, Copy } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';
import DataTable from '../components/DataTable';
import UserSearchBar from '../components/users/UserSearchBar';
import UserFormModal, { type UserFormData } from '../components/users/UserFormModal';
import { getUsers, createUser, updateUser, deleteUser } from '../../api/services';
import { toast } from 'sonner';
import { useActivity } from '../../context/ActivityContext';
import { useSpecialties } from '../../context/SpecialtiesContext';
import { useUserTypes } from '../../context/UserTypesContext';

const EMPTY_FORM: UserFormData = {
  name: '',
  lastname: '',
  email: '',
  password: '',
  user_type_id: '',
  specialty_id: '',
};

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
  const [formData, setFormData] = useState<UserFormData>(EMPTY_FORM);

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

  // Builds an id→userType lookup so column renderers and the doctor check can resolve names without iterating the array each time.
  const userTypesMap = useMemo(() => new Map(userTypes.map((t: any) => [t.id, t])), [userTypes]);

  // Shows the specialty dropdown only when the selected user type is "doctor".
  // NOTE: changing a specialty must not modify historical appointment records — the API is
  // responsible for preserving the original specialty on past entries.
  const isDoctorSelected = useMemo(() => {
    if (!formData.user_type_id) return false;
    const selectedType = userTypesMap.get(parseInt(formData.user_type_id)) ?? userTypesMap.get(formData.user_type_id);
    return selectedType?.name?.toLowerCase() === 'doctor';
  }, [formData.user_type_id, userTypesMap]);

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
    setFormData(EMPTY_FORM);
    setEditingUser(null);
  };

  const handleFieldChange = <K extends keyof UserFormData>(field: K, value: UserFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

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

      <div className="mb-6">
        <UserSearchBar value={searchTerm} onChange={setSearchTerm} />
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

      {showModal && (
        <UserFormModal
          isEditing={!!editingUser}
          formData={formData}
          userTypes={userTypes}
          specialties={specialties}
          isDoctorSelected={isDoctorSelected}
          onFieldChange={handleFieldChange}
          onSubmit={handleSubmit}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
