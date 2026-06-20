import { Copy, UserCheck, UserX } from 'lucide-react';
import { toast } from 'sonner';
import DataTable, { CustomAction } from '../../../components/DataTable';
import type { UserRow } from '../types/users.types';

interface UsersTableProps {
  users: UserRow[];
  canUpdate: boolean;
  onView: (user: UserRow) => void;
  onEdit: (user: UserRow) => void;
  onChangeStatus: (user: UserRow) => void;
}

// All role names, uppercase and comma-separated (or "—" if none).
const roleLabel = (roles?: string[]): string =>
  Array.isArray(roles) && roles.length
    ? roles.map((r) => String(r).toUpperCase()).join(', ')
    : '—';

export default function UsersTable({
  users,
  canUpdate,
  onView,
  onEdit,
  onChangeStatus,
}: UsersTableProps) {
  const columns = [
    { header: 'ID', accessor: 'id' },
    {
      header: 'Nombre',
      accessor: 'name',
      // Clicking the name opens the read-only details modal, not the editor.
      render: (value: any, row: any) => (
        <button
          type="button"
          onClick={() => onView(row)}
          className="text-left font-medium text-blue-600 hover:underline focus:outline-none cursor-pointer"
        >
          {value}
        </button>
      ),
    },
    { header: 'Apellido', accessor: 'lastname' },
    { header: 'Email', accessor: 'email' },
    {
      header: 'Roles',
      accessor: 'roles',
      render: (value: any) => (
        <span className="text-sm text-gray-700 font-medium break-all">{roleLabel(value)}</span>
      ),
    },
    {
      header: 'Estado',
      accessor: 'status',
      render: (value: any) =>
        value === 'ACTIVE' ? (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Activo</span>
        ) : (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-500">Inactivo</span>
        ),
    },
  ];

  const customActions: CustomAction[] = [
    {
      icon: <Copy className="w-4 h-4" />,
      label: 'Copiar correo',
      onClick: (row) => {
        navigator.clipboard.writeText(row.email);
        toast.success('Correo copiado exitosamente');
      },
      className: 'text-gray-400 hover:text-gray-600 hover:bg-gray-100',
    },
    // Activate/deactivate only if the user can update (users.update).
    ...(canUpdate
      ? [
          {
            icon: (row: any) =>
              row.status === 'ACTIVE' ? (
                <UserX className="w-4 h-4 text-red-600" />
              ) : (
                <UserCheck className="w-4 h-4 text-green-600" />
              ),
            label: 'Cambiar estado',
            onClick: (row: any) => onChangeStatus(row),
            className: 'hover:bg-gray-100',
          },
        ]
      : []),
  ];

  return (
    <DataTable
      columns={columns}
      data={users}
      onEdit={canUpdate ? (row) => onEdit(row) : undefined}
      customActions={customActions}
    />
  );
}
