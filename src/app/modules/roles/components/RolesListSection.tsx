import RolesTable from './RolesTable';
import type { Role } from '../types/roles.types';

interface RolesListSectionProps {
  roles: Role[];
  loading: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  isOwnRole: (role: Role) => boolean;
  onView: (role: Role) => void;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
}

// "Lista de roles" heading + the roles table, so the page composes one component.
export default function RolesListSection(props: RolesListSectionProps) {
  return (
    <div>
      <h2 className="text-base font-semibold text-gray-800 mb-3">Lista de roles</h2>
      <RolesTable {...props} />
    </div>
  );
}
