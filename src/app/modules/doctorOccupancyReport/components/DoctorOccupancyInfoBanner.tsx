import { Info } from 'lucide-react';

export default function DoctorOccupancyInfoBanner() {
  return (
    <div className="flex items-start gap-2.5 px-4 py-3 bg-blue-50 border border-blue-100 rounded-lg mb-6 text-sm text-blue-700">
      <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
      <span>
        El rango de fechas debe cubrir <strong>mínimo 60 días</strong> de historial para asegurar promedios
        representativos. El <strong>Promedio Diario</strong> se calcula dividiendo las citas asignadas entre los días del período.
      </span>
    </div>
  );
}
