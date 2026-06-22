import { Activity, ChevronDown, ChevronUp, Clock, FileText, Pencil, Pill, Stethoscope, User } from 'lucide-react';
import { formatDate, formatDateTime } from '../utils';
import type { HistoryEntry } from '../types/medicalHistory.types';

interface HistoryEntryCardProps {
  entry: HistoryEntry;
  doctorName: string;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
}

export default function HistoryEntryCard({
  entry,
  doctorName,
  isExpanded,
  onToggle,
  onEdit,
}: HistoryEntryCardProps) {
  return (
    <div className="relative pl-12">
      <div className="absolute left-0 top-4 w-8 h-8 rounded-full bg-blue-100 border-2 border-blue-400 flex items-center justify-center z-10">
        <Stethoscope className="w-4 h-4 text-blue-600" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <button
          type="button"
          className="w-full text-left p-4 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          onClick={onToggle}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-xs font-medium text-gray-400">{formatDate(entry.consultation_date)}</span>
                {entry.updated_at && (
                  <span className="flex items-center gap-1 text-xs text-amber-600">
                    <Clock className="w-3 h-3" />
                    Modificado: {formatDateTime(entry.updated_at)}
                  </span>
                )}
                {entry.medications && entry.medications.length > 0 && (
                  <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                    <Pill className="w-3 h-3" />
                    {entry.medications.length} medicamento{entry.medications.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 truncate">{entry.diagnosis}</h3>
              <span className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                <User className="w-3.5 h-3.5" />
                {doctorName}
              </span>
            </div>
            <div className="flex-shrink-0 text-gray-400 mt-1">
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </button>

        {isExpanded && (
          <div className="border-t border-gray-100 bg-gray-50 p-4 space-y-3">
            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                Médico tratante
              </p>
              <p className="text-sm text-gray-900 font-medium">{doctorName}</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                Diagnóstico
              </p>
              <p className="text-sm text-gray-900">{entry.diagnosis}</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                Tratamiento indicado
              </p>
              <p className="text-sm text-gray-900">
                {entry.treatment || <span className="text-gray-400 italic">No especificado</span>}
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Observaciones</p>
              <p className="text-sm text-gray-900">
                {entry.observations || <span className="text-gray-400 italic">Sin observaciones</span>}
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Pill className="w-3.5 h-3.5" />
                Medicamentos indicados
              </p>
              {!entry.medications || entry.medications.length === 0 ? (
                <p className="text-sm text-gray-400 italic">Sin medicamentos indicados</p>
              ) : (
                <div className="space-y-2">
                  {entry.medications.map((med) => (
                    <div key={med.id} className="bg-green-50 rounded-lg border border-green-100 p-2.5 flex gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Pill className="w-3.5 h-3.5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{med.drug_name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Dosis: <span className="font-medium text-gray-700">{med.dose}</span>
                          {' · '}
                          Frecuencia: <span className="font-medium text-gray-700">{med.frequency}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end border-t border-gray-200 pt-3">
              <button
                type="button"
                onClick={onEdit}
                className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Pencil className="w-4 h-4" />
                Editar registro
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
