import { Info } from 'lucide-react';

// Explains scenario 3 up front: editing the master schedule does not trigger any
// mass cancellation; existing confirmed appointments stay valid.
export default function SchedulePersistenceNotice() {
  return (
    <div className="mb-6 flex items-start gap-2.5 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
      <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
      <p className="text-sm text-blue-800">
        Al actualizar el horario maestro no se cancelan citas. Las citas confirmadas se mantienen
        en el calendario; los cambios aplican únicamente a las nuevas citas.
      </p>
    </div>
  );
}
