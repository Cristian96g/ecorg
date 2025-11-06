// src/api/api.js
import axios from "axios";

/* =========================
   Config & token helpers
========================= */
const BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/+$/, "") || "http://localhost:4000";

const TOKEN_KEY = "ecorg_token";

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

/* =========================
   Axios instance + interceptors
========================= */
export const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 15000,
});

// Adjunta Authorization si hay token
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Manejo simple de 401 (token vencido / inválido)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      clearToken();
      // opcional: redirigir a /login si estás usando router
      // window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

/* =========================
   AUTH
========================= */
export const AuthAPI = {
  login: async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    // se espera { token, user }
    if (data?.token) setToken(data.token);
    return data;
  },
  register: async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    return data;
  },
  me: async () => {
    const { data } = await api.get("/users/me");
    return data;
  },
  logout: () => clearToken(),
};

/* =========================
   USERS
========================= */
// updateMe admite multipart para subir avatar
export const UsersAPI = {
  /* --------- Self (perfil del usuario logueado) --------- */
  getMe: async () => {
    const { data } = await api.get("/users/me");
    return data;
  },

  updateMe: async (profile, file) => {
    // Si hay file => multipart; si no, JSON
    if (file) {
      const fd = new FormData();
      Object.entries(profile || {}).forEach(([k, v]) => {
        if (v !== undefined && v !== null) fd.append(k, v);
      });
      fd.append("avatar", file);
      const { data } = await api.put("/users/me", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    } else {
      const { data } = await api.put("/users/me", profile);
      return data;
    }
  },

  /* --------- Admin helpers --------- */
  // Cambiar rol (lo dejé como lo tenías por compatibilidad)
  setRole: async (userId, role) => {
    const { data } = await api.put(`/users/${userId}/role`, { userId, role });
    return data;
  },

  /* --------- CRUD Admin --------- */
  // Lista de usuarios (acepta filtros/paginación si tu backend los soporta)
  // Ej: UsersAPI.list({ q: 'juan', role: 'admin', page: 1, limit: 20 })
  list: async (params = {}) => {
    const { data } = await api.get("/users", { params });
    // soporta {items: []} o [] directo
    return data?.items ?? data;
  },

  // Obtener un usuario por id
  getById: async (id) => {
    const { data } = await api.get(`/users/${id}`);
    return data;
  },

  // Crear usuario (nombre, email, role, password, etc.)
  create: async (payload) => {
    const { data } = await api.post("/users", payload);
    return data;
  },

  // Actualizar usuario (nombre, email, role, password opcional para reset)
  update: async (id, payload) => {
    const { data } = await api.put(`/users/${id}`, payload);
    return data;
  },

  // Eliminar usuario
  remove: async (id) => {
    const { data } = await api.delete(`/users/${id}`);
    return data;
  },
};
/* =========================
   REPORTS (mini basurales / incidencias)
========================= */
export const ReportsAPI = {
  list: async (params = {}) => (await api.get("/reports", { params })).data,
  get: async (id) => (await api.get(`/reports/${id}`)).data,
  create: async (payload) => (await api.post("/reports", payload)).data,
  update: async (id, payload) => (await api.put(`/reports/${id}`, payload)).data,
  remove: async (id) => (await api.delete(`/reports/${id}`)).data,
  setStatus: async (id, status) => (await api.put(`/reports/${id}/moderation`, { status })).data,
  setEstado: async (id, estado) => (await api.put(`/reports/${id}/estado`, { estado })).data,
};

/* =========================
   POINTS (puntos de reciclaje)
========================= */
export const PointsAPI = {
  list: async (params = {}) => {
    const { data } = await api.get("/points", { params });
    return data;
  },
  getById: async (id) => {
    const { data } = await api.get(`/points/${id}`);
    return data;
  },
  create: async (payload) => {
    const { data } = await api.post("/points", payload);
    return data;
  },
  update: async (id, patch) => {
    const { data } = await api.put(`/points/${id}`, patch);
    return data;
  },
  remove: async (id) => {
    const { data } = await api.delete(`/points/${id}`);
    return data;
  },
};

/* =========================
   RECYCLING SCHEDULE
========================= */
export const ScheduleAPI = {
  listAll: async () => {
    const { data } = await api.get("/recycling-schedule");
    return data;
  },
  byBarrio: async (barrio) => {
    const { data } = await api.get("/recycling-schedule", { params: { barrio } });
    return data;
  },
};
