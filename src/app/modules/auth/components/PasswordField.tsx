import { Eye, EyeOff } from 'lucide-react';
import AuthField, { AuthFieldProps } from './AuthField';

type PasswordFieldProps = Omit<AuthFieldProps, 'type' | 'trailing'> & {
  show: boolean;
  onToggle: () => void;
};

// Specialised AuthField for passwords: toggles between text/password and renders
// the show/hide eye button as the field's trailing control.
export default function PasswordField({ show, onToggle, ...fieldProps }: PasswordFieldProps) {
  return (
    <AuthField
      {...fieldProps}
      type={show ? 'text' : 'password'}
      trailing={
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          tabIndex={-1}
          aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      }
    />
  );
}
