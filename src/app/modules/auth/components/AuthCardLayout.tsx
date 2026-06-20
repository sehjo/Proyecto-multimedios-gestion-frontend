import { ReactNode } from 'react';

interface AuthCardLayoutProps {
  // Main card content.
  children: ReactNode;
  // Optional content below the card (e.g. a "back to login" link).
  footer?: ReactNode;
}

// Centered single-card auth layout (used by the password-reset screen).
export default function AuthCardLayout({ children, footer }: AuthCardLayoutProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8">{children}</div>
        {footer && <div className="text-center mt-4">{footer}</div>}
      </div>
    </div>
  );
}
