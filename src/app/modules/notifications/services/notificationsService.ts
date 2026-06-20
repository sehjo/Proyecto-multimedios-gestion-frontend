import type { NotificationLog, NotificationQueueItem } from '../types/notifications.types';

const MOCK_LOGS: NotificationLog[] = [
  { id: 1, admin: 'Ana García',     action: 'Habilitó notificaciones por correo',    date: '2026-06-07 08:14' },
  { id: 2, admin: 'Carlos Mora',    action: 'Cambió horario de envío a 07:00',       date: '2026-06-06 15:32' },
  { id: 3, admin: 'Ana García',     action: 'Deshabilitó notificaciones internas',   date: '2026-06-05 09:05' },
  { id: 4, admin: 'Luis Rodríguez', action: 'Habilitó notificaciones internas',      date: '2026-06-04 11:20' },
];

const MOCK_QUEUE: NotificationQueueItem[] = [
  { id: 101, patient: 'María López',    type: 'Correo',  scheduled: '2026-06-08 07:00', config: 'v2.1' },
  { id: 102, patient: 'José Vargas',    type: 'Sistema', scheduled: '2026-06-08 07:00', config: 'v2.1' },
  { id: 103, patient: 'Laura Jiménez', type: 'Correo',  scheduled: '2026-06-09 07:00', config: 'v2.1' },
];

export function getLogs(): NotificationLog[] {
  return MOCK_LOGS;
}

export function getQueue(): NotificationQueueItem[] {
  return MOCK_QUEUE;
}
