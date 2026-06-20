import { Shield, X } from 'lucide-react';
import PermissionGrid from '@/app/components/PermissionGrid';
import { PermissionRow } from '@/app/lib/permissions';

interface PermissionCatalogModalProps {
  grid: PermissionRow[];
  permissions: string[];
  onClose: () => void;
}

// Read-only catalog of every permission in the system ("mirar permisos").
export default function PermissionCatalogModal({
  grid,
  permissions,
  onClose,
}: PermissionCatalogModalProps) {
  return (
    <div className="app-modal-overlay fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
        <div className="flex items-center gap-3 px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Catálogo de permisos</h2>
            <p className="text-xs text-gray-400">Permisos disponibles en el sistema.</p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-5 overflow-y-auto">
          <PermissionGrid rows={grid} selected={new Set(permissions)} disabled />
        </div>
        <div className="flex items-center justify-center px-6 pb-6 pt-1">
          <button
            onClick={onClose}
            className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
