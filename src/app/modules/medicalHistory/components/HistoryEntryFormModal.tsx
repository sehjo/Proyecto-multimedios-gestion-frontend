import { X } from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';

interface HistoryEntryFormModalProps {
  title: string;
  submitLabel: string;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  children: ReactNode;
}

// Modal shell reused for both "Nuevo registro" and "Editar registro" — the
// fields (HistoryEntryForm) are passed in as children.
export default function HistoryEntryFormModal({
  title,
  submitLabel,
  onClose,
  onSubmit,
  children,
}: HistoryEntryFormModalProps) {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={onSubmit} noValidate className="p-6 space-y-5">
          {children}
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
