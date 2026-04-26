import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "") ||
  import.meta.env.VITE_API_URL?.replace(/\/+$/, "") ||
  "http://localhost:4000";

const TOKEN_KEY = "ecorg_token";

let unauthorizedHandler = null;

export function registerUnauthorizedHandler(handler) {
  unauthorizedHandler = typeof handler === "function" ? handler : null;
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getAssetUrl(assetPath) {
  if (!assetPath) return "";
  if (/^https?:\/\//i.test(assetPath)) return assetPath;
  return `${BASE_URL}${assetPath.startsWith("/") ? assetPath : `/${assetPath}`}`;
}

function emitNotificationsUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("ecorg:notifications-updated"));
  }
}

export function getFriendlyApiError(err, fallback = "Ocurrió un error inesperado.") {
  if (!err?.response) {
    return "No pudimos conectar con el servidor. Verificá que el backend esté corriendo en localhost:4000.";
  }

  const data = err.response.data;
  return data?.message || data?.error || fallback;
}

export const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (import.meta.env.DEV) {
      if (err?.response) {
        console.error("API_ERROR_RESPONSE", {
          url: err.config?.url,
          method: err.config?.method,
          status: err.response.status,
          data: err.response.data,
        });
      } else {
        console.error("API_ERROR_NETWORK", {
          url: err.config?.url,
          method: err.config?.method,
          message: err.message,
        });
      }
    }

    if (err?.response?.status === 401) {
      clearToken();
      unauthorizedHandler?.();
    }

    return Promise.reject(err);
  }
);

export const AuthAPI = {
  login: async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    if (data?.token) setToken(data.token);
    return data;
  },
  register: async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    if (data?.token) setToken(data.token);
    return data;
  },
  me: async () => {
    const { data } = await api.get("/users/me");
    return data;
  },
  logout: () => clearToken(),
};

export const UsersAPI = {
  getMe: async () => {
    const { data } = await api.get("/users/me");
    return data;
  },

  updateMe: async (profile, file) => {
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
    }

    const { data } = await api.put("/users/me", profile);
    return data;
  },

  setRole: async (userId, role) => {
    const { data } = await api.put(`/users/${userId}/role`, { userId, role });
    return data;
  },

  list: async (params = {}) => {
    const { data } = await api.get("/users", { params });
    return data?.items ?? data;
  },

  getById: async (id) => {
    const { data } = await api.get(`/users/${id}`);
    return data;
  },

  create: async (payload) => {
    const { data } = await api.post("/users", payload);
    return data;
  },

  update: async (id, payload) => {
    const { data } = await api.put(`/users/${id}`, payload);
    return data;
  },

  remove: async (id) => {
    const { data } = await api.delete(`/users/${id}`);
    return data;
  },
};

export const ReportsAPI = {
  list: async (params = {}) => (await api.get("/reports", { params })).data,
  get: async (id) => (await api.get(`/reports/${id}`)).data,
  create: async (payload) => {
    const body = buildReportPayload(payload);
    const config = body instanceof FormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : undefined;
    return (await api.post("/reports", body, config)).data;
  },
  update: async (id, payload) => {
    const body = buildReportPayload(payload);
    const config = body instanceof FormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : undefined;
    return (await api.put(`/reports/${id}`, body, config)).data;
  },
  remove: async (id) => (await api.delete(`/reports/${id}`)).data,
  setStatus: async (id, status) => (await api.put(`/reports/${id}/moderation`, { status })).data,
  setEstado: async (id, estado) => (await api.put(`/reports/${id}/estado`, { estado })).data,
};

function buildReportPayload(payload = {}) {
  const photos = payload?.fotos;
  const hasFiles =
    photos instanceof FileList
      ? photos.length > 0
      : Array.isArray(photos)
        ? photos.length > 0
        : photos instanceof File;

  if (!hasFiles) {
    return payload;
  }

  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (key === "fotos" || value === undefined || value === null || value === "") return;
    formData.append(key, value);
  });

  if (photos instanceof FileList) {
    Array.from(photos).forEach((file) => formData.append("fotos", file));
  } else if (Array.isArray(photos)) {
    photos.forEach((file) => file && formData.append("fotos", file));
  } else if (photos instanceof File) {
    formData.append("fotos", photos);
  }

  return formData;
}

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

export const BarriosAPI = {
  list: async (params = {}) => {
    const { data } = await api.get("/barrios", { params });
    return data?.items ?? data;
  },
  create: async (payload) => {
    const { data } = await api.post("/barrios", payload);
    return data;
  },
  update: async (id, payload) => {
    const { data } = await api.put(`/barrios/${id}`, payload);
    return data;
  },
  remove: async (id) => {
    const { data } = await api.delete(`/barrios/${id}`);
    return data;
  },
};

export const EcoActionsAPI = {
  listMine: async () => {
    const { data } = await api.get("/eco-actions/me");
    return data;
  },
  listAll: async (params = {}) => {
    const { data } = await api.get("/eco-actions", { params });
    return data;
  },
  create: async (payload) => {
    const { data } = await api.post("/eco-actions", payload);
    return data;
  },
  approve: async (id) => {
    const { data } = await api.put(`/eco-actions/${id}/approve`);
    return data;
  },
  reject: async (id) => {
    const { data } = await api.put(`/eco-actions/${id}/reject`);
    return data;
  },
};

export const NotificationsAPI = {
  listMine: async (params = {}) => {
    const { data } = await api.get("/notifications/me", { params });
    return data;
  },
  markRead: async (id) => {
    const { data } = await api.put(`/notifications/${id}/read`);
    emitNotificationsUpdated();
    return data;
  },
  markAllRead: async () => {
    const { data } = await api.put("/notifications/read-all");
    emitNotificationsUpdated();
    return data;
  },
  remove: async (id) => {
    const { data } = await api.delete(`/notifications/${id}`);
    emitNotificationsUpdated();
    return data;
  },
};
