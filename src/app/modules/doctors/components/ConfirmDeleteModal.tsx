import { Loader2 } from 'lucide-react';

interface ConfirmDeleteModalProps {
  message: string;
  confirming: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

// Generic delete confirmation modal (replaces window.confirm), shared by the
// doctor and the nested speciality deletion flows.
export default function ConfirmDeleteModal({
  message,
  confirming,
  onCancel,
  onConfirm,
}: ConfirmDeleteModalProps) {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4 text-center">
        <p className="text-lg font-semibold text-gray-800 mb-6">{message}</p>
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
            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            {confirming && <Loader2 className="w-4 h-4 animate-spin" />}
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
