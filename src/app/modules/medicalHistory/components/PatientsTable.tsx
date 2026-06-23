import { Eye } from 'lucide-react';
import DataTable, { type CustomAction } from '../../../components/DataTable';
import type { Patient } from '../types/medicalHistory.types';

interface PatientsTableProps {
  patients: Patient[];
  onView: (patient: Patient) => void;
}

const columns = [
  { header: 'ID', accessor: 'id' },
  { header: 'Nombre', accessor: 'name' },
  { header: 'Apellido', accessor: 'lastname' },
  { header: 'Apodo', accessor: 'nick' },
];

export default function PatientsTable({ patients, onView }: PatientsTableProps) {
  const customActions: CustomAction[] = [
    {
      icon: <Eye className="w-4 h-4" />,
      label: 'Ver historial',
      onClick: (row) => onView(row),
      className: 'text-emerald-600 hover:bg-emerald-50',
    },
  ];

  return <DataTable columns={columns} data={patients} customActions={customActions} />;
}
