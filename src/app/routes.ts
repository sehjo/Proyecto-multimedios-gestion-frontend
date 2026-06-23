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
          { path: 'doctors', lazy: () => import('./modules/doctors/pages/DoctorsPage').then(m => ({ Component: m.default })) },
          { path: 'agenda', lazy: () => import('./pages/Agenda').then(m => ({ Component: m.default })) },
          { path: 'horario-config', lazy: () => import('./pages/HorarioConfig').then(m => ({ Component: m.default })) },
          { path: 'bloqueo-agenda', lazy: () => import('./pages/BloqueoAgenda').then(m => ({ Component: m.default })) },
          { path: 'resumen-diario', lazy: () => import('./pages/ResumenDiario').then(m => ({ Component: m.default })) },
          { path: 'reports/patients', lazy: () => import('./modules/patientsReport/pages/PatientsReportPage').then(m => ({ Component: m.default })) },
          { path: 'reports/appointments', lazy: () => import('./modules/appointmentsReport/pages/AppointmentsReportPage').then(m => ({ Component: m.default })) },
          { path: 'notifications', lazy: () => import('./modules/notifications/pages/NotificationSettingsPage').then(m => ({ Component: m.default })) },
          { path: 'medical-history', lazy: () => import('./modules/medicalHistory/pages/MedicalHistoryPage').then(m => ({ Component: m.default })) },
          { path: 'medical-history/:patientId', lazy: () => import('./modules/medicalHistory/pages/PatientHistoryPage').then(m => ({ Component: m.default })) },
          { path: 'reports/doctors', lazy: () => import('./modules/doctorOccupancyReport/pages/DoctorOccupancyPage').then(m => ({ Component: m.default })) },
          { path: 'audit', lazy: () => import('./modules/activityHistory/pages/ActivityHistoryPage').then(m => ({ Component: m.default })) },
          { path: '*', lazy: () => import('./pages/NotFound').then(m => ({ Component: m.default })) },
        ],
      },
    ],
  },
]);
