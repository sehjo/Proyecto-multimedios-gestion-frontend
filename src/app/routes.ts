import { createBrowserRouter } from 'react-router';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import ResetPassword from './pages/ResetPassword';

export const router = createBrowserRouter([
  {
    path: '/login',
    lazy: () => import('./pages/Login').then(m => ({ Component: m.default })),
  },
  {
    path: '/reset-password',
    Component: ResetPassword,
  },
  {
    path: '/',
    Component: ProtectedRoute,
    children: [
      {
        Component: Layout,
        children: [
          { index: true, lazy: () => import('./pages/Dashboard').then(m => ({ Component: m.default })) },
          { path: 'patients', lazy: () => import('./pages/Patients').then(m => ({ Component: m.default })) },
          { path: 'appointments', lazy: () => import('./pages/Appointments').then(m => ({ Component: m.default })) },
          { path: 'users', lazy: () => import('./pages/Users').then(m => ({ Component: m.default })) },
          { path: 'agenda', lazy: () => import('./modules/agenda/pages/AgendaPage').then(m => ({ Component: m.default })) },
          { path: 'horario-config', lazy: () => import('./pages/HorarioConfig').then(m => ({ Component: m.default })) },
          { path: 'bloqueo-agenda', lazy: () => import('./pages/BloqueoAgenda').then(m => ({ Component: m.default })) },
          { path: 'resumen-diario', lazy: () => import('./pages/ResumenDiario').then(m => ({ Component: m.default })) },
          { path: 'settings', lazy: () => import('./pages/Settings').then(m => ({ Component: m.default })) },
          { path: 'medical-history', lazy: () => import('./pages/MedicalHistory').then(m => ({ Component: m.default })) },
          { path: 'medical-history/:patientId', lazy: () => import('./pages/PatientHistory').then(m => ({ Component: m.default })) },
          { path: '*', lazy: () => import('./pages/NotFound').then(m => ({ Component: m.default })) },
        ],
      },
    ],
  },
]);
