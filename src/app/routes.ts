import { createBrowserRouter } from 'react-router';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/login',
    lazy: () => import('./modules/auth/pages/LoginPage').then(m => ({ Component: m.default })),
  },
  {
    path: '/reset-password',
    lazy: () => import('./modules/auth/pages/ResetPasswordPage').then(m => ({ Component: m.default })),
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
          { path: 'appointments', lazy: () => import('./modules/appointments/pages/AppointmentsPage').then(m => ({ Component: m.default })) },
          { path: 'users', lazy: () => import('./modules/users/pages/UsersPage').then(m => ({ Component: m.default })) },
          { path: 'roles', lazy: () => import('./modules/roles/pages/RolesPage').then(m => ({ Component: m.default })) },
          { path: 'agenda', lazy: () => import('./pages/Agenda').then(m => ({ Component: m.default })) },
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
