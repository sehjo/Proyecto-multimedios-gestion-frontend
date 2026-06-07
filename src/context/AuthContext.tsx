import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { loginUser, logoutUser } from '../api/services';

interface User {
  id: number;
  name: string;
  email: string;
  user_type?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Dev bypass: skip login when VITE_DEV_BYPASS_AUTH=true
    if (import.meta.env.VITE_DEV_BYPASS_AUTH === 'true') {
      setToken('dev-token');
      setUser({ id: 0, name: 'Admin Dev', email: 'dev@local.test', user_type: 'Administrador' });
      setIsLoading(false);
      return;
    }

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
    } catch {
      toast.error('Credenciales inválidas. Intente de nuevo.');
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

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
