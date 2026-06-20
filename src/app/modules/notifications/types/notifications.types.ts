export interface NotificationLog {
  id: number;
  admin: string;
  action: string;
  date: string;
}

export interface NotificationQueueItem {
  id: number;
  patient: string;
  type: string;
  scheduled: string;
  config: string;
}
