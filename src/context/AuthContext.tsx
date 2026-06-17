import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { toast } from 'sonner';
import { loginUser, logoutUser } from '../api/services';

interface User {
  id: number;
  name: string;
  email: string;
  user_type?: string;
  roles?: string[];
  permissions?: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  can: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Restore session from sessionStorage on mount
    const savedToken = sessionStorage.getItem('auth_token');
    const savedUser = sessionStorage.getItem('auth_user');
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        sessionStorage.removeItem('auth_token');
        sessionStorage.removeItem('auth_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const data = await loginUser({ email, password });
      const receivedToken = data.token || data.access_token;
      const receivedUser = data.user;

      if (!receivedToken) {
        toast.error('Respuesta inesperada del servidor.');
        return false;
      }

      sessionStorage.setItem('auth_token', receivedToken);
      sessionStorage.setItem('auth_user', JSON.stringify(receivedUser));
      setToken(receivedToken);
      setUser(receivedUser);
      toast.success(`Bienvenido, ${receivedUser?.name || 'Usuario'}!`);
      return true;
    } catch (error: any) {
      // 403 INACTIVE_ACCOUNT → backend message; 422 → field errors; else generic.
      const res = error?.response?.data;
      const message =
        res?.message ||
        res?.errors?.email?.[0] ||
        'Credenciales inválidas. Intente de nuevo.';
      toast.error(message);
      return false;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch {
      // Ignore errors on logout (token may already be invalid)
    } finally {
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_user');
      setToken(null);
      setUser(null);
      toast.success('Sesión cerrada correctamente.');
    }
  };

  // UX gate only — never a security boundary. The backend enforces permissions
  // on every endpoint, so this just hides controls the user can't use.
  const can = useCallback(
    (permission: string): boolean => user?.permissions?.includes(permission) ?? false,
    [user]
  );

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!token,
      isLoading,
      login,
      logout,
      can,
    }),
    [user, token, isLoading, can]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
