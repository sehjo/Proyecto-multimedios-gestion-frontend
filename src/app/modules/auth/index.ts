// Public API of the auth module. Other modules import from '@/app/modules/auth',
// never from internal paths.
export { AuthProvider, useAuth } from './context/AuthContext';
export type { User, AuthContextType } from './types/auth.types';
