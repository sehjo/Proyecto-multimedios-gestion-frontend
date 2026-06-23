import { STATUS_CONFIG } from '../constants';
import type { AppointmentStatus, StatusConfigEntry } from '../types/agenda.types';

export default function StatusLegend() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Leyenda</h3>
      <div className="space-y-2.5">
        {(Object.entries(STATUS_CONFIG) as [AppointmentStatus, StatusConfigEntry][]).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
            <span className="text-xs text-gray-600">{cfg.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
