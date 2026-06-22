interface TimeSlotGridProps {
  slots: string[];
  selected: string;
  onSelect: (slot: string) => void;
}

export default function TimeSlotGrid({ slots, selected, onSelect }: TimeSlotGridProps) {
  if (slots.length === 0) {
    return <p className="text-sm text-orange-500">No hay horarios disponibles para esta fecha.</p>;
  }
  return (
    <div className="grid grid-cols-4 gap-2">
      {slots.map((slot) => (
        <button
          key={slot}
          type="button"
          onClick={() => onSelect(slot)}
          className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
            selected === slot
              ? 'bg-blue-600 text-white border-blue-600'
              : 'border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-300'
          }`}
        >
          {slot}
        </button>
      ))}
    </div>
  );
}
