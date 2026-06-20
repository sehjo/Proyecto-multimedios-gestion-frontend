import { getQueue } from '../services/notificationsService';

interface NotificationStatusCardProps {
  emailEnabled: boolean;
  systemEnabled: boolean;
  sendTime: string;
  selectedDays: number[];
}

const queueLength = getQueue().length;

export default function NotificationStatusCard({
  emailEnabled,
  systemEnabled,
  sendTime,
  selectedDays,
}: NotificationStatusCardProps) {
  const daysLabel =
    selectedDays.length === 0
      ? 'Ninguno'
      : selectedDays.length === 7
      ? 'Todos'
      : `${selectedDays.length} días`;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-base font-semibold text-gray-900 mb-4">Estado actual</h2>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Correo electrónico</span>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              emailEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {emailEnabled ? 'Activo' : 'Inactivo'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Notif. Sistema</span>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              systemEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {systemEnabled ? 'Activo' : 'Inactivo'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Hora de envío</span>
          <span className="text-xs font-medium text-gray-700 font-mono">{sendTime}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Días activos</span>
          <span className="text-xs font-medium text-gray-700">{daysLabel}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">En cola</span>
          <span className="text-xs font-medium text-blue-700">{queueLength} notif.</span>
        </div>
      </div>
    </div>
  );
}
