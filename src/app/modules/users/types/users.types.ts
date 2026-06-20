// A user row as returned by the backend UserResource (roles come as name strings).
export interface User {
  id: number;
  name: string;
  lastname: string;
  email: string;
  roles?: string[];
  status: 'ACTIVE' | 'INACTIVE';
}

// Shape of the create/edit form. `role` is only used on create.
export interface UserFormData {
  name: string;
  lastname: string;
  email: string;
  password: string;
  role: string;
}

// A role option for the create-form selector (GET /roles → RoleResource[]).
export interface Role {
  id: number;
  name: string;
}

// Inline banner shown above the search bar. 'success' = green, 'info' = blue.
export interface Banner {
  type: 'success' | 'info';
  msg: string;
}
