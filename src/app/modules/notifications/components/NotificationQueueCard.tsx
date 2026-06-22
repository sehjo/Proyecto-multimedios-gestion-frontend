import { Info, Mail, Bell } from 'lucide-react';
import { getQueue } from '../services/notificationsService';

const queue = getQueue();

export default function NotificationQueueCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-start gap-3 mb-5">
        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Info className="w-4 h-4 text-amber-600" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-gray-900">Cola de procesamiento</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Las notificaciones ya en cola conservan la configuración con la que fueron
            programadas. Solo los nuevos lotes usarán la configuración actualizada.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {['ID', 'Paciente', 'Canal', 'Programado', 'Config.'].map((col) => (
                <th
                  key={col}
                  className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wide"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {queue.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-2.5 px-3 text-gray-500 text-xs">#{item.id}</td>
                <td className="py-2.5 px-3 text-gray-800 font-medium">{item.patient}</td>
                <td className="py-2.5 px-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      item.type === 'Correo'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-purple-50 text-purple-700'
                    }`}
                  >
                    {item.type === 'Correo' ? (
                      <Mail className="w-3 h-3" />
                    ) : (
                      <Bell className="w-3 h-3" />
                    )}
                    {item.type}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-gray-500 text-xs">{item.scheduled}</td>
                <td className="py-2.5 px-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono bg-gray-100 text-gray-600">
                    {item.config}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
