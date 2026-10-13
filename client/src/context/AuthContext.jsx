import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while we check for an existing session

  // On every page load / refresh, ask the server who is logged in (the cookie decides).
  useEffect(() => {
    let active = true;
    api
      .me()
      .then((data) => active && setUser(data.user))
      .catch(() => active && setUser(null))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await api.login({ email, password });
    setUser(data.user);
  }, []);

  const register = useCallback(async (values) => {
    const data = await api.register(values);
    setUser(data.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } catch {
      /* even if the request fails, forget the user in the browser */
    }
    setUser(null);
  }, []);

  // Called when the server answers 401 (e.g. the session expired).
  const expireSession = useCallback(() => setUser(null), []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout, expireSession }),
    [user, loading, login, register, logout, expireSession]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
