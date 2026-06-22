export interface AppointmentRecord {
  id: string;
  patient: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  status: string;
}

export interface AppointmentReportFilters {
  dateFrom: string;
  dateTo: string;
  doctor: string;
  specialty: string;
  status: string;
}
