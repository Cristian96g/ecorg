import { useEffect, useMemo, useState } from "react";
import {
  FiActivity,
  FiAward,
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiLock,
  FiStar,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { EcoActionsAPI, UsersAPI, getFriendlyApiError } from "../api/api";
import LoadingState from "../components/ui/LoadingState";
import SectionHero from "../components/ui/SectionHero";
import { useAuth } from "../state/auth";
import { notifyError } from "../utils/feedback";

const LEVELS = [
  { label: "Eco principiante", min: 0, max: 99 },
  { label: "Vecino consciente", min: 100, max: 299 },
  { label: "Reciclador activo", min: 300, max: 599 },
  { label: "GuardiÃ¡n ambiental", min: 600, max: 999 },
  { label: "Eco hÃ©roe", min: 1000, max: Infinity },
];

const EXPLAINER_CARDS = [
  {
    title: "Reportes aprobados",
    description: "Cuando un reporte es validado por el equipo, suma puntos al perfil del usuario.",
    points: "+20 puntos",
    icon: FiCheckCircle,
  },
  {
    title: "Reciclaje validado",
    description: "Las acciones de reciclaje confirmadas por administraciÃ³n tambiÃ©n cuentan dentro del sistema.",
    points: "+15 puntos",
    icon: FiActivity,
  },
  {
    title: "EducaciÃ³n ambiental",
    description: "Las actividades educativas pueden integrarse al progreso del usuario en futuras iteraciones.",
    points: "+5 puntos",
    icon: FiBookOpen,
  },
];

const BADGE_CATALOG = [
  {
    key: "primer_reporte",
    name: "Primer reporte aprobado",
    description: "ObtenÃ© la validaciÃ³n de tu primer reporte ambiental dentro de EcoRG.",
    icon: "ðŸ“£",
  },
  {
    key: "cinco_reportes",
    name: "Vecino comprometido",
    description: "AlcanzÃ¡ cinco reportes aprobados y consolidÃ¡ tu participaciÃ³n ciudadana.",
    icon: "ðŸŒ¿",
  },
  {
    key: "primer_reciclaje",
    name: "Primera acciÃ³n de reciclaje",
    description: "RegistrÃ¡ una acciÃ³n de reciclaje validada por el equipo.",
    icon: "â™»ï¸",
  },
  {
    key: "cien_puntos",
    name: "100 puntos verdes",
    description: "SuperÃ¡ los 100 puntos acumulando acciones ambientales reales.",
    icon: "ðŸ’¯",
  },
  {
    key: "eco_heroe",
    name: "Eco hÃ©roe",
    description: "LlegÃ¡ al nivel mÃ¡s alto disponible en esta versiÃ³n de EcoRG.",
    icon: "ðŸ…",
  },
];

const TABS = [
  { key: "resumen", label: "Resumen" },
  { key: "logros", label: "Logros" },
  { key: "historial", label: "Historial" },
  { key: "como", label: "CÃ³mo sumar puntos" },
];

function formatDate(value) {
  if (!value) return "Sin fecha";
  return new Date(value).toLocaleString("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function getActionTypeLabel(type) {
  const labels = {
    reporte: "Reporte ambiental",
    reciclaje: "Reciclaje validado",
    educacion: "AcciÃ³n educativa",
    punto_sugerido: "Sugerencia de punto verde",
  };

  return labels[type] || "AcciÃ³n ambiental";
}

function getStatusMeta(status) {
  const map = {
    pendiente: {
      label: "Pendiente",
      className: "bg-amber-100 text-amber-700",
      icon: FiClock,
    },
    aprobada: {
      label: "Aprobada",
      className: "bg-emerald-100 text-emerald-700",
      icon: FiCheckCircle,
    },
    rechazada: {
      label: "Rechazada",
      className: "bg-rose-100 text-rose-700",
      icon: FiStar,
    },
  };

  return map[status] || {
    label: "Sin estado",
    className: "bg-slate-100 text-slate-700",
    icon: FiClock,
  };
}

function getCurrentLevel(points = 0) {
  return LEVELS.find((level) => points >= level.min && points <= level.max) || LEVELS[0];
}

function getNextLevel(points = 0) {
  return LEVELS.find((level) => level.min > points) || null;
}

function getProgress(points = 0) {
  const currentLevel = getCurrentLevel(points);
  const nextLevel = getNextLevel(points);

  if (!nextLevel || currentLevel.max === Infinity) {
    return {
      percent: 100,
      currentLevel,
      nextLevel: null,
      remaining: 0,
    };
  }

  const span = currentLevel.max - currentLevel.min + 1;
  const done = Math.max(0, points - currentLevel.min);
  const percent = Math.max(8, Math.min(100, Math.round((done / span) * 100)));

  return {
    percent,
    currentLevel,
    nextLevel,
    remaining: Math.max(0, nextLevel.min - points),
  };
}

function MiniStat({ label, value, helper }) {
  return (
    <article className="rounded-2xl border border-[#deead4] bg-[#fbfdf8] px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#4f7a2f]">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-[#203014]">{value}</p>
      <p className="mt-1 text-sm leading-6 text-slate-600">{helper}</p>
    </article>
  );
}

function BadgeCard({ badge, earned }) {
  return (
    <article
      className={`rounded-[24px] border p-4 transition ${
        earned
          ? "border-[#dce8ce] bg-white shadow-sm"
          : "border-dashed border-[#d8e3ca] bg-[#fbfdf8]"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl ${
            earned ? "bg-[#eef6e4]" : "bg-slate-100"
          }`}
        >
          {earned ? badge.icon : <FiLock className="h-5 w-5 text-slate-400" />}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-[#203014]">{badge.name}</h3>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                earned ? "bg-[#eef6e4] text-[#4f7a2f]" : "bg-slate-100 text-slate-500"
              }`}
            >
              {earned ? "Obtenido" : "Bloqueado"}
            </span>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">{badge.description}</p>
          <p className="mt-3 text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
            {earned?.earnedAt ? `Obtenido el ${formatDate(earned.earnedAt)}` : "TodavÃ­a no alcanzado"}
          </p>
        </div>
      </div>
    </article>
  );
}

function TabButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`whitespace-nowrap rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${
        active
          ? "bg-[#66a939] text-white shadow-[0_10px_24px_rgba(102,169,57,0.22)]"
          : "bg-white text-slate-600 ring-1 ring-[#d8e7c5] hover:bg-[#f7fbf1] hover:text-[#4f7a2f]"
      }`}
    >
      {children}
    </button>
  );
}

function EmptyState({ title, description }) {
  return (
    <div className="rounded-[28px] border border-dashed border-[#d7e5c5] bg-[#fbfdf8] px-6 py-12 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef6e4] text-[#66a939]">
        <FiActivity className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-xl font-semibold text-[#203014]">{title}</h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}

export default function Gamification() {
  const { user, ready } = useAuth();
  const [profile, setProfile] = useState(null);
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("resumen");

  useEffect(() => {
    if (!ready || !user) {
      setProfile(user || null);
      setActions([]);
      setLoading(false);
      setError("");
      return;
    }

    let cancelled = false;

    async function loadGamification() {
      try {
        setLoading(true);
        setError("");

        const [freshUser, ecoActions] = await Promise.all([
          UsersAPI.getMe(),
          EcoActionsAPI.listMine(),
        ]);

        if (cancelled) return;

        setProfile(freshUser || user);
        setActions(Array.isArray(ecoActions) ? ecoActions : []);
      } catch (loadError) {
        if (cancelled) return;

        const message = getFriendlyApiError(
          loadError,
          "No pudimos cargar tu progreso ambiental en este momento."
        );
        setProfile(user);
        setActions([]);
        setError(message);
        notifyError(message);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadGamification();

    return () => {
      cancelled = true;
    };
  }, [ready, user]);

  const safeProfile = profile || user || null;
  const points = Number(safeProfile?.points || 0);
  const level = safeProfile?.level || "Eco principiante";
  const progress = useMemo(() => getProgress(points), [points]);
  const earnedBadges = useMemo(
    () => (Array.isArray(safeProfile?.badges) ? safeProfile.badges : []),
    [safeProfile?.badges]
  );
  const badgeMap = useMemo(
    () => new Map(earnedBadges.map((badge) => [badge.key, badge])),
    [earnedBadges]
  );
  const featuredBadges = useMemo(() => BADGE_CATALOG.slice(0, 3), []);

  if (!ready) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <LoadingState
          title="Validando sesiÃ³n"
          description="Estamos preparando tu panel de gamificaciÃ³n."
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <SectionHero
          eyebrow="GamificaciÃ³n"
          title="SumÃ¡ puntos participando en acciones ambientales"
          description="IniciÃ¡ sesiÃ³n para ver tus puntos, tu nivel actual y el historial de acciones validadas dentro de EcoRG."
          actions={(
            <Link
              to="/login?next=/gamificacion"
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <SectionHero
        eyebrow="GamificaciÃ³n"
        title="SumÃ¡ puntos participando en acciones ambientales"
        description="EntendÃ© rÃ¡pido tu progreso, tus logros y las acciones que te ayudan a avanzar dentro de EcoRG."
      >
        <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[28px] border border-[#dce8ce] bg-white p-5 shadow-[0_16px_40px_rgba(59,89,34,0.08)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#4f7a2f]">Tu progreso</p>
                <h2 className="mt-2 text-3xl font-semibold text-[#203014]">{points.toLocaleString("es-AR")} pts</h2>
                <p className="mt-2 text-sm text-slate-600">
                  Nivel actual: <span className="font-semibold text-[#35561a]">{level}</span>
                </p>
              </div>
              <div className="rounded-2xl bg-[#f5faee] px-4 py-3 text-sm text-slate-600">
                {progress.nextLevel
                  ? `Te faltan ${progress.remaining} puntos para ${progress.nextLevel.label}.`
                  : "Ya alcanzaste el nivel mÃ¡s alto disponible."}
              </div>
            </div>

            <div className="mt-5">
              <div className="h-4 overflow-hidden rounded-full bg-[#edf5e1]">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#66a939_0%,#85c457_100%)] transition-all"
                  style={{ width: `${progress.percent}%` }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
                <span>{progress.currentLevel.min} pts</span>
                <span>{points} pts</span>
                <span>{progress.nextLevel ? progress.nextLevel.min : "1000+ pts"}</span>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
            <MiniStat
              label="Usuario"
              value={safeProfile?.nombre || "Cuenta EcoRG"}
              helper="Tu progreso estÃ¡ asociado a tu cuenta actual."
            />
            <MiniStat
              label="Acciones"
              value={actions.length.toLocaleString("es-AR")}
              helper="Pendientes, aprobadas y rechazadas."
            />
            <MiniStat
              label="Logros"
              value={earnedBadges.length.toLocaleString("es-AR")}
              helper="Insignias obtenidas automÃ¡ticamente."
            />
            <MiniStat
              label="Meta actual"
              value={progress.nextLevel ? progress.nextLevel.label : "Completada"}
              helper="PrÃ³ximo nivel o tope alcanzado."
            />
          </div>
        </div>
      </SectionHero>

      <section className="mt-8 rounded-[30px] border border-[#dce8ce] bg-white p-4 shadow-[0_16px_40px_rgba(59,89,34,0.08)] sm:p-6">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {TABS.map((tab) => (
            <TabButton
              key={tab.key}
              active={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </TabButton>
          ))}
        </div>

        <div className="mt-6">
          {activeTab === "resumen" && (
            <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[28px] border border-[#dce8ce] bg-[#fbfdf8] p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#4f7a2f]">
                  Niveles disponibles
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {LEVELS.map((item) => (
                    <article
                      key={item.label}
                      className={`rounded-2xl border px-4 py-3 text-sm ${
                        item.label === level
                          ? "border-[#66a939] bg-[#f4f9ee] text-[#35561a]"
                          : "border-[#e2ecd4] bg-white text-slate-600"
                      }`}
                    >
                      <p className="font-semibold">{item.label}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.12em]">
                        {item.max === Infinity ? `${item.min}+ puntos` : `${item.min} - ${item.max} puntos`}
                      </p>
                    </article>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-[#dce8ce] bg-[#fbfdf8] p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#4f7a2f]">
                      Logros destacados
                    </p>
                    <h2 className="mt-2 text-xl font-semibold text-[#203014]">
                      Tus insignias visibles
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("logros")}
                    className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-[#4f7a2f] ring-1 ring-[#d8e7c5] transition hover:bg-[#f7fbf1]"
                  >
                    Ver todos
                  </button>
                </div>

                <div className="mt-5 grid gap-3">
                  {featuredBadges.map((badge) => (
                    <BadgeCard key={badge.key} badge={badge} earned={badgeMap.get(badge.key)} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "logros" && (
            <div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#4f7a2f]">
                    Mis logros
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-[#203014]">
                    Insignias ambientales
                  </h2>
                </div>
                <span className="rounded-full bg-[#eef6e4] px-3 py-1 text-xs font-semibold text-[#4f7a2f]">
                  {earnedBadges.length} de {BADGE_CATALOG.length} obtenidos
                </span>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {BADGE_CATALOG.map((badge) => (
                  <BadgeCard key={badge.key} badge={badge} earned={badgeMap.get(badge.key)} />
                ))}
              </div>
            </div>
          )}

          {activeTab === "historial" && (
            <div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#4f7a2f]">
                    Historial de acciones
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-[#203014]">
                    Tu actividad registrada
                  </h2>
                </div>
              </div>

              <div className="mt-6">
                {loading ? (
                  <LoadingState
                    compact
                    title="Cargando historial"
                    description="Estamos buscando tus acciones ambientales registradas."
                  />
                ) : error ? (
                  <div className="rounded-[28px] border border-[#f0d7dc] bg-[#fff8f8] px-6 py-12 text-center">
                    <h3 className="text-xl font-semibold text-[#203014]">No pudimos cargar la gamificaciÃ³n</h3>
                    <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
                      {error}
                    </p>
                  </div>
                ) : actions.length === 0 ? (
                  <EmptyState
                    title="TodavÃ­a no hay acciones registradas"
                    description="Cuando una acciÃ³n ambiental sea registrada o validada, va a aparecer acÃ¡ con su estado y puntaje."
                  />
                ) : (
                  <div className="space-y-4">
                    {actions.map((action) => {
                      const status = getStatusMeta(action.status);
                      const StatusIcon = status.icon;

                      return (
                        <article
                          key={action._id}
                          className="rounded-[24px] border border-[#e2ecd4] bg-[#fbfdf8] px-5 py-4"
                        >
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-base font-semibold text-[#203014]">
                                  {getActionTypeLabel(action.type)}
                                </h3>
                                <span className="rounded-full bg-[#eef6e4] px-2.5 py-1 text-xs font-semibold text-[#4f7a2f]">
                                  +{Number(action.points || 0)} pts
                                </span>
                              </div>
                              <p className="mt-2 text-sm leading-6 text-slate-600">
                                {action.description || "Sin descripciÃ³n adicional."}
                              </p>
                              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
                                <span>{formatDate(action.createdAt)}</span>
                                {action.relatedId ? <span>Relacionado a un registro del sistema</span> : null}
                              </div>
                            </div>

                            <span className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold ${status.className}`}>
                              <StatusIcon className="h-4 w-4" />
                              {status.label}
                            </span>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "como" && (
            <div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#4f7a2f]">
                    CÃ³mo sumar puntos
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-[#203014]">
                    Acciones que hacen crecer tu progreso
                  </h2>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {EXPLAINER_CARDS.map((card) => {
                  const Icon = card.icon;
                  return (
                    <article
                      key={card.title}
                      className="rounded-[24px] border border-[#dce8ce] bg-[#fbfdf8] p-5"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef6e4] text-[#66a939]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold text-[#203014]">{card.title}</h3>
                        <span className="rounded-full bg-[#f5faee] px-2.5 py-1 text-xs font-semibold text-[#4f7a2f]">
                          {card.points}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-600">{card.description}</p>
                    </article>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

