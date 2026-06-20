import { useEffect } from 'react';
import { useResetPasswordForm } from '../hooks/useResetPasswordForm';
import {
  AuthCardLayout,
  RequestResetForm,
  NewPasswordForm,
  BackToLoginLink,
} from '../components';

export default function ResetPasswordPage() {
  const form = useResetPasswordForm();

  useEffect(() => {
    document.title = 'Restablecer contraseña | CCSS Consultorio';
  }, []);

  return (
    <AuthCardLayout footer={<BackToLoginLink onClick={form.goToLogin} />}>
      {form.step === 'request' ? (
        <RequestResetForm
          email={form.email}
          loading={form.loading}
          onEmailChange={form.setEmail}
          onSubmit={form.handleRequestSubmit}
        />
      ) : (
        <NewPasswordForm
          password={form.password}
          confirmPassword={form.confirmPassword}
          showPassword={form.showPassword}
          showConfirm={form.showConfirm}
          loading={form.loading}
          onPasswordChange={form.setPassword}
          onConfirmChange={form.setConfirmPassword}
          onTogglePassword={form.toggleShowPassword}
          onToggleConfirm={form.toggleShowConfirm}
          onSubmit={form.handleResetSubmit}
        />
      )}
    </AuthCardLayout>
  );
}
