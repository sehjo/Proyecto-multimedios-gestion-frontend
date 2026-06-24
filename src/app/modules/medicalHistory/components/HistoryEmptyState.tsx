import { Plus, Search, Stethoscope } from 'lucide-react';

interface HistoryEmptyStateProps {
  variant: 'no-entries' | 'no-results';
  onCreate?: () => void;
}

export default function HistoryEmptyState({ variant, onCreate }: HistoryEmptyStateProps) {
  if (variant === 'no-results') {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <Search className="w-14 h-14 text-gray-200 mx-auto mb-4" />
        <p className="text-gray-500 font-medium">No se encontraron registros con los criterios seleccionados</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
      <Stethoscope className="w-14 h-14 text-gray-200 mx-auto mb-4" />
      <p className="text-gray-500 font-medium">Este paciente no tiene registros en su historial médico</p>
      {onCreate && (
        <button
          type="button"
          onClick={onCreate}
          className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
        >
          <Plus className="w-4 h-4" />
          Agregar primer registro
        </button>
      )}
    </div>
  );
}
