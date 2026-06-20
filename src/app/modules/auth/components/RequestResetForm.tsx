import { FormEvent } from 'react';
import { Mail } from 'lucide-react';
import AuthSectionHeading from './AuthSectionHeading';
import AuthField from './AuthField';
import AuthSubmitButton from './AuthSubmitButton';

interface RequestResetFormProps {
  email: string;
  loading: boolean;
  onEmailChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
}

// Step 1: ask for the account email to send the reset link.
export default function RequestResetForm({
  email,
  loading,
  onEmailChange,
  onSubmit,
}: RequestResetFormProps) {
  return (
    <>
      <AuthSectionHeading
        title="Restablecer Contraseña"
        subtitle="Ingresa tu correo electrónico para recibir un enlace de restablecimiento."
      />
      <form onSubmit={onSubmit} className="space-y-6">
        <AuthField
          id="email"
          label="Correo Electrónico"
          type="email"
          required
          value={email}
          onChange={onEmailChange}
          placeholder="tu@email.com"
          icon={<Mail className="w-4 h-4" />}
        />
        <AuthSubmitButton loading={loading} label="Enviar Enlace" loadingLabel="Enviando..." />
      </form>
    </>
  );
}
