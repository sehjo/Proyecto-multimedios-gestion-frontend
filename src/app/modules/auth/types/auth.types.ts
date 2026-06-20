export interface User {
  id: number;
  name: string;
  email: string;
  user_type?: string;
  roles?: string[];
  permissions?: string[];
}

export interface LoginPayload {
  email: string;
  password: string;
}

// The backend (Laravel Sanctum) returns the Bearer token plus the user object.
// Both `token` and `access_token` are accepted for backwards compatibility.
export interface LoginResponse {
  token?: string;
  access_token?: string;
  user: User;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  can: (permission: string) => boolean;
}
