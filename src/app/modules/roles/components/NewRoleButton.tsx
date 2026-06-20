import { Plus } from 'lucide-react';

interface NewRoleButtonProps {
  onClick: () => void;
}

// "Nuevo Rol" action button shown in the page header.
export default function NewRoleButton({ onClick }: NewRoleButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm cursor-pointer whitespace-nowrap"
    >
      <Plus className="w-4 h-4 flex-shrink-0" />
      Nuevo Rol
    </button>
  );
}
