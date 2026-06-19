import { useState, useEffect, FormEvent } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Mail, KeyRound } from 'lucide-react';
import { requestPasswordReset, resetPassword } from '../services/authService';
import { AuthField, PasswordField } from '../components';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'request' | 'reset'>('request');

  const extractErrorMessage = (error: any, fallback: string) =>
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback;

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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {step === 'request' ? (
            <>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Restablecer Contraseña</h1>
                <p className="text-gray-500 mt-2">
                  Ingresa tu correo electrónico para recibir un enlace de restablecimiento.
                </p>
              </div>
              <form onSubmit={handleRequestSubmit} className="space-y-6">
                <AuthField
                  id="email"
                  label="Correo Electrónico"
                  type="email"
                  required
                  value={email}
                  onChange={setEmail}
                  placeholder="tu@email.com"
                  icon={<Mail className="w-4 h-4" />}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                >
                  {loading ? 'Enviando...' : 'Enviar Enlace'}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Crear Nueva Contraseña</h1>
                <p className="text-gray-500 mt-2">
                  Tu nueva contraseña debe ser segura y fácil de recordar.
                </p>
              </div>
              <form onSubmit={handleResetSubmit} className="space-y-4">
                <PasswordField
                  id="password"
                  label="Nueva Contraseña"
                  required
                  minLength={8}
                  value={password}
                  onChange={setPassword}
                  placeholder="********"
                  icon={<KeyRound className="w-4 h-4" />}
                  show={showPassword}
                  onToggle={() => setShowPassword((v) => !v)}
                />
                <PasswordField
                  id="confirmPassword"
                  label="Confirmar Contraseña"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  placeholder="********"
                  icon={<KeyRound className="w-4 h-4" />}
                  show={showConfirm}
                  onToggle={() => setShowConfirm((v) => !v)}
                />
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                  >
                    {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
        <div className="text-center mt-4">
          <button
            onClick={() => navigate('/login')}
            className="text-sm text-blue-600 hover:underline"
          >
            Volver a Iniciar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}
