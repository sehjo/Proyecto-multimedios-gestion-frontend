import { CheckCircle, RefreshCw, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import DataTable, { CustomAction } from '../../../components/DataTable';
import AppointmentStatusBadge from './AppointmentStatusBadge';
import { formatDate, getAttendBlock, getCancelBlock, getRescheduleBlock } from '../constants';
import type { AppointmentStatus, EnrichedAppointment } from '../types/appointments.types';

interface AppointmentsTableProps {
  appointments: EnrichedAppointment[];
  onAttend: (appt: EnrichedAppointment) => void;
  onReschedule: (appt: EnrichedAppointment) => void;
  onCancel: (appt: EnrichedAppointment) => void;
}

export default function AppointmentsTable({
  appointments,
  onAttend,
  onReschedule,
  onCancel,
}: AppointmentsTableProps) {
  const columns = [
    { header: 'Paciente', accessor: 'patient_name' },
    { header: 'Doctor', accessor: 'doctor_name' },
    { header: 'Especialidad', accessor: 'specialty' },
    {
      header: 'Fecha',
      accessor: 'appointment_date',
      render: (v: string) => formatDate(v),
    },
    { header: 'Hora', accessor: 'appointment_time' },
    {
      header: 'Estado',
      accessor: 'status',
      render: (v: AppointmentStatus) => <AppointmentStatusBadge status={v} />,
    },
  ];

  const customActions: CustomAction[] = [
    {
      icon: <CheckCircle className="w-4 h-4" />,
      label: 'Marcar como atendida',
      onClick: (row: EnrichedAppointment) => {
        const block = getAttendBlock(row.status);
        if (block) {
          toast[block.kind](block.message);
          return;
        }
        onAttend(row);
      },
      className: 'text-green-600 hover:bg-green-50',
    },
    {
      icon: <RefreshCw className="w-4 h-4" />,
      label: 'Reprogramar cita',
      onClick: (row: EnrichedAppointment) => {
        const block = getRescheduleBlock(row.status);
        if (block) {
          toast[block.kind](block.message);
          return;
        }
        onReschedule(row);
      },
      className: 'text-indigo-500 hover:bg-indigo-50',
    },
    {
      icon: <XCircle className="w-4 h-4" />,
      label: 'Cancelar cita',
      onClick: (row: EnrichedAppointment) => {
        const block = getCancelBlock(row.status);
        if (block) {
          toast[block.kind](block.message);
          return;
        }
        onCancel(row);
      },
      className: 'text-red-500 hover:bg-red-50',
    },
  ];

  return <DataTable columns={columns} data={appointments} customActions={customActions} />;
}
