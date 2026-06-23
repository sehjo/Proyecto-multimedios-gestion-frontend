import { useState } from 'react';
import { CalendarClock, Clock } from 'lucide-react';
import RescheduleAppointmentModal from './RescheduleAppointmentModal';
import { formatLongDate } from '../holidays.format';
import type { PendingReschedule } from '../types/holidays.types';

interface RescheduleModalProps {
  appointments: PendingReschedule[];
  today: string;
  validateSlot: (date: string, time: string) => string | null;
  // Reschedule a single appointment; returns true when it succeeded.
  onRescheduleOne: (appointment: PendingReschedule, date: string, time: string) => boolean;
  // Close without resolving the rest ("Hacerlo más tarde"); queue stays saved.
  onLater: () => void;
  // Go to the dedicated reschedule queue page ("Reagendar todas").
  onRescheduleAll: () => void;
}

// "Reagenda" prompt shown after a holiday displaces appointments (HU-039,
// scenario 3): lists every appointment that needs rescheduling, lets staff
// reschedule one inline, defer them all, or jump to the full queue page.
export default function RescheduleModal({
  appointments,
  today,
  validateSlot,
  onRescheduleOne,
  onLater,
  onRescheduleAll,
}: RescheduleModalProps) {
  // The appointment currently being rescheduled in the nested modal, if any.
  const [active, setActive] = useState<PendingReschedule | null>(null);
  // Locally resolved ids so the row reflects the change without closing the list.
  const [resolved, setResolved] = useState<Set<number>>(new Set());

  const pending = appointments.filter((a) => !resolved.has(a.id));

  const handleConfirmOne = (date: string, time: string) => {
    if (!active) return;
    const ok = onRescheduleOne(active, date, time);
    if (ok) {
      const wasLast = pending.length === 1 && pending[0].id === active.id;
      setResolved((prev) => new Set(prev).add(active.id));
      setActive(null);
      // Nothing left to reschedule: close the prompt (the queue stays persisted).
      if (wasLast) onLater();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-start gap-3 p-6 pb-4 border-b border-gray-100">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <CalendarClock className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Reagenda</h3>
            <p className="text-sm text-gray-500">
              Estas citas quedaron en «Pendiente de Reprogramación». Reagéndelas ahora o más tarde.
            </p>
          </div>
        </div>

        <div className="p-6 overflow-y-auto space-y-2">
          {pending.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-6">
              Todas las citas fueron reprogramadas.
            </p>
          ) : (
            pending.map((appt) => (
              <div
                key={appt.id}
                className="border border-gray-200 rounded-lg px-4 py-3 flex items-start justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 text-sm">{appt.patientName}</p>
                  <p className="text-xs text-gray-500">
                    {appt.doctorName} · {appt.specialty}
                  </p>
                  <p className="flex items-center gap-1 text-xs text-gray-500 mt-0.5 capitalize">
                    <Clock className="w-3.5 h-3.5" />
                    {formatLongDate(appt.originalDate)} — {appt.originalTime}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActive(appt)}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-800 border border-indigo-200 rounded-lg px-3 py-1.5 hover:bg-indigo-50 transition-colors flex-shrink-0"
                >
                  Reagendar esta cita
                </button>
              </div>
            ))
          )}
        </div>

        <div className="flex gap-3 p-6 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onLater}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Hacerlo más tarde
          </button>
          <button
            type="button"
            onClick={onRescheduleAll}
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Reagendar todas
          </button>
        </div>
      </div>

      {active && (
        <RescheduleAppointmentModal
          appointment={active}
          today={today}
          validateSlot={validateSlot}
          onCancel={() => setActive(null)}
          onConfirm={handleConfirmOne}
        />
      )}
    </div>
  );
}
