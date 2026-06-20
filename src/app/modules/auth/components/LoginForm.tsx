import { FormEvent } from 'react';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import AuthField from './AuthField';
import PasswordField from './PasswordField';

interface LoginFormProps {
  email: string;
  password: string;
  showPassword: boolean;
  isLoading: boolean;
  errors: { email?: string; password?: string };
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onTogglePassword: () => void;
  onSubmit: (e: FormEvent) => void;
}

// The login form: credential fields, forgot-password link and submit button.
// Stateless — the page owns the state and passes it in.
export default function LoginForm({
  email,
  password,
  showPassword,
  isLoading,
  errors,
  onEmailChange,
  onPasswordChange,
  onTogglePassword,
  onSubmit,
}: LoginFormProps) {
  const navigate = useNavigate();

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <AuthField
        id="email"
        label="Correo electrónico"
        type="email"
        autoComplete="email"
        value={email}
        onChange={onEmailChange}
        error={errors.email}
        placeholder="usuario@ccss.go.cr"
        icon={<Mail className="w-4 h-4" />}
      />

      <PasswordField
        id="password"
        label="Contraseña"
        autoComplete="current-password"
        value={password}
        onChange={onPasswordChange}
        error={errors.password}
        placeholder="••••••••"
        icon={<Lock className="w-4 h-4" />}
        show={showPassword}
        onToggle={onTogglePassword}
      />

      <div className="text-right">
        <button
          type="button"
          onClick={() => navigate('/reset-password')}
          className="text-sm text-blue-600 hover:underline focus:outline-none"
        >
          ¿Olvidó su contraseña?
        </button>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Autenticando…
          </>
        ) : (
          'Ingresar al sistema'
        )}
      </button>
    </form>
  );
}
