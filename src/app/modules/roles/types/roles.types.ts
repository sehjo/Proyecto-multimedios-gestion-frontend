// A role as returned by the backend RoleResource. Permissions come as plain
// NAMES (<module>.<action>), matching GET /roles/permissions.
export interface Role {
  id: number;
  name: string;
  permissions: string[];
}

// Shape of the create/edit role form.
export interface RoleFormData {
  name: string;
  permissions: Set<string>;
}

// Per-field validation messages for the role form.
export interface RoleFormErrors {
  name?: string;
  permissions?: string;
}

// Inline banner shown above the search bar. 'success' = green, 'info' = blue.
export interface Banner {
  type: 'success' | 'info';
  msg: string;
}

// A user row used by the assign-roles modal (UserResource returns role names).
export interface AssignableUser {
  id: number;
  name: string;
  lastname?: string;
  email: string;
  roles: string[];
}

// A role option (id + name) for the assign-roles multi-select.
export interface RoleOption {
  id: number;
  name: string;
}
