import { Filter, ChevronDown } from 'lucide-react';
import { MONTH_NAMES } from '../holidays.constants';

interface HolidayFilterBarProps {
  year: number;
  months: number[];
  availableYears: number[];
  availableMonths: number[];
  onSelectYear: (year: number) => void;
  onToggleMonth: (month: number) => void;
}

// Filter bar for the registered holidays list: a single-select year dropdown
// and month toggle pills (only months that have holidays in the selected year).
export default function HolidayFilterBar({
  year,
  months,
  availableYears,
  availableMonths,
  onSelectYear,
  onToggleMonth,
}: HolidayFilterBarProps) {
  // Nothing to filter when there are no holidays at all.
  if (availableYears.length === 0) return null;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-3">
      <div className="flex items-center gap-1.5 text-sm font-medium text-gray-600">
        <Filter className="w-4 h-4" />
        Filtrar
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Año</span>
        <div className="relative">
          <select
            value={year}
            onChange={(e) => onSelectYear(Number(e.target.value))}
            className="appearance-none pl-3 pr-8 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {availableYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-2 w-4 h-4 text-gray-400" />
        </div>
      </div>

      {availableMonths.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-500">Meses</span>
          {availableMonths.map((month) => {
            const isActive = months.includes(month);
            return (
              <button
                key={month}
                type="button"
                onClick={() => onToggleMonth(month)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                  isActive
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white border-gray-300 text-gray-600 hover:border-blue-400'
                }`}
              >
                {MONTH_NAMES[month - 1]}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
