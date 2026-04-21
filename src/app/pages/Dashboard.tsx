import { useEffect, useState } from 'react';
import { UserCircle, Users, TrendingUp, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router';
import StatsCard from '../components/StatsCard';
import { getPatients, getUsers } from '../../api/services';
import { useActivity } from '../../context/ActivityContext';

type ActivityItem = { id: string; type: string; name: string; timestamp: number };

const formatTimeAgo = (timestamp: number, now: number) => {
  const elapsedSeconds = Math.floor((now - timestamp) / 1000);

  if (elapsedSeconds < 60) return 'Hace unos segundos';

  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  if (elapsedMinutes < 60) {
    return `Hace ${elapsedMinutes} ${elapsedMinutes === 1 ? 'minuto' : 'minutos'}`;
  }

  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) {
    return `Hace ${elapsedHours} ${elapsedHours === 1 ? 'hora' : 'horas'}`;
  }

  const elapsedDays = Math.floor(elapsedHours / 24);
  return `Hace ${elapsedDays} ${elapsedDays === 1 ? 'día' : 'días'}`;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { recentActivity, activityVersion } = useActivity();
  const [stats, setStats] = useState({
    patients: 0,
    users: 0,
  });
  const [nowTick, setNowTick] = useState(Date.now());

  useEffect(() => {
    loadStats();
  }, [activityVersion]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNowTick(Date.now());
    }, 60000);

    return () => window.clearInterval(intervalId);
  }, []);

  const loadStats = async () => {
    try {
      const [patientsData, usersData] = await Promise.all([
        getPatients().catch(() => ({ meta: { total: 0 } })),
        getUsers().catch(() => ({ meta: { total: 0 } })),
      ]);

      setStats({
        patients: patientsData.meta?.total || 0,
        users: usersData.meta?.total || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  return (
    <div className="app-page p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-500">Bienvenido al Sistema de Consultorio CCSS</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <StatsCard
          title="Total Pacientes"
          value={stats.patients}
          icon={UserCircle}
          trend="+12% este mes"
          trendUp={true}
        />
        <StatsCard
          title="Total Usuarios"
          value={stats.users}
          icon={Users}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Actividad Reciente</h2>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentActivity.length === 0 && (
              <p className="text-sm text-gray-500">Aún no hay acciones recientes.</p>
            )}
            {recentActivity.map((activity: ActivityItem) => (
              <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0">
                <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.type}</p>
                  <p className="text-sm text-gray-600 break-words">{activity.name}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatTimeAgo(activity.timestamp, nowTick)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Acciones Rápidas</h2>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/patients?action=new')}
              className="p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
            >
              <UserCircle className="w-6 h-6 text-blue-600 mb-2" />
              <p className="text-sm font-medium text-gray-900">Nuevo Paciente</p>
            </button>
            <button
              onClick={() => navigate('/users')}
              className="p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
            >
              <Users className="w-6 h-6 text-blue-600 mb-2" />
              <p className="text-sm font-medium text-gray-900">Gestionar Usuarios</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
