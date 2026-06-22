import { History } from 'lucide-react';
import { getLogs } from '../services/notificationsService';

const logs = getLogs();

function initials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);
}

export default function NotificationChangeLog() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-5">
        <History className="w-5 h-5 text-blue-600" />
        <h2 className="text-base font-semibold text-gray-900">Registro de cambios</h2>
      </div>
      <p className="text-xs text-gray-400 mb-4">
        Acciones realizadas por administradores en este módulo.
      </p>

      <div className="space-y-4">
        {logs.map((log, i) => (
          <div key={log.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-semibold">{initials(log.admin)}</span>
              </div>
              {i < logs.length - 1 && <div className="w-px flex-1 bg-gray-100 mt-1" />}
            </div>
            <div className="pb-4">
              <p className="text-xs font-medium text-gray-800">{log.admin}</p>
              <p className="text-xs text-gray-500 mt-0.5">{log.action}</p>
              <p className="text-xs text-gray-400 mt-1">{log.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
