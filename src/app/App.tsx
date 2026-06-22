import { RouterProvider } from 'react-router';
import { Toaster } from 'sonner';
import { router } from './routes';
import { AuthProvider } from '../context/AuthContext';
import { ActivityProvider } from '../context/ActivityContext';
import { SpecialtiesProvider } from '../context/SpecialtiesContext';
import { UserTypesProvider } from '../context/UserTypesContext';

export default function App() {
  return (
    <AuthProvider>
      <ActivityProvider>
        <UserTypesProvider>
        <SpecialtiesProvider>
          <RouterProvider router={router} />
          <Toaster position="top-right" richColors />
        </SpecialtiesProvider>
        </UserTypesProvider>
      </ActivityProvider>
    </AuthProvider>
  );
}
