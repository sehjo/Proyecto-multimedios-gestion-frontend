import { useState } from 'react';
import {
  Bell,
  Mail,
  MonitorCheck,
  Clock,
  Save,
  ShieldCheck,
  Info,
  CheckCircle2,
  XCircle,
  History,
  CalendarClock,
} from 'lucide-react';

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const MOCK_LOGS = [
  {
    id: 1,
    admin: 'Ana García',
    action: 'Habilitó notificaciones por correo',
    date: '2026-06-07 08:14',
  },
  {
    id: 2,
    admin: 'Carlos Mora',
    action: 'Cambió horario de envío a 07:00',
    date: '2026-06-06 15:32',
  },
  {
    id: 3,
    admin: 'Ana García',
    action: 'Deshabilitó notificaciones internas',
    date: '2026-06-05 09:05',
  },
  {
    id: 4,
    admin: 'Luis Rodríguez',
    action: 'Habilitó notificaciones internas',
    date: '2026-06-04 11:20',
  },
];

const MOCK_QUEUE = [
  { id: 101, patient: 'María López', type: 'Correo', scheduled: '2026-06-08 07:00', config: 'v2.1' },
  { id: 102, patient: 'José Vargas', type: 'Sistema', scheduled: '2026-06-08 07:00', config: 'v2.1' },
  { id: 103, patient: 'Laura Jiménez', type: 'Correo', scheduled: '2026-06-09 07:00', config: 'v2.1' },
];

export default function NotificationSettings() {
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [systemEnabled, setSystemEnabled] = useState(true);
  const [sendTime, setSendTime] = useState('07:00');
  const [selectedDays, setSelectedDays] = useState([0, 1, 2, 3, 4]);
  const [saved, setSaved] = useState(false);

  const toggleDay = (index: number) => {
    setSelectedDays((prev) =>
      prev.includes(index) ? prev.filter((d) => d !== index) : [...prev, index]
    );
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="app-page p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <Bell className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">
              Configuración de Notificaciones
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              Gestione los canales de notificación y los horarios de envío de recordatorios diarios
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg w-fit">
          <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span className="text-xs text-amber-700 font-medium">
            Solo usuarios con rol de Administrador pueden guardar cambios en este módulo
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="xl:col-span-2 space-y-6">

          {/* Escenario 1: Canales de notificación */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-1">
              <MonitorCheck className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-semibold text-gray-900">Canales de notificación</h2>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Active o desactive los canales por los que el sistema enviará los recordatorios.
            </p>

            <div className="space-y-4">
              {/* Email channel */}
              <div
                className={`flex items-start justify-between gap-4 p-4 rounded-lg border transition-colors ${
                  emailEnabled ? 'border-blue-200 bg-blue-50/50' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      emailEnabled ? 'bg-blue-100' : 'bg-gray-200'
                    }`}
                  >
                    <Mail className={`w-5 h-5 ${emailEnabled ? 'text-blue-600' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Notificaciones por Correo</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Envía recordatorios al correo electrónico registrado del paciente
                    </p>
                    <span
                      className={`inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                        emailEnabled
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {emailEnabled ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      {emailEnabled ? 'Habilitado' : 'Deshabilitado'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={emailEnabled}
                  onClick={() => setEmailEnabled((v) => !v)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    emailEnabled ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      emailEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* System channel */}
              <div
                className={`flex items-start justify-between gap-4 p-4 rounded-lg border transition-colors ${
                  systemEnabled ? 'border-blue-200 bg-blue-50/50' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      systemEnabled ? 'bg-blue-100' : 'bg-gray-200'
                    }`}
                  >
                    <Bell className={`w-5 h-5 ${systemEnabled ? 'text-blue-600' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Notificaciones del Sistema</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Genera alertas internas visibles dentro de la plataforma
                    </p>
                    <span
                      className={`inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                        systemEnabled
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {systemEnabled ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      {systemEnabled ? 'Habilitado' : 'Deshabilitado'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={systemEnabled}
                  onClick={() => setSystemEnabled((v) => !v)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    systemEnabled ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      systemEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Escenario 2: Configuración horaria */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-1">
              <CalendarClock className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-semibold text-gray-900">Horario de envío</h2>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Define la hora y los días en que el sistema ejecutará los lotes de recordatorios.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Clock className="w-4 h-4 inline mr-1 text-gray-400" />
                  Hora de envío
                </label>
                <input
                  type="time"
                  value={sendTime}
                  onChange={(e) => setSendTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                />
                <p className="text-xs text-gray-400 mt-1">Zona horaria: UTC-6 (Costa Rica)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Días de envío
                </label>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map((day, i) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(i)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                        selectedDays.includes(i)
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Los cambios aplican a los lotes programados después de guardar.
              </p>
              <button
                type="button"
                onClick={handleSave}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  saved
                    ? 'bg-green-600 text-white'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {saved ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Guardado
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Guardar cambios
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Escenario 3: Cola de procesamiento */}
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
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      ID
                    </th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Paciente
                    </th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Canal
                    </th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Programado
                    </th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Config.
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {MOCK_QUEUE.map((item) => (
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
        </div>

        {/* Right column: log de cambios */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-5">
              <History className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-semibold text-gray-900">Registro de cambios</h2>
            </div>
            <p className="text-xs text-gray-400 mb-4">
              Acciones realizadas por administradores en este módulo.
            </p>

            <div className="space-y-4">
              {MOCK_LOGS.map((log, i) => (
                <div key={log.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-semibold">
                        {log.admin
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)}
                      </span>
                    </div>
                    {i < MOCK_LOGS.length - 1 && (
                      <div className="w-px flex-1 bg-gray-100 mt-1" />
                    )}
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

          {/* Resumen de estado actual */}
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
                <span className="text-xs font-medium text-gray-700">
                  {selectedDays.length === 0
                    ? 'Ninguno'
                    : selectedDays.length === 7
                    ? 'Todos'
                    : `${selectedDays.length} días`}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">En cola</span>
                <span className="text-xs font-medium text-blue-700">{MOCK_QUEUE.length} notif.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
