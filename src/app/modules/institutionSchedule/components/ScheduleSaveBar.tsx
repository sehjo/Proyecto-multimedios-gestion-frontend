import { Save, AlertTriangle } from 'lucide-react';

interface ScheduleSaveBarProps {
  isValid: boolean;
  saving: boolean;
  onSave: () => void;
}

// Bottom action bar: save button plus a hint when there are validation errors.
export default function ScheduleSaveBar({ isValid, saving, onSave }: ScheduleSaveBarProps) {
  return (
    <div className="flex items-center justify-between gap-4 bg-white border border-gray-200 rounded-xl shadow-sm px-5 py-4">
      {isValid ? (
        <p className="text-sm text-gray-500">
          Revise los días habilitados y sus jornadas antes de guardar.
        </p>
      ) : (
        <p className="flex items-center gap-1.5 text-sm text-red-600">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          Hay intervalos con errores. Corríjalos para poder guardar.
        </p>
      )}
      <button
        type="button"
        onClick={onSave}
        disabled={!isValid || saving}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Save className="w-4 h-4" />
        {saving ? 'Guardando...' : 'Guardar horario'}
      </button>
    </div>
  );
}
