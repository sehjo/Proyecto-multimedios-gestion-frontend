export interface ActivityEntry {
  id: number;
  user: string;
  role: string;
  action: string;
  module: string;
  date: string;
  time: string;
  details: string;
  result: 'Exitoso' | 'Fallido';
}

export interface ActivityFilters {
  user: string;
  action: string;
  module: string;
  date: string;
}
