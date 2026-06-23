import { RouterProvider } from 'react-router';
import { Toaster } from 'sonner';
import { router } from './routes';
import { AuthProvider } from './modules/auth';
import { ActivityProvider } from '../context/ActivityContext';
import { HistoryProvider } from '../context/HistoryContext';
import { DoctorsMockProvider } from '../context/DoctorsMockContext';

export default function App() {
  return (
    <AuthProvider>
      <ActivityProvider>
        <HistoryProvider>
          <DoctorsMockProvider>
            <RouterProvider router={router} />
            <Toaster position="top-right" richColors />
          </DoctorsMockProvider>
        </HistoryProvider>
      </ActivityProvider>
    </AuthProvider>
  );
}
