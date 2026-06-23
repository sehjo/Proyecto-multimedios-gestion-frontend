import { Outlet } from 'react-router';

// Auth guard is temporarily disabled for development (renders children directly).
// Re-enable with useAuth() + isAuthenticated/isLoading when wiring real sessions.
export default function ProtectedRoute() {
  return <Outlet />;
}