// src/state/auth.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { AuthAPI, getToken, clearToken } from "../api/api";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // Al cargar la app, si hay token => intento /users/me
  useEffect(() => {
    (async () => {
      try {
        if (getToken()) {
          const me = await AuthAPI.me(); // /users/me (usa el token por interceptor)
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

  const login = (userObj) => setUser(userObj);
  const logout = () => { clearToken(); setUser(null); };

  return (
    <AuthCtx.Provider value={{ user, ready, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  return useContext(AuthCtx);
}
