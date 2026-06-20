import { useState, FormEvent } from 'react';
import { toast } from 'sonner';
import { useActivity } from '../../../../context/ActivityContext';
import { createUser, updateUser } from '../services/usersService';
import type { User, UserFormData } from '../types/users.types';

// Max lengths from the backend FormRequest (UserRequest). One constant feeds the
// counter, the input maxLength and the validation — never hardcode in 3 places.
export const NAME_MAX = 255;
export const EMAIL_MAX = 255;
export const PASSWORD_MAX = 255;
export const PASSWORD_MIN = 8;

const EMPTY_FORM: UserFormData = {
  name: '',
  lastname: '',
  email: '',
  password: '',
  role: '',
};

// Owns the create/edit form: state, edit seeding and submit (create vs update).
// onSaved lets the page refresh the list and show the success banner.
export function useUserForm(onSaved: (msg: string) => void) {
  const { logActivity } = useActivity();

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field: keyof UserFormData, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setEditingUser(null);
  };

  const openCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      password: '',
      role: user.roles?.[0] ?? '',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return; // ignore rapid double clicks
    setSubmitting(true);
    try {
      if (editingUser) {
        // PUT /users/{id} updates profile fields only; roles live in the Roles tab.
        const payload = {
          name: formData.name,
          lastname: formData.lastname,
          email: formData.email,
          ...(formData.password && { password: formData.password }),
        };
        await updateUser(editingUser.id, payload);
        logActivity({ type: 'Usuario actualizado', name: `${formData.name} ${formData.lastname}` });
        onSaved('Usuario actualizado exitosamente.');
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
        logActivity({ type: 'Nuevo usuario', name: `${formData.name} ${formData.lastname}` });
        onSaved('Usuario creado exitosamente.');
      }
      closeModal();
    } catch (error: any) {
      console.error('Error saving user:', error);
      // Keep the modal open so the user can fix and retry.
      toast.error(error?.response?.data?.message || 'Error al guardar el usuario');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    showModal,
    editingUser,
    formData,
    submitting,
    updateField,
    openCreate,
    openEdit,
    closeModal,
    handleSubmit,
  };
}
