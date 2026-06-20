import { MonitorCheck, Mail, Bell } from 'lucide-react';
import NotificationChannelToggle from './NotificationChannelToggle';

interface NotificationChannelsCardProps {
  emailEnabled: boolean;
  systemEnabled: boolean;
  onToggleEmail: () => void;
  onToggleSystem: () => void;
}

export default function NotificationChannelsCard({
  emailEnabled,
  systemEnabled,
  onToggleEmail,
  onToggleSystem,
}: NotificationChannelsCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-1">
        <MonitorCheck className="w-5 h-5 text-blue-600" />
        <h2 className="text-base font-semibold text-gray-900">Canales de notificación</h2>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        Active o desactive los canales por los que el sistema enviará los recordatorios.
      </p>
      <div className="space-y-4">
        <NotificationChannelToggle
          label="Notificaciones por Correo"
          description="Envía recordatorios al correo electrónico registrado del paciente"
          icon={<Mail className={`w-5 h-5 ${emailEnabled ? 'text-blue-600' : 'text-gray-400'}`} />}
          enabled={emailEnabled}
          onToggle={onToggleEmail}
        />
        <NotificationChannelToggle
          label="Notificaciones del Sistema"
          description="Genera alertas internas visibles dentro de la plataforma"
          icon={<Bell className={`w-5 h-5 ${systemEnabled ? 'text-blue-600' : 'text-gray-400'}`} />}
          enabled={systemEnabled}
          onToggle={onToggleSystem}
        />
      </div>
    </div>
  );
}
