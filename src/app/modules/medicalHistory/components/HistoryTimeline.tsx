import { useState } from 'react';
import HistoryEntryCard from './HistoryEntryCard';
import type { HistoryEntry } from '../types/medicalHistory.types';

interface HistoryTimelineProps {
  entries: HistoryEntry[];
  getDoctorName: (doctorId: number) => string;
  onEdit: (entry: HistoryEntry) => void;
}

// Owns the expand/collapse-all UI state for the timeline (strictly local UI
// state, allowed for components per the project's rules).
export default function HistoryTimeline({ entries, getDoctorName, onEdit }: HistoryTimelineProps) {
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  const toggleExpanded = (entryId: number) =>
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(entryId)) next.delete(entryId);
      else next.add(entryId);
      return next;
    });

  const allExpanded = entries.length > 0 && entries.every((e) => expandedIds.has(e.id));
  const toggleAll = () =>
    setExpandedIds(allExpanded ? new Set() : new Set(entries.map((e) => e.id)));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          {entries.length} registro{entries.length !== 1 ? 's' : ''}
        </p>
        {entries.length > 1 && (
          <button
            type="button"
            onClick={toggleAll}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {allExpanded ? 'Colapsar todos' : 'Expandir todos'}
          </button>
        )}
      </div>

      <div className="relative">
        {entries.length > 1 && <div className="absolute left-4 top-9 bottom-9 w-0.5 bg-gray-200" />}
        <div className="space-y-4">
          {entries.map((entry) => (
            <HistoryEntryCard
              key={entry.id}
              entry={entry}
              doctorName={getDoctorName(entry.doctor_id)}
              isExpanded={expandedIds.has(entry.id)}
              onToggle={() => toggleExpanded(entry.id)}
              onEdit={() => onEdit(entry)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
