import { LogIn, LogOut, PlusCircle, Pencil, Trash2, FileDown } from 'lucide-react';
import { ACTION_STYLE } from '../constants';

const ACTION_ICON: Record<string, React.ReactNode> = {
  'Inicio de sesión': <LogIn className="w-3 h-3" />,
  'Cierre de sesión': <LogOut className="w-3 h-3" />,
  'Creación':         <PlusCircle className="w-3 h-3" />,
  'Edición':          <Pencil className="w-3 h-3" />,
  'Eliminación':      <Trash2 className="w-3 h-3" />,
  'Exportación':      <FileDown className="w-3 h-3" />,
};

interface ActivityActionBadgeProps {
  action: string;
  size?: 'sm' | 'default';
}

export default function ActivityActionBadge({ action, size = 'default' }: ActivityActionBadgeProps) {
  const style = ACTION_STYLE[action] ?? { bg: 'bg-gray-100', text: 'text-gray-600' };
  const icon = ACTION_ICON[action] ?? null;
  const padding = size === 'sm' ? 'px-2 py-0.5' : 'px-2.5 py-0.5';
  return (
    <span
      className={`inline-flex items-center gap-1.5 ${padding} rounded-full text-xs font-medium ${style.bg} ${style.text}`}
    >
      {icon}
      {action}
    </span>
  );
}
