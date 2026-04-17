import { RouterProvider } from 'react-router';
import { Toaster } from 'sonner';
import { router } from './routes';
import { AuthProvider } from '../context/AuthContext';
import { ActivityProvider } from '../context/ActivityContext';

export default function App() {
  return (
    <AuthProvider>
      <ActivityProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" richColors />
      </ActivityProvider>
    </AuthProvider>
  );
}
