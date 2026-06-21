import { ShieldCheck } from 'lucide-react';

export default function NotificationAdminBanner() {
  return (
    <div className="flex items-center gap-2 mb-6 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg w-fit">
      <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0" />
      <span className="text-xs text-amber-700 font-medium">
        Solo usuarios con rol de Administrador pueden guardar cambios en este módulo
      </span>
    </div>
  );
}
