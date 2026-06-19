import { useEffect } from 'react';
import { useLoginForm } from '../hooks/useLoginForm';
import {
  AuthBranding,
  AuthMobileLogo,
  AuthHeader,
  AuthFooter,
  LoginForm,
} from '../components';

export default function LoginPage() {
  const form = useLoginForm();

  useEffect(() => {
    document.title = 'Iniciar sesión | CCSS Consultorio';
  }, []);

  return (
    <div className="min-h-screen flex">
      <AuthBranding />

      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          <AuthMobileLogo />
          <AuthHeader title="Iniciar sesión" subtitle="Ingrese sus credenciales para continuar" />
          <LoginForm
            email={form.email}
            password={form.password}
            showPassword={form.showPassword}
            isLoading={form.isLoading}
            errors={form.errors}
            onEmailChange={form.handleEmailChange}
            onPasswordChange={form.handlePasswordChange}
            onTogglePassword={form.togglePassword}
            onSubmit={form.handleSubmit}
          />
          <AuthFooter />
        </div>
      </div>
    </div>
  );
}
