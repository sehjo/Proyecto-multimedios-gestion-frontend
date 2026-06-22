import { Plus } from 'lucide-react';

interface NewAppointmentButtonProps {
  onClick: () => void;
}

// "Nueva Cita" action button shown in the page header.
export default function NewAppointmentButton({ onClick }: NewAppointmentButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      <Plus className="w-5 h-5" />
      Nueva Cita
    </button>
  );
}
