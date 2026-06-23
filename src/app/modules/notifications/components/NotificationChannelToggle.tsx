import { CheckCircle2, XCircle } from 'lucide-react';
import { ReactNode } from 'react';

interface NotificationChannelToggleProps {
  label: string;
  description: string;
  icon: ReactNode;
  enabled: boolean;
  onToggle: () => void;
}

export default function NotificationChannelToggle({
  label,
  description,
  icon,
  enabled,
  onToggle,
}: NotificationChannelToggleProps) {
  return (
    <div
      className={`flex items-start justify-between gap-4 p-4 rounded-lg border transition-colors ${
        enabled ? 'border-blue-200 bg-blue-50/50' : 'border-gray-200 bg-gray-50'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
            enabled ? 'bg-blue-100' : 'bg-gray-200'
          }`}
        >
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{label}</p>
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
          <span
            className={`inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-xs font-medium ${
              enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {enabled ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
            {enabled ? 'Habilitado' : 'Deshabilitado'}
          </span>
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          enabled ? 'bg-blue-600' : 'bg-gray-300'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            enabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
