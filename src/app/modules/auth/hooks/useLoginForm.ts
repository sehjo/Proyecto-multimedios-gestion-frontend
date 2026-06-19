import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

interface LoginFormErrors {
  email?: string;
  password?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 6;

// Encapsulates all the login form logic (state, validation, submit) so the page
// stays a thin composition layer. Form validation is a UI concern and lives
// here, not in AuthContext (which only handles the session/domain).
export function useLoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<LoginFormErrors>({});

  const validate = (): boolean => {
    const newErrors: LoginFormErrors = {};
    if (!email.trim()) {
      newErrors.email = 'El correo es requerido.';
    } else if (!EMAIL_REGEX.test(email)) {
      newErrors.email = 'Ingrese un correo válido.';
    }
    if (!password) {
      newErrors.password = 'La contraseña es requerida.';
    } else if (password.length < PASSWORD_MIN_LENGTH) {
      newErrors.password = `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres.`;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (errors.password) setErrors((p) => ({ ...p, password: undefined }));
  };

  const togglePassword = () => setShowPassword((v) => !v);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    const success = await login(email, password);
    setIsLoading(false);

    if (success) {
      navigate('/', { replace: true });
    }
  };

  return {
    email,
    password,
    showPassword,
    isLoading,
    errors,
    handleEmailChange,
    handlePasswordChange,
    togglePassword,
    handleSubmit,
  };
}
