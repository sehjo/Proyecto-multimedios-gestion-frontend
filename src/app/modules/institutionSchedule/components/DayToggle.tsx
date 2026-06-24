interface DayToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label?: string;
}

// iOS-style on/off switch for a day's enabled state (green = open, gray = closed).
export default function DayToggle({ enabled, onChange, label }: DayToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={label}
      onClick={() => onChange(!enabled)}
      className="flex items-center gap-2"
    >
      <span
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
          enabled ? 'bg-green-500' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
            enabled ? 'translate-x-4' : 'translate-x-0.5'
          }`}
        />
      </span>
      <span className={`text-sm font-medium ${enabled ? 'text-green-700' : 'text-gray-500'}`}>
        {enabled ? 'Abierto' : 'Cerrado'}
      </span>
    </button>
  );
}
