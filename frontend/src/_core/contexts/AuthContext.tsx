import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { trpc } from '../trpcClient';

export type Role = 'user' | 'admin' | 'seller';

export type AuthUser = {
  id: number;
  role: Role;
  name?: string;
  email?: string;
  createdAt?: string | number | Date;
} | null;

export type AuthContextValue = {
  user: AuthUser;
  loading: boolean;
  setUser: (u: AuthUser) => void;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refresh = async () => {
    try {
      const me = await (trpc as any).auth.me.query();
      setUser(me ?? null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = async () => {
    try {
      await (trpc as any).auth.logout.mutate();
    } finally {
      setUser(null);
    }
  };

  const value = useMemo<AuthContextValue>(() => ({ user, loading, setUser, logout, refresh }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}
