// import { Navigate, Outlet } from 'react-router';
// import { useAuth } from '../../context/AuthContext';
// import { Loader2 } from 'lucide-react';
import { Outlet } from 'react-router';

export default function ProtectedRoute() {
  // const { isAuthenticated, isLoading } = useAuth();

  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gray-50">
  //       <div className="flex flex-col items-center gap-3">
  //         <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
  //         <p className="text-sm text-gray-500">Cargando…</p>
  //       </div>
  //     </div>
  //   );
  // }

  // return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
  return <Outlet />;
}