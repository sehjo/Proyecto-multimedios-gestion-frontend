import { Loader2 } from 'lucide-react';
import type { User } from '../types/users.types';

interface ConfirmStatusModalProps {
  user: User;
  confirming: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

// Confirmation modal for activating/deactivating a user (replaces window.confirm).
export default function ConfirmStatusModal({
  user,
  confirming,
  onCancel,
  onConfirm,
}: ConfirmStatusModalProps) {
  const isActive = user.status === 'ACTIVE';

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4 text-center">
        <p className="text-lg font-semibold text-gray-800 mb-2">
          {isActive ? '¿Desactivar usuario?' : '¿Activar usuario?'}
        </p>
        <p className="text-sm text-gray-500 mb-6">
          {isActive
            ? `${user.name} ${user.lastname} no podrá iniciar sesión.`
            : `${user.name} ${user.lastname} podrá iniciar sesión nuevamente.`}
        </p>
        <div className="app-modal-actions flex items-center justify-center gap-3">
          <button
            onClick={onCancel}
            disabled={confirming}
            className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={confirming}
            className={`px-6 py-2.5 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed ${
              isActive
                ? 'bg-red-600 hover:bg-red-700 disabled:bg-red-300'
                : 'bg-green-600 hover:bg-green-700 disabled:bg-green-300'
            }`}
          >
            {confirming && <Loader2 className="w-4 h-4 animate-spin" />}
            {isActive ? 'Desactivar' : 'Activar'}
          </button>
        </div>
      </div>
    </div>
  );
}
