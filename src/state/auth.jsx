/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  AuthAPI,
  clearToken,
  getToken,
  registerUnauthorizedHandler,
} from "../api/api";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  const login = useCallback((userObj) => {
    setUser(userObj);
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
    setReady(true);
  }, []);

  useEffect(() => {
    registerUnauthorizedHandler(() => {
      clearToken();
      setUser(null);
      setReady(true);
    });

    return () => {
      registerUnauthorizedHandler(null);
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        if (getToken()) {
          const me = await AuthAPI.me();
          setUser(me);
        }
      } catch {
        clearToken();
        setUser(null);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  return (
    <AuthCtx.Provider value={{ user, ready, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  return useContext(AuthCtx);
}
