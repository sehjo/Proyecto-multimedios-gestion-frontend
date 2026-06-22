import { Calendar, Search, User } from 'lucide-react';

interface PatientHistoryFiltersProps {
  dateFrom: string;
  onDateFromChange: (value: string) => void;
  dateTo: string;
  onDateToChange: (value: string) => void;
  doctorSearch: string;
  onDoctorSearchChange: (value: string) => void;
  diagnosisSearch: string;
  onDiagnosisSearchChange: (value: string) => void;
}

export default function PatientHistoryFilters({
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  doctorSearch,
  onDoctorSearchChange,
  diagnosisSearch,
  onDiagnosisSearchChange,
}: PatientHistoryFiltersProps) {
  const fields = [
    {
      label: 'Fecha desde',
      type: 'date',
      value: dateFrom,
      onChange: onDateFromChange,
      icon: <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />,
      placeholder: '',
    },
    {
      label: 'Fecha hasta',
      type: 'date',
      value: dateTo,
      onChange: onDateToChange,
      icon: <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />,
      placeholder: '',
    },
    {
      label: 'Médico tratante',
      type: 'text',
      value: doctorSearch,
      onChange: onDoctorSearchChange,
      icon: <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />,
      placeholder: 'Buscar por médico...',
    },
    {
      label: 'Diagnóstico',
      type: 'text',
      value: diagnosisSearch,
      onChange: onDiagnosisSearchChange,
      icon: <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />,
      placeholder: 'Buscar diagnóstico...',
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {fields.map(({ label, type, value, onChange, icon, placeholder }) => (
          <div key={label}>
            <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
            <div className="relative">
              {icon}
              <input
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
