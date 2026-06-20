import { FormEvent } from 'react';
import { KeyRound } from 'lucide-react';
import AuthSectionHeading from './AuthSectionHeading';
import PasswordField from './PasswordField';
import AuthSubmitButton from './AuthSubmitButton';

interface NewPasswordFormProps {
  password: string;
  confirmPassword: string;
  showPassword: boolean;
  showConfirm: boolean;
  loading: boolean;
  onPasswordChange: (value: string) => void;
  onConfirmChange: (value: string) => void;
  onTogglePassword: () => void;
  onToggleConfirm: () => void;
  onSubmit: (e: FormEvent) => void;
}

// Step 2: set a new password (with confirmation) using the token from the URL.
export default function NewPasswordForm({
  password,
  confirmPassword,
  showPassword,
  showConfirm,
  loading,
  onPasswordChange,
  onConfirmChange,
  onTogglePassword,
  onToggleConfirm,
  onSubmit,
}: NewPasswordFormProps) {
  return (
    <>
      <AuthSectionHeading
        title="Crear Nueva Contraseña"
        subtitle="Tu nueva contraseña debe ser segura y fácil de recordar."
      />
      <form onSubmit={onSubmit} className="space-y-4">
        <PasswordField
          id="password"
          label="Nueva Contraseña"
          required
          minLength={8}
          value={password}
          onChange={onPasswordChange}
          placeholder="********"
          icon={<KeyRound className="w-4 h-4" />}
          show={showPassword}
          onToggle={onTogglePassword}
        />
        <PasswordField
          id="confirmPassword"
          label="Confirmar Contraseña"
          required
          minLength={8}
          value={confirmPassword}
          onChange={onConfirmChange}
          placeholder="********"
          icon={<KeyRound className="w-4 h-4" />}
          show={showConfirm}
          onToggle={onToggleConfirm}
        />
        <div className="pt-4">
          <AuthSubmitButton loading={loading} label="Actualizar Contraseña" loadingLabel="Actualizando..." />
        </div>
      </form>
    </>
  );
}
