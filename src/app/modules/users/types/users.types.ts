// A user row as returned by the backend UserResource (roles come as name strings).
export interface User {
  id: number;
  name: string;
  lastname: string;
  email: string;
  roles?: string[];
  status: 'ACTIVE' | 'INACTIVE';
}

// Shape of the create/edit form. `user_type_id` is only used on create (the role
// is chosen as its id; the backend POST /users expects user_type_id, not a name).
export interface UserFormData {
  name: string;
  lastname: string;
  email: string;
  password: string;
  user_type_id: string;
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
