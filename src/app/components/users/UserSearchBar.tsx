import { Search } from 'lucide-react';

interface UserSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function UserSearchBar({ value, onChange }: UserSearchBarProps) {
  return (
    <div className="app-page-search relative max-w-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        placeholder="Buscar usuarios..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
