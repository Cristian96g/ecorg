import React from "react";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiGrid,
  FiHome,
  FiLayers,
  FiMap,
  FiMapPin,
  FiRefreshCw,
  FiUsers,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import {
  BarriosAPI,
  PointsAPI,
  ReportsAPI,
  UsersAPI,
  getFriendlyApiError,
} from "../../api/api";

function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-[28px] border border-[#dbe7cf] bg-white shadow-[0_18px_45px_rgba(59,89,34,0.08)] ${className}`}
    >
      {children}
    </div>
  );
}

function CardHeader({ title, action = null, subtitle = "" }) {
  return (
    <div className="flex flex-col gap-3 border-b border-[#edf3e6] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="text-[15px] font-semibold text-[#24341a]">{title}</h3>
        {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

function CardBody({ children, className = "" }) {
  return <div className={`px-5 py-5 ${className}`}>{children}</div>;
}

function StatCard({ icon, label, value, tone = "green", helper = "", loading = false }) {
  const tones = {
    green: "bg-[#eef7e9] text-[#4d7e28]",
    amber: "bg-amber-50 text-amber-700",
    blue: "bg-sky-50 text-sky-700",
    rose: "bg-rose-50 text-rose-700",
    slate: "bg-slate-100 text-slate-700",
  };

  return (
    <Card>
      <CardBody className="flex items-start gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tones[tone] || tones.green}`}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            {label}
          </p>
          {loading ? (
            <>
              <div className="mt-3 h-9 w-24 animate-pulse rounded-2xl bg-[#edf4e5]" />
              <div className="mt-3 h-4 w-40 animate-pulse rounded-full bg-[#f2f7ec]" />
            </>
          ) : (
            <>
              <p className="mt-2 text-3xl font-semibold text-[#24341a]">{value}</p>
              {helper ? <p className="mt-2 text-sm text-slate-500">{helper}</p> : null}
            </>
          )}
        </div>
      </CardBody>
    </Card>
  );
}

function QuickAction({ to, icon, title, description }) {
  const Icon = icon;

  return (
    <Link
      to={to}
      className="rounded-[24px] border border-[#dbe7cf] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#66a939] hover:shadow-[0_16px_40px_rgba(59,89,34,0.10)]"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef7e9] text-[#4d7e28]">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-[#24341a]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </Link>
  );
}

function StatusBadge({ estado }) {
  const map = {
    abierto: "bg-rose-100 text-rose-700",
    en_revision: "bg-amber-100 text-amber-700",
    resuelto: "bg-emerald-100 text-emerald-700",
  };

  const labels = {
    abierto: "Abierto",
    en_revision: "En revisiÃ³n",
    resuelto: "Resuelto",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${map[estado] || "bg-slate-100 text-slate-700"}`}
    >
      {labels[estado] || estado || "Sin estado"}
    </span>
  );
}

function fmtNum(value) {
  return (value ?? 0).toLocaleString("es-AR");
}

function fmtDate(iso) {
  if (!iso) return "-";
  return new Date(iso).toLocaleString("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function sortByDateDesc(items = []) {
  return [...items].sort((a, b) => {
    const aTime = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bTime - aTime;
  });
}

function LoadingBlock({ rows = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="h-16 animate-pulse rounded-2xl bg-[#f3f7ed]" />
      ))}
    </div>
  );
}

function EmptyState({ title, description, action = null }) {
  return (
    <div className="rounded-[24px] border border-dashed border-[#d7e5c5] bg-[#fbfdf8] px-6 py-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef6e4] text-[#66a939]">
        <FiGrid className="h-5 w-5" />
      </div>
      <h4 className="mt-4 text-base font-semibold text-[#24341a]">{title}</h4>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="rounded-[24px] border border-[#f0d7dc] bg-[#fff8f8] px-5 py-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-100 text-rose-700">
            <FiAlertCircle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#7f2337]">
              No pudimos cargar la informaciÃ³n del dashboard
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#8a3445]">{message}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#f1cdd6] bg-white px-4 py-2.5 text-sm font-semibold text-[#8a3445] transition hover:bg-rose-50"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [stats, setStats] = React.useState({
    users: 0,
    points: 0,
    barrios: 0,
    totalReports: 0,
    openReports: 0,
    inReviewReports: 0,
    resolvedReports: 0,
  });
  const [recentReports, setRecentReports] = React.useState([]);
  const [recentPoints, setRecentPoints] = React.useState([]);

  const loadDashboard = React.useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [usersRaw, reportsRaw, pointsRaw, barriosRaw] = await Promise.all([
        UsersAPI.list({}),
        ReportsAPI.list({}),
        PointsAPI.list({}),
        BarriosAPI.list({}),
      ]);

      const users = Array.isArray(usersRaw) ? usersRaw : usersRaw?.items ?? [];
      const reports = Array.isArray(reportsRaw) ? reportsRaw : reportsRaw?.items ?? [];
      const points = Array.isArray(pointsRaw) ? pointsRaw : pointsRaw?.items ?? [];
      const barrios = Array.isArray(barriosRaw) ? barriosRaw : barriosRaw?.items ?? [];

      const sortedReports = sortByDateDesc(reports);
      const sortedPoints = sortByDateDesc(points);

      setStats({
        users: users.length,
        points: points.length,
        barrios: barrios.length,
        totalReports: reports.length,
        openReports: reports.filter((item) => item.estado === "abierto").length,
        inReviewReports: reports.filter((item) => item.estado === "en_revision").length,
        resolvedReports: reports.filter((item) => item.estado === "resuelto").length,
      });
      setRecentReports(sortedReports.slice(0, 4));
      setRecentPoints(sortedPoints.slice(0, 4));
    } catch (loadError) {
      console.error("DASHBOARD_LOAD_ERROR", loadError);
      setError(
        getFriendlyApiError(
          loadError,
          "No pudimos cargar las mÃ©tricas del panel en este momento."
        )
      );
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[32px] border border-[#d8e7c5] bg-[linear-gradient(135deg,#f7fbf1_0%,#eef7e2_45%,#f9fcf3_100%)] px-5 py-7 shadow-[0_24px_60px_rgba(73,110,33,0.10)] sm:px-8 sm:py-9">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-[#cfe1b7] bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#4f7a2f]">
              Panel administrativo
            </span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#203014] sm:text-4xl">
              Resumen general de EcoRG
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              ConsultÃ¡ mÃ©tricas reales de usuarios, puntos verdes, barrios y reportes para mostrar el estado actual de la plataforma.
            </p>
          </div>

          <button
            type="button"
            onClick={loadDashboard}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#d7e5c5] bg-white px-4 py-3 text-sm font-semibold text-[#35561a] transition hover:border-[#66a939] hover:bg-[#f7fbf1] disabled:cursor-not-allowed disabled:opacity-70"
          >
            <FiRefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Actualizar mÃ©tricas
          </button>
        </div>
      </section>

      {error ? <ErrorState message={error} onRetry={loadDashboard} /> : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<FiUsers className="h-5 w-5" />}
          label="Usuarios"
          value={fmtNum(stats.users)}
          helper="Cuentas registradas en la plataforma"
          tone="green"
          loading={loading}
        />
        <StatCard
          icon={<FiMap className="h-5 w-5" />}
          label="Puntos verdes"
          value={fmtNum(stats.points)}
          helper="Ubicaciones activas e inactivas cargadas"
          tone="blue"
          loading={loading}
        />
        <StatCard
          icon={<FiHome className="h-5 w-5" />}
          label="Barrios"
          value={fmtNum(stats.barrios)}
          helper="CatÃ¡logo maestro disponible para la app"
          tone="slate"
          loading={loading}
        />
        <StatCard
          icon={<FiLayers className="h-5 w-5" />}
          label="Reportes totales"
          value={fmtNum(stats.totalReports)}
          helper="Casos registrados por la comunidad"
          tone="amber"
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          icon={<FiAlertCircle className="h-5 w-5" />}
          label="Reportes abiertos"
          value={fmtNum(stats.openReports)}
          helper="Pendientes de gestiÃ³n"
          tone="rose"
          loading={loading}
        />
        <StatCard
          icon={<FiClock className="h-5 w-5" />}
          label="En revisiÃ³n"
          value={fmtNum(stats.inReviewReports)}
          helper="Casos evaluados por el equipo"
          tone="amber"
          loading={loading}
        />
        <StatCard
          icon={<FiCheckCircle className="h-5 w-5" />}
          label="Resueltos"
          value={fmtNum(stats.resolvedReports)}
          helper="Casos marcados como finalizados"
          tone="green"
          loading={loading}
        />
      </div>

      <Card>
        <CardHeader
          title="Accesos rÃ¡pidos"
          subtitle="Atajos reales a las secciones mÃ¡s importantes del panel."
        />
        <CardBody>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <QuickAction
              to="/admin/puntos"
              icon={FiMapPin}
              title="Gestionar puntos verdes"
              description="CreÃ¡, editÃ¡ y revisÃ¡ ubicaciones que despuÃ©s se muestran en el mapa pÃºblico."
            />
            <QuickAction
              to="/admin/reportes"
              icon={FiAlertCircle}
              title="Revisar reportes"
              description="ModerÃ¡ reportes comunitarios y actualizÃ¡ su estado operativo."
            />
            <QuickAction
              to="/admin/barrios"
              icon={FiHome}
              title="Gestionar barrios"
              description="MantenÃ© el catÃ¡logo maestro que usan puntos, reportes y futuros cronogramas."
            />
            <QuickAction
              to="/admin/usuarios"
              icon={FiUsers}
              title="Ver usuarios"
              description="AdministrÃ¡ roles, altas y estado general de las cuentas registradas."
            />
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader
            title="Ãšltimos reportes"
            subtitle="Actividad reciente del mÃ³dulo comunitario."
            action={(
              <Link
                to="/admin/reportes"
                className="text-sm font-medium text-[#5d8a38] transition hover:text-[#3c6724]"
              >
                Ver todos â†’
              </Link>
            )}
          />
          <CardBody>
            {loading ? (
              <LoadingBlock />
            ) : recentReports.length === 0 ? (
              <EmptyState
                title="TodavÃ­a no hay reportes recientes"
                description="Cuando la comunidad envÃ­e nuevos casos, vas a poder revisarlos rÃ¡pido desde este resumen."
                action={(
                  <Link
                    to="/admin/reportes"
                    className="inline-flex items-center justify-center rounded-2xl border border-[#d7e5c5] bg-white px-4 py-2.5 text-sm font-semibold text-[#3c6724] transition hover:bg-[#f6faf1]"
                  >
                    Ver reportes
                  </Link>
                )}
              />
            ) : (
              <div className="space-y-3">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                  Mostrando {recentReports.length} de {stats.totalReports}
                </p>
                {recentReports.map((report) => (
                  <div
                    key={report._id}
                    className="rounded-2xl border border-[#e7efdc] bg-[#fbfdf8] px-4 py-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#24341a]">
                          {report.titulo || report.title || report.code || report._id}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {report.barrio || "Sin barrio"} Â· {fmtDate(report.createdAt)}
                        </p>
                      </div>
                      <StatusBadge estado={report.estado} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Ãšltimos puntos verdes"
            subtitle="Puntos cargados recientemente en el sistema."
            action={(
              <Link
                to="/admin/puntos"
                className="text-sm font-medium text-[#5d8a38] transition hover:text-[#3c6724]"
              >
                Ver todos â†’
              </Link>
            )}
          />
          <CardBody>
            {loading ? (
              <LoadingBlock />
            ) : recentPoints.length === 0 ? (
              <EmptyState
                title="TodavÃ­a no hay puntos verdes cargados"
                description="Cuando se creen nuevas ubicaciones, las vas a ver acÃ¡ como referencia rÃ¡pida."
                action={(
                  <Link
                    to="/admin/puntos"
                    className="inline-flex items-center justify-center rounded-2xl border border-[#d7e5c5] bg-white px-4 py-2.5 text-sm font-semibold text-[#3c6724] transition hover:bg-[#f6faf1]"
                  >
                    Ver puntos
                  </Link>
                )}
              />
            ) : (
              <div className="space-y-3">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                  Mostrando {recentPoints.length} de {stats.points}
                </p>
                {recentPoints.map((point) => (
                  <div
                    key={point._id}
                    className="rounded-2xl border border-[#e7efdc] bg-white px-4 py-4"
                  >
                    <p className="text-sm font-semibold text-[#24341a]">
                      {point.title || point.name || "Punto verde"}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {point.barrio || "Sin barrio"} Â· {point.address || "Sin direcciÃ³n"}
                    </p>
                    <div className="mt-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          point.estado === "inactivo"
                            ? "bg-slate-100 text-slate-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {point.estado === "inactivo" ? "Inactivo" : "Activo"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
