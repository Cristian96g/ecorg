import { useEffect, useMemo, useState } from "react";
import { FiBell, FiCheck, FiCheckCircle, FiTrash2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import {
  NotificationsAPI,
  getFriendlyApiError,
} from "../api/api";
import LoadingState from "../components/ui/LoadingState";
import SectionHero from "../components/ui/SectionHero";
import { useAuth } from "../state/auth";
import { notifyError, notifySuccess } from "../utils/feedback";

function formatRelativeDate(value) {
  if (!value) return "Recién";

  const date = new Date(value);
  const diffMs = date.getTime() - Date.now();
  const diffMinutes = Math.round(diffMs / 60000);
  const formatter = new Intl.RelativeTimeFormat("es-AR", { numeric: "auto" });

  if (Math.abs(diffMinutes) < 60) return formatter.format(diffMinutes, "minute");

  const diffHours = Math.round(diffMinutes / 60);
  if (Math.abs(diffHours) < 24) return formatter.format(diffHours, "hour");

  const diffDays = Math.round(diffHours / 24);
  return formatter.format(diffDays, "day");
}

function getTypeMeta(type) {
  const map = {
    reporte: {
      label: "Reporte",
      className: "bg-[#eef6e4] text-[#4f7a2f]",
    },
    gamificacion: {
      label: "Gamificación",
      className: "bg-[#edf4ff] text-[#25548a]",
    },
    sistema: {
      label: "Sistema",
      className: "bg-slate-100 text-slate-600",
    },
  };

  return map[type] || map.sistema;
}

export default function Notifications() {
  const { user, ready } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");
  const [markingAll, setMarkingAll] = useState(false);

  async function loadNotifications() {
    try {
      setLoading(true);
      setError("");
      const data = await NotificationsAPI.listMine();
      setItems(Array.isArray(data?.items) ? data.items : []);
    } catch (loadError) {
      setError(
        getFriendlyApiError(loadError, "No pudimos cargar tus notificaciones.")
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!ready || !user) return;
    loadNotifications();
  }, [ready, user]);

  const unreadCount = useMemo(
    () => items.filter((item) => !item.read).length,
    [items]
  );

  const handleMarkRead = async (id) => {
    try {
      setBusyId(id);
      await NotificationsAPI.markRead(id);
      setItems((current) =>
        current.map((item) => (item._id === id ? { ...item, read: true } : item))
      );
    } catch (actionError) {
      notifyError(
        getFriendlyApiError(actionError, "No pudimos marcar la notificación.")
      );
    } finally {
      setBusyId("");
    }
  };

  const handleDelete = async (id) => {
    try {
      setBusyId(id);
      await NotificationsAPI.remove(id);
      setItems((current) => current.filter((item) => item._id !== id));
      notifySuccess("Notificación eliminada.");
    } catch (actionError) {
      notifyError(
        getFriendlyApiError(actionError, "No pudimos eliminar la notificación.")
      );
    } finally {
      setBusyId("");
    }
  };

  const handleMarkAll = async () => {
    try {
      setMarkingAll(true);
      await NotificationsAPI.markAllRead();
      setItems((current) => current.map((item) => ({ ...item, read: true })));
      notifySuccess("Marcaste todas las notificaciones como leídas.");
    } catch (actionError) {
      notifyError(
        getFriendlyApiError(actionError, "No pudimos actualizar tus notificaciones.")
      );
    } finally {
      setMarkingAll(false);
    }
  };

  if (!ready) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <LoadingState
          title="Validando sesión"
          description="Estamos preparando tus notificaciones."
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <SectionHero
          eyebrow="Mi cuenta"
          title="Notificaciones"
          description="Iniciá sesión para ver avisos sobre reportes, gamificación y novedades importantes dentro de EcoRG."
          actions={(
            <Link
              to="/login?next=/notificaciones"
              className="inline-flex w-full items-center justify-center rounded-2xl bg-[#66a939] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5a9732] lg:w-auto"
            >
              Acceder
            </Link>
          )}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <SectionHero
        eyebrow="Mi cuenta"
        title="Notificaciones"
        description="Recibí avisos internos cuando tus reportes cambian de estado o cuando obtenés puntos y logros en EcoRG."
        actions={(
          unreadCount > 0 ? (
            <button
              type="button"
              onClick={handleMarkAll}
              disabled={markingAll}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[#d9e7ca] bg-white px-4 py-3 text-sm font-semibold text-[#35561a] transition hover:border-[#66a939] hover:bg-[#f7fbf1] disabled:cursor-not-allowed disabled:opacity-70 lg:w-auto"
            >
              <FiCheckCircle className="h-4 w-4" />
              {markingAll ? "Actualizando..." : "Marcar todas como leídas"}
            </button>
          ) : null
        )}
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Total" value={items.length} />
          <StatCard label="No leídas" value={unreadCount} />
          <StatCard label="Leídas" value={Math.max(0, items.length - unreadCount)} />
        </div>
      </SectionHero>

      <section className="mt-8 rounded-[30px] border border-[#dce8ce] bg-white p-5 shadow-[0_16px_40px_rgba(59,89,34,0.08)] sm:p-6">
        {loading ? (
          <LoadingState
            compact
            title="Cargando notificaciones"
            description="Estamos preparando tus avisos recientes."
          />
        ) : error ? (
          <div className="rounded-[28px] border border-[#f0d7dc] bg-[#fff8f8] px-6 py-10 text-center">
            <h2 className="text-xl font-semibold text-[#203014]">
              No pudimos cargar tus notificaciones
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{error}</p>
            <button
              type="button"
              onClick={loadNotifications}
              className="mt-5 inline-flex items-center justify-center rounded-2xl bg-[#66a939] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#5a9732]"
            >
              Reintentar
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-[#d7e5c5] bg-[#fbfdf8] px-6 py-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef6e4] text-[#66a939]">
              <FiBell className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-[#203014]">
              No tenés notificaciones
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Cuando haya novedades sobre tus reportes o logros, las vas a ver acá.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => {
              const meta = getTypeMeta(item.type);
              return (
                <article
                  key={item._id}
                  className={`rounded-[24px] border px-5 py-4 transition ${
                    item.read
                      ? "border-[#e3ecd8] bg-[#fbfdf8]"
                      : "border-[#dce8ce] bg-white shadow-sm"
                  }`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${meta.className}`}>
                          {meta.label}
                        </span>
                        {!item.read ? (
                          <span className="rounded-full bg-[#f5faee] px-2.5 py-1 text-xs font-semibold text-[#4f7a2f]">
                            Nueva
                          </span>
                        ) : null}
                      </div>
                      <h2 className="mt-3 text-lg font-semibold text-[#203014]">{item.title}</h2>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{item.message}</p>
                      <p className="mt-3 text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
                        {formatRelativeDate(item.createdAt)}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {!item.read ? (
                        <button
                          type="button"
                          onClick={() => handleMarkRead(item._id)}
                          disabled={busyId === item._id}
                          className="inline-flex items-center gap-2 rounded-2xl border border-[#d9e7ca] bg-white px-3 py-2 text-sm font-semibold text-[#35561a] transition hover:border-[#66a939] hover:bg-[#f7fbf1] disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          <FiCheck className="h-4 w-4" />
                          {busyId === item._id ? "Actualizando..." : "Marcar como leída"}
                        </button>
                      ) : null}

                      <button
                        type="button"
                        onClick={() => handleDelete(item._id)}
                        disabled={busyId === item._id}
                        className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-white px-3 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        <FiTrash2 className="h-4 w-4" />
                        Eliminar
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <article className="rounded-2xl border border-[#deead4] bg-white px-4 py-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#4f7a2f]">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-[#203014]">{value}</p>
    </article>
  );
}
