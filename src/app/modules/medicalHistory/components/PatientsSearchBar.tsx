import { Search } from 'lucide-react';

interface PatientsSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

// Search input that filters the patients list by name/lastname/nickname/id.
export default function PatientsSearchBar({ value, onChange }: PatientsSearchBarProps) {
  return (
    <div className="mb-6">
      <div className="app-page-search relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por nombre, apellido o apodo..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}
