import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router';
import {
  LayoutDashboard,
  Users,
  UserCircle,
  CalendarDays,
  ClipboardList,
  CalendarClock,
  CalendarX,
  Stethoscope,
  Settings,
  LogOut,
  Menu,
  X,
  UserCheck,
  History,
  ShieldCheck,
  ScrollText,
} from 'lucide-react';
import { useAuth } from '../modules/auth';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, can } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Hide nav entries the user can't access (UX gate; the backend still enforces).
  // `perm: null` → always visible. Otherwise needs the matching read permission.
  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard, perm: null },
    { name: 'Pacientes', href: '/patients', icon: UserCircle, perm: 'patients.read' },
    { name: 'Citas', href: '/appointments', icon: CalendarDays, perm: null },
    { name: 'Historial Médico', href: '/medical-history', icon: History, perm: null },
    { name: 'Usuarios', href: '/users', icon: Users, perm: 'users.read' },
    { name: 'Roles', href: '/roles', icon: ShieldCheck, perm: 'roles.read' },
    { name: 'Auditoría', href: '/audit', icon: ScrollText, perm: null },
    { name: 'Reporte de Pacientes', href: '/reports/patients', icon: UserCheck, perm: null },
    { name: 'Agenda', href: '/agenda', icon: CalendarDays, perm: null },
    { name: 'Bloques Horarios', href: '/horario-config', icon: CalendarClock, perm: null },
    { name: 'Bloqueo de Agenda', href: '/bloqueo-agenda', icon: CalendarX, perm: null },
    { name: 'Resumen Diario', href: '/resumen-diario', icon: Stethoscope, perm: null },
    { name: 'Configuración', href: '/settings', icon: Settings, perm: null },
  ].filter((item) => item.perm === null || can(item.perm));

  const isNavActive = (href: string) =>
    href === '/'
      ? location.pathname === '/'
      : location.pathname === href || location.pathname.startsWith(href + '/');

  const currentPageTitle = navigation.find((item) => isNavActive(item.href))?.name ?? 'Página no encontrada';

  useEffect(() => {
    document.title = `${currentPageTitle} | CCSS Consultorio`;
  }, [currentPageTitle]);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  // Generate initials from user name
  const initials = user?.name
    ? user.name
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'U';

  return (
    <div className="app-layout flex h-screen bg-gray-50">
      <button
        type="button"
        aria-label="Cerrar menú de navegación"
        onClick={() => setIsSidebarOpen(false)}
        className={`app-sidebar-backdrop fixed inset-0 z-30 bg-black/40 transition-opacity duration-300 lg:hidden ${
          isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Sidebar */}
      <aside
        className={`app-sidebar fixed inset-y-0 left-0 z-40 w-72 max-w-[86vw] bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 lg:static lg:inset-auto lg:z-auto lg:w-64 lg:max-w-none lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="font-semibold text-lg text-gray-900">CCSS</h1>
                <p className="text-xs text-gray-500">Consultory System</p>
              </div>
            </div>
            <button
              type="button"
              aria-label="Cerrar menú"
              onClick={() => setIsSidebarOpen(false)}
              className="rounded-md p-1 text-gray-500 hover:bg-gray-100 lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = isNavActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User info + logout */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-semibold">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name || 'Usuario'}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Cerrar sesión"
              className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="app-mobile-header flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 lg:hidden">
          <button
            type="button"
            aria-label="Abrir menú de navegación"
            onClick={() => setIsSidebarOpen(true)}
            className="rounded-md p-1 text-gray-600 hover:bg-gray-100"
          >
            <Menu className="h-5 w-5" />
          </button>
          <p className="text-sm font-semibold text-gray-900">{currentPageTitle}</p>
          <div className="w-7" aria-hidden="true" />
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
