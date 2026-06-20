import { useState, useEffect, FormEvent } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { requestPasswordReset, resetPassword } from '../services/authService';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const extractErrorMessage = (error: any, fallback: string): string =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  fallback;

// Owns the password-reset flow: which step to show (request the link vs set a
// new password from the token in the URL), field state, validation and submit.
export function useResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [token, setToken] = useState<string | null>(null);
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // A token in the URL switches the screen to the "set new password" step.
  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
      setStep('reset');
    } else {
      setToken(null);
      setStep('request');
    }
  }, [searchParams]);

  const handleRequestSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const normalizedEmail = email.trim();
    if (!EMAIL_REGEX.test(normalizedEmail)) {
      toast.error('Ingresa un correo electrónico válido.');
      return;
    }
    setLoading(true);
    try {
      const response = await requestPasswordReset(normalizedEmail);
      toast.success(response?.message || 'Solicitud enviada correctamente.');
      setEmail('');
    } catch (error) {
      console.error('Error requesting password reset:', error);
      toast.error(extractErrorMessage(error, 'Error al solicitar el restablecimiento de contraseña.'));
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden.');
      return;
    }
    if (!token) {
      toast.error('Token de restablecimiento no válido.');
      return;
    }
    setLoading(true);
    try {
      const response = await resetPassword(token, password);
      toast.success(response?.message || 'Contraseña actualizada correctamente.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error(extractErrorMessage(error, 'Error al restablecer la contraseña.'));
    } finally {
      setLoading(false);
    }
  };

  return {
    step,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    toggleShowPassword: () => setShowPassword((v) => !v),
    showConfirm,
    toggleShowConfirm: () => setShowConfirm((v) => !v),
    loading,
    handleRequestSubmit,
    handleResetSubmit,
    goToLogin: () => navigate('/login'),
  };
}
