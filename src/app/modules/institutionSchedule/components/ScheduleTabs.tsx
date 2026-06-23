// Tab keys for the institution schedule page.
export type ScheduleTabKey = 'weekly' | 'holidays' | 'availability';

interface ScheduleTab {
  key: ScheduleTabKey;
  label: string;
}

const TABS: ScheduleTab[] = [
  { key: 'weekly', label: 'Horario semanal' },
  { key: 'holidays', label: 'Feriados' },
  { key: 'availability', label: 'Disponibilidad' },
];

interface ScheduleTabsProps {
  active: ScheduleTabKey;
  onChange: (tab: ScheduleTabKey) => void;
}

// Tab switcher between the weekly availability and the holidays/closures areas.
export default function ScheduleTabs({ active, onChange }: ScheduleTabsProps) {
  return (
    <div className="mb-6 border-b border-gray-200">
      <nav className="flex gap-1" aria-label="Secciones del horario institucional">
        {TABS.map((tab) => {
          const isActive = active === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                isActive
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
