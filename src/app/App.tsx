import { RouterProvider } from 'react-router';
import { Toaster } from 'sonner';
import { router } from './routes';
import { AuthProvider } from '../context/AuthContext';
import { ActivityProvider } from '../context/ActivityContext';
import { SpecialtiesProvider } from '../context/SpecialtiesContext';

export default function App() {
  return (
    <AuthProvider>
      <ActivityProvider>
        <SpecialtiesProvider>
          <RouterProvider router={router} />
          <Toaster position="top-right" richColors />
        </SpecialtiesProvider>
      </ActivityProvider>
    </AuthProvider>
  );
}
