// Compatibility shim: AuthContext now lives in the auth module. Existing modules
// still import from '../context/AuthContext'; keep this re-export until they are
// migrated to import from '@/app/modules/auth'.
export { AuthProvider, useAuth } from '../app/modules/auth/context/AuthContext';
export type { User, AuthContextType } from '../app/modules/auth/types/auth.types';
