import { useEffect } from 'react';
import { useLoginForm } from '../hooks/useLoginForm';
import { AuthLayout, AuthMobileLogo, AuthHeader, AuthFooter, LoginForm } from '../components';

export default function LoginPage() {
  const form = useLoginForm();

  useEffect(() => {
    document.title = 'Iniciar sesión | CCSS Consultorio';
  }, []);

  return (
    <AuthLayout>
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
    </AuthLayout>
  );
}
