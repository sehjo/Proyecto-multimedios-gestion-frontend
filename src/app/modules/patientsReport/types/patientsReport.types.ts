export interface ReportRow {
  doctor: string;
  specialty: string;
  uniquePatients: number;
  consultations: number;
  newPatients: number;
  recurringPatients: number;
}

export interface ReportTotals {
  uniquePatients: number;
  consultations: number;
  newPatients: number;
  recurringPatients: number;
}

export interface PatientsReportFilters {
  dateFrom: string;
  dateTo: string;
  doctor: string;
  specialty: string;
}
