import type { MouseEvent } from 'react';
import { FileText, Phone } from 'lucide-react';
import type { TooltipState } from '../types/agenda.types';

interface AppointmentTooltipCardProps {
  tooltip: TooltipState;
}

export default function AppointmentTooltipCard({ tooltip }: AppointmentTooltipCardProps) {
  const stopPropagation = (e: MouseEvent) => e.stopPropagation();

  return (
    <div
      className="fixed z-50 bg-gray-900 text-white rounded-xl shadow-2xl p-3 w-64 pointer-events-none"
      style={{ top: tooltip.y, left: Math.min(tooltip.x, window.innerWidth - 272) }}
      onClick={stopPropagation}
    >
      <div className="text-xs font-semibold text-gray-200 mb-2 truncate">{tooltip.appt.patientName}</div>
      <div className="flex items-center gap-2 mb-1.5">
        <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
        <span className="text-xs text-gray-100">{tooltip.appt.phone}</span>
      </div>
      <div className="flex items-start gap-2">
        <FileText className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
        <span className="text-xs text-gray-300 leading-relaxed">{tooltip.appt.notes}</span>
      </div>
    </div>
  );
}
