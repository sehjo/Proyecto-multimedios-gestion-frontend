import { ReactNode } from 'react';
import AuthBranding from './AuthBranding';

interface AuthLayoutProps {
  children: ReactNode;
}

// Split auth layout: branding panel on the left, a centered content panel on the
// right. Pages drop their form/header into children without writing the layout markup.
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      <AuthBranding />
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
