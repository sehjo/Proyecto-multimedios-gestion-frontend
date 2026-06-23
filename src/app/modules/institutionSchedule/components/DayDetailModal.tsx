import { X, Clock, CalendarCheck, CalendarClock, CalendarX2, Ban } from 'lucide-react';
import { formatLongDate } from '../holidays.format';
import type { DayAppointment, DayDetail } from '../types/availability.types';

interface DayDetailModalProps {
  detail: DayDetail;
  grouped: Record<DayAppointment['status'], DayAppointment[]>;
  onClose: () => void;
}

const STATUS_SECTIONS: {
  status: DayAppointment['status'];
  label: string;
  badge: string;
}[] = [
  { status: 'confirmed', label: 'Confirmadas', badge: 'bg-green-100 text-green-700' },
  { status: 'pending', label: 'Pendientes', badge: 'bg-amber-100 text-amber-700' },
  { status: 'cancelled', label: 'Canceladas', badge: 'bg-red-100 text-red-700' },
];

// Day detail (HU-039, availability scenario 2): the day's appointments grouped
// by status, plus worked hours and remaining slots.
export default function DayDetailModal({ detail, grouped, onClose }: DayDetailModalProps) {
  const isClosed = detail.level === 'closed';

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-start justify-between gap-3 p-6 pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 capitalize">
              {formatLongDate(detail.date)}
            </h3>
            <p className="text-sm text-gray-500">Detalle de disponibilidad del día</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="text-gray-400 hover:text-gray-600 p-1 rounded flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          {isClosed ? (
            <div className="flex items-center gap-2.5 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
              <Ban className="w-4 h-4 text-gray-400 flex-shrink-0" />
              La institución está cerrada este día (feriado o día no habilitado).
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg border border-gray-200 p-3 text-center">
                <p className="flex items-center justify-center gap-1 text-xs text-gray-500 mb-1">
                  <Clock className="w-3.5 h-3.5" />
                  Horas
                </p>
                <p className="text-lg font-semibold text-gray-900">{detail.openHours}h</p>
              </div>
              <div className="rounded-lg border border-gray-200 p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">Citas activas</p>
                <p className="text-lg font-semibold text-gray-900">{detail.bookedCount}</p>
              </div>
              <div className="rounded-lg border border-gray-200 p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">Cupos libres</p>
                <p className="text-lg font-semibold text-gray-900">
                  {detail.slotsLeft}
                  <span className="text-sm text-gray-400">/{detail.capacity}</span>
                </p>
              </div>
            </div>
          )}

          {STATUS_SECTIONS.map(({ status, label, badge }) => {
            const items = grouped[status];
            const icon =
              status === 'confirmed' ? (
                <CalendarCheck className="w-4 h-4 text-green-600" />
              ) : status === 'pending' ? (
                <CalendarClock className="w-4 h-4 text-amber-600" />
              ) : (
                <CalendarX2 className="w-4 h-4 text-red-600" />
              );
            return (
              <div key={status}>
                <div className="flex items-center gap-2 mb-2">
                  {icon}
                  <h4 className="text-sm font-semibold text-gray-900">{label}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge}`}>
                    {items.length}
                  </span>
                </div>
                {items.length === 0 ? (
                  <p className="text-xs text-gray-400">Sin citas {label.toLowerCase()}.</p>
                ) : (
                  <ul className="space-y-1.5">
                    {items.map((appt) => (
                      <li
                        key={appt.id}
                        className="flex items-center justify-between gap-3 text-xs border border-gray-200 rounded-lg px-3 py-2"
                      >
                        <span className="font-medium text-gray-900">{appt.patientName}</span>
                        <span className="text-gray-500">{appt.doctorName}</span>
                        <span className="flex items-center gap-1 text-gray-500 flex-shrink-0">
                          <Clock className="w-3.5 h-3.5" />
                          {appt.time}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        <div className="p-6 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
