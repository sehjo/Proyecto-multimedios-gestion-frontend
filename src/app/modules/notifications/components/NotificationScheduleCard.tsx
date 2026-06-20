import { CalendarClock, Clock, Save, CheckCircle2 } from 'lucide-react';
import { DAYS } from '../constants';

interface NotificationScheduleCardProps {
  sendTime: string;
  selectedDays: number[];
  saved: boolean;
  onTimeChange: (value: string) => void;
  onToggleDay: (index: number) => void;
  onSave: () => void;
}

export default function NotificationScheduleCard({
  sendTime,
  selectedDays,
  saved,
  onTimeChange,
  onToggleDay,
  onSave,
}: NotificationScheduleCardProps) {
  return (
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
            onChange={(e) => onTimeChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
          />
          <p className="text-xs text-gray-400 mt-1">Zona horaria: UTC-6 (Costa Rica)</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Días de envío</label>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((day, i) => (
              <button
                key={day}
                type="button"
                onClick={() => onToggleDay(i)}
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
          onClick={onSave}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
            saved ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
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
  );
}
