// System base roles: cannot be renamed or deleted (their permissions can still be
// adjusted). Mirrors RoleController::PROTECTED_ROLES on the backend.
export const PROTECTED_ROLES = ['Administrador', 'Medico', 'Enfermero', 'Paciente'];

// Backend caps the role name at max:50 (Store/UpdateRoleRequest).
export const NAME_MAX = 50;

// Allowed role-name characters: letters, numbers, spaces and hyphens.
export const NAME_REGEX = /^[\p{L}\p{N}\s-]+$/u;

export const isProtectedRole = (name: string): boolean => PROTECTED_ROLES.includes(name);
