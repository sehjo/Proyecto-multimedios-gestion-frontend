// Persistence for appointments left in "Pendiente de Reprogramación" after a
// holiday displaced them (HU-039, scenario 3). Stored in localStorage so the
// queue survives navigation and reloads. No backend endpoint exists yet.
import type { AffectedAppointment, PendingReschedule } from '../types/holidays.types';

const RESCHEDULE_QUEUE_KEY = 'reschedule_queue';

// Read the queue, returning [] on missing or corrupt data.
export function getRescheduleQueue(): PendingReschedule[] {
  try {
    const raw = localStorage.getItem(RESCHEDULE_QUEUE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PendingReschedule[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveQueue(queue: PendingReschedule[]): PendingReschedule[] {
  localStorage.setItem(RESCHEDULE_QUEUE_KEY, JSON.stringify(queue));
  return queue;
}

// Add the appointments displaced by a holiday to the queue, skipping any that
// are already present. Returns the full updated queue.
export function enqueueReschedules(
  appointments: AffectedAppointment[],
  holidayTitle: string
): PendingReschedule[] {
  const current = getRescheduleQueue();
  const existing = new Set(current.map((a) => a.id));
  const additions: PendingReschedule[] = appointments
    .filter((a) => !existing.has(a.id))
    .map((a) => ({
      ...a,
      originalDate: a.date,
      originalTime: a.time,
      holidayTitle,
    }));
  return saveQueue([...current, ...additions]);
}

// Remove an appointment from the queue once it has been rescheduled (or skipped).
export function removeFromQueue(id: number): PendingReschedule[] {
  return saveQueue(getRescheduleQueue().filter((a) => a.id !== id));
}

// Apply a new date/time to a queued appointment and drop it from the queue
// (rescheduling resolves the pending state). Returns the updated queue.
export function applyReschedule(id: number, _date: string, _time: string): PendingReschedule[] {
  // The new slot isn't persisted anywhere yet (the real appointments module owns
  // appointment storage); resolving the pending item is what matters here.
  return removeFromQueue(id);
}
