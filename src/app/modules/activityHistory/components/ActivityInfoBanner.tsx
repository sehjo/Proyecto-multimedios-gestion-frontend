import { Info } from 'lucide-react';

export default function ActivityInfoBanner() {
  return (
    <div className="flex items-start gap-2.5 px-4 py-3 bg-blue-50 border border-blue-100 rounded-lg mb-6 text-sm text-blue-700">
      <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
      <span>
        Se registran todas las acciones críticas del sistema incluyendo{' '}
        <strong>inicio/cierre de sesión</strong>, <strong>exportaciones</strong>, creaciones,
        ediciones y eliminaciones. La fecha y hora aparecen en columnas separadas para facilitar
        la lectura.
      </span>
    </div>
  );
}
