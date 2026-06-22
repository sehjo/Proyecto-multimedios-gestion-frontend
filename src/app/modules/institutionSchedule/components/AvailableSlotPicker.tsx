import { useMemo } from 'react';
import { CalendarX, Stethoscope, ChevronDown } from 'lucide-react';
import { getAvailableBands, isKnownDoctor } from '../services/doctorScheduleService';

interface AvailableSlotPickerProps {
  doctorName: string;
  date: string;
  selectedTime: string;
  onSelect: (time: string) => void;
}

// Shows the bookable times (institution ∩ doctor) for the chosen date as a
// compact dropdown, grouped by band. Empty/closed days are explained inline
// (HU-039).
export default function AvailableSlotPicker({
  doctorName,
  date,
  selectedTime,
  onSelect,
}: AvailableSlotPickerProps) {
  const bands = useMemo(() => getAvailableBands(doctorName, date), [doctorName, date]);

  if (!date) {
    return (
      <p className="text-sm text-gray-400 italic">
        Seleccione una fecha para ver los horarios disponibles.
      </p>
    );
  }

  if (bands.length === 0) {
    const known = isKnownDoctor(doctorName);
    return (
      <div className="flex items-start gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-600">
        <CalendarX className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
        <span>
          {known
            ? 'No hay horarios disponibles esta fecha (día cerrado, feriado o el doctor no atiende).'
            : 'No se encontró el horario de este doctor para esta fecha.'}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="flex items-center gap-1.5 text-xs text-gray-500">
        <Stethoscope className="w-3.5 h-3.5" />
        Horario disponible de {doctorName} para esta fecha
      </p>
      <div className="relative">
        <select
          value={selectedTime}
          onChange={(e) => onSelect(e.target.value)}
          className="w-full appearance-none px-3 py-2 pr-8 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Seleccione una hora...</option>
          {bands.map((band) => (
            <optgroup key={`${band.start}-${band.end}`} label={`${band.start} – ${band.end}`}>
              {band.slots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 w-4 h-4 text-gray-400" />
      </div>
    </div>
  );
}
