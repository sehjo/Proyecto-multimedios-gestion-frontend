export interface DoctorOccupancyRow {
  doctor: string;
  specialty: string;
  specialtyValue: string;
  assigned: number;
  attended: number;
  cancelled: number;
  dailyAverage: number;
}

export interface DoctorOccupancyTotals {
  assigned: number;
  attended: number;
  cancelled: number;
}

export interface DoctorOccupancyFilters {
  dateFrom: string;
  dateTo: string;
  specialty: string;
}
