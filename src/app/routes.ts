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
          { path: 'users',    lazy: () => import('./pages/Users').then(m => ({ Component: m.default }))    },
          { path: 'agenda',         lazy: () => import('./pages/Agenda').then(m => ({ Component: m.default }))        },
          { path: 'horario-config', lazy: () => import('./pages/HorarioConfig').then(m => ({ Component: m.default })) },
          { path: 'settings', lazy: () => import('./pages/Settings').then(m => ({ Component: m.default })) },
          { path: '*', lazy: () => import('./pages/NotFound').then(m => ({ Component: m.default })) },
        ],
      },
    ],
  },
]);
