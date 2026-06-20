import { Search, Loader2 } from 'lucide-react';
import type { AssignableUser } from '../types/roles.types';

interface AssignRolesUserListProps {
  users: AssignableUser[];
  loading: boolean;
  search: string;
  selectedUserId?: number;
  onSearchChange: (value: string) => void;
  onSelect: (user: AssignableUser) => void;
}

const currentRoleLabel = (u: AssignableUser): string =>
  u.roles?.length ? u.roles.join(', ') : '—';

// Left column of the assign-roles modal: searchable user list to pick from.
export default function AssignRolesUserList({
  users,
  loading,
  search,
  selectedUserId,
  onSearchChange,
  onSelect,
}: AssignRolesUserListProps) {
  return (
    <div className="md:w-3/5 border-b md:border-b-0 md:border-r border-gray-100 p-5 flex flex-col min-h-0">
      <h3 className="text-sm font-semibold text-gray-800 mb-3">Seleccionar Usuario</h3>
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Buscar usuario..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="overflow-y-auto flex-1 -mx-1 px-1">
        {loading ? (
          <div className="flex items-center justify-center gap-2 text-gray-400 py-8 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" /> Cargando...
          </div>
        ) : users.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-8">No hay usuarios.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 uppercase">
                <th className="text-left font-semibold px-2 py-1.5">ID</th>
                <th className="text-left font-semibold px-2 py-1.5">Nombre</th>
                <th className="text-right font-semibold px-2 py-1.5">Roles actuales</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  onClick={() => onSelect(u)}
                  className={`cursor-pointer transition-colors ${
                    selectedUserId === u.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <td className="px-2 py-2 text-gray-500 align-top">{u.id}</td>
                  <td className="px-2 py-2">
                    <div className="text-gray-900 font-medium">
                      {u.name}
                      {u.lastname ? ` ${u.lastname}` : ''}
                    </div>
                    <div className="text-xs text-gray-400">{u.email}</div>
                  </td>
                  <td className="px-2 py-2 text-right">
                    <span className="text-xs text-blue-600 font-medium">{currentRoleLabel(u)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
