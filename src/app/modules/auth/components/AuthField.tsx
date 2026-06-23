import { ReactNode } from 'react';

export interface AuthFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  icon: ReactNode;
  autoComplete?: string;
  required?: boolean;
  minLength?: number;
  // Extra control rendered inside the input (e.g. a show/hide password toggle).
  trailing?: ReactNode;
}

// Controlled form field: label + icon-prefixed input + inline error message.
// Replaces the hand-written input blocks that used to be duplicated per field.
export default function AuthField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  icon,
  autoComplete,
  required,
  minLength,
  trailing,
}: AuthFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none">
          {icon}
        </span>
        <input
          id={id}
          type={type}
          autoComplete={autoComplete}
          required={required}
          minLength={minLength}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full pl-10 ${trailing ? 'pr-10' : 'pr-4'} py-2.5 rounded-lg border text-sm text-gray-900 placeholder-gray-400 bg-white outline-none transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            error ? 'border-red-400 focus:ring-red-300 focus:border-red-400' : 'border-gray-300'
          }`}
        />
        {trailing}
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}
