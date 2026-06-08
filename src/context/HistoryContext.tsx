import { createContext, useContext, useRef, useState, type ReactNode } from 'react';
import type { HistoryEntry } from '../api/mockData';

type HistoryContextType = {
  linkedEntries: HistoryEntry[];
  linkAppointmentEntry: (entry: HistoryEntry) => void;
};

const HistoryContext = createContext<HistoryContextType | null>(null);

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [linkedEntries, setLinkedEntries] = useState<HistoryEntry[]>([]);
  const nextId = useRef(Date.now());

  const linkAppointmentEntry = (entry: HistoryEntry) => {
    const id = nextId.current++;
    setLinkedEntries((prev) => [{ ...entry, id }, ...prev]);
  };

  return (
    <HistoryContext.Provider value={{ linkedEntries, linkAppointmentEntry }}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  const ctx = useContext(HistoryContext);
  if (!ctx) throw new Error('useHistory must be used within HistoryProvider');
  return ctx;
}
