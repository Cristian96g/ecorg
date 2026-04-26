import { useEffect, useMemo, useState } from "react";
import { FiBookOpen, FiFilter, FiMapPin, FiRotateCcw, FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import { PointsAPI } from "../api/api";
import MapGoogle from "../components/MapGoogle";
import LoadingState from "../components/ui/LoadingState";
import SectionHero from "../components/ui/SectionHero";
import { notifyError } from "../utils/feedback";

const MATERIAL_ALIASES = {
  papel: ["papel", "papel_carton"],
  papel_carton: ["papel", "papel_carton"],
};

const MATERIAL_OPTIONS = [
  { value: "", label: "Todos los materiales" },
  { value: "plastico", label: "PlÃ¡stico" },
  { value: "vidrio", label: "Vidrio" },
  { value: "papel", label: "Papel / CartÃ³n" },
  { value: "pilas", label: "Pilas" },
  { value: "aceite", label: "Aceite usado" },
];

const STATUS_OPTIONS = [
  { value: "", label: "Todos los estados" },
  { value: "activo", label: "Activo" },
  { value: "inactivo", label: "Temporalmente inactivo" },
];

const LEGEND_ITEMS = [
  { color: "#E6F8EE", label: "PlÃ¡stico" },
  { color: "#EAF4FF", label: "Vidrio" },
  { color: "#FFF6E6", label: "Papel / CartÃ³n" },
  { color: "#FCE9EF", label: "Pilas" },
  { color: "#EEF6FF", label: "Aceite usado" },
  { color: "#66a939", label: "Mixto / general" },
];

function matchesMaterial(pointTypes = [], activeType = "") {
  if (!activeType) return true;

  const acceptedTypes = MATERIAL_ALIASES[activeType] || [activeType];
  return pointTypes.some((type) => acceptedTypes.includes(type));
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-600">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-2xl border border-[#d9e7ca] bg-white px-3 py-3 pr-8 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#66a939]/25"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg fill='%23727272' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath d='M5.5 7.5l4.5 4.5 4.5-4.5'/%3E%3C/svg%3E\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right .7rem center",
          backgroundSize: "1rem 1rem",
        }}
      >
        {options.map((option) => (
          <option key={option.value || "all"} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function FilterPanel({
  q,
  setQ,
  barrio,
  setBarrio,
  type,
  setType,
  estado,
  setEstado,
  barrios,
  onClear,
  hasFilters,
  resultCount,
}) {
  return (
    <div className="space-y-5 rounded-[28px] border border-[#dce8ce] bg-white p-5 shadow-[0_16px_40px_rgba(59,89,34,0.08)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#4f7a2f]">
            Filtrar puntos
          </p>
          <h2 className="mt-2 text-xl font-semibold text-[#203014]">
            EncontrÃ¡ el punto adecuado
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            CombinÃ¡ bÃºsqueda, barrio, material y estado para ubicar opciones Ãºtiles segÃºn tu necesidad.
          </p>
        </div>
        <span className="rounded-full bg-[#eef6e4] px-3 py-1 text-xs font-semibold text-[#4f7a2f]">
          {resultCount} encontrados
        </span>
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-600">Buscar</span>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Nombre o direcciÃ³n..."
            className="w-full rounded-2xl border border-[#d9e7ca] bg-white py-3 pl-10 pr-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#66a939]/25"
          />
        </div>
      </label>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <Select
          label="Barrio"
          value={barrio}
          onChange={setBarrio}
          options={barrios.map((value) => ({ value, label: value || "Todos los barrios" }))}
        />
        <Select label="Material" value={type} onChange={setType} options={MATERIAL_OPTIONS} />
        <Select label="Estado" value={estado} onChange={setEstado} options={STATUS_OPTIONS} />
      </div>

      {hasFilters ? (
        <button
          type="button"
          onClick={onClear}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[#d9e7ca] bg-[#fbfdf8] px-4 py-3 text-sm font-semibold text-[#35561a] transition hover:bg-[#f4f9ee]"
        >
          <FiRotateCcw className="h-4 w-4" />
          Limpiar filtros
        </button>
      ) : null}
    </div>
  );
}

function Legend() {
  return (
    <div className="w-full max-w-[280px] rounded-[24px] border border-white/70 bg-white/92 p-4 shadow-[0_18px_36px_rgba(31,49,18,0.14)] backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#4f7a2f]">
        Leyenda
      </p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {LEGEND_ITEMS.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span
              className="inline-flex h-4 w-4 rounded-md border border-black/10"
              style={{ background: item.color }}
            />
            <span className="text-xs font-medium text-slate-600">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Map() {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [type, setType] = useState("");
  const [barrio, setBarrio] = useState("");
  const [estado, setEstado] = useState("");
  const [q, setQ] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await PointsAPI.list();
        setPoints(Array.isArray(data) ? data : []);
      } catch (loadError) {
        console.error("MAP_POINTS_LOAD_ERROR", loadError);
        setError("No pudimos cargar los puntos verdes en este momento.");
        notifyError("No se pudieron cargar los puntos verdes.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const barrios = useMemo(() => {
    const set = new Set();
    points.forEach((point) => point.barrio && set.add(point.barrio));
    return ["", ...Array.from(set).sort()];
  }, [points]);

  const filteredPoints = useMemo(() => {
    return points.filter((point) => {
      const okType = matchesMaterial(point.types || [], type);
      const okBarrio = !barrio || point.barrio === barrio;
      const okEstado = !estado || (point.estado || "activo") === estado;
      const hayQ = `${point.title || point.name || ""} ${point.address || ""}`.toLowerCase();
      const okQ = !q || hayQ.includes(q.toLowerCase());
      return okType && okBarrio && okEstado && okQ;
    });
  }, [points, type, barrio, estado, q]);

  function clearFilters() {
    setQ("");
    setBarrio("");
    setType("");
    setEstado("");
  }

  const hasFilters = Boolean(q || barrio || type || estado);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <SectionHero
        eyebrow="Puntos verdes"
        title="Mapa de puntos verdes"
        description="EncontrÃ¡ lugares de reciclaje segÃºn material, barrio y estado. UsÃ¡ los filtros para ubicar opciones cercanas y decidir mejor dÃ³nde llevar tus residuos."
        className="mb-6"
        actions={(
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link
              to="/reportes"
              className="inline-flex items-center justify-center rounded-2xl bg-[#66a939] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5a9732]"
            >
              Reportar problema
            </Link>
            <Link
              to="/educacion"
              className="inline-flex items-center justify-center rounded-2xl border border-[#cfe1b7] bg-white px-5 py-3 text-sm font-semibold text-[#4c7d26] transition hover:border-[#66a939] hover:text-[#33561a]"
            >
              Aprender a reciclar
            </Link>
          </div>
        )}
      >
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#4f7a2f] ring-1 ring-[#d5e6c1]">
            {filteredPoints.length} puntos visibles
          </span>
          <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 ring-1 ring-[#d5e6c1]">
            {hasFilters ? "Filtros activos" : "Sin filtros"}
          </span>
        </div>
      </SectionHero>

      <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
        <aside className="xl:sticky xl:top-24 xl:self-start">
          <div className="xl:hidden">
            <button
              type="button"
              onClick={() => setFiltersOpen((current) => !current)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[#dce8ce] bg-white px-4 py-3 text-sm font-semibold text-[#35561a] shadow-sm transition hover:bg-[#f7fbf1]"
            >
              <FiFilter className="h-4 w-4" />
              {filtersOpen ? "Ocultar filtros" : "Mostrar filtros"}
            </button>
          </div>

          <div className={`${filtersOpen ? "mt-4 block" : "mt-0 hidden"} xl:mt-0 xl:block`}>
            <FilterPanel
              q={q}
              setQ={setQ}
              barrio={barrio}
              setBarrio={setBarrio}
              type={type}
              setType={setType}
              estado={estado}
              setEstado={setEstado}
              barrios={barrios}
              onClear={clearFilters}
              hasFilters={hasFilters}
              resultCount={filteredPoints.length}
            />
          </div>
        </aside>

        <section className="space-y-4">
          <div className="overflow-hidden rounded-[30px] border border-[#dce8ce] bg-white shadow-[0_18px_50px_-28px_rgba(15,130,55,0.35)]">
            <div className="border-b border-[#edf3ed] bg-gradient-to-r from-[#f3f9f1] via-white to-[#f8fcf7] px-5 py-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#4f7a2f]">
                    VisualizaciÃ³n
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-[#203014]">
                    ExplorÃ¡ puntos verdes sobre el mapa
                  </h2>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-[#eef6e4] px-3 py-1 text-xs font-semibold text-[#4f7a2f]">
                  <FiMapPin className="h-4 w-4" />
                  {filteredPoints.length} puntos encontrados
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="min-h-[460px] sm:min-h-[560px]">
                {loading ? (
                  <LoadingState
                    compact
                    className="h-[460px] rounded-none border-0 shadow-none sm:h-[560px]"
                    title="Cargando mapa"
                    description="Estamos buscando los puntos verdes disponibles."
                  />
                ) : error ? (
                  <LoadingState
                    compact
                    className="h-[460px] rounded-none border-0 shadow-none sm:h-[560px]"
                    title="No pudimos cargar el mapa"
                    description={error}
                  />
                ) : (
                  <MapGoogle points={filteredPoints} activeType={type} />
                )}
              </div>

              {!loading && !error ? (
                <>
                  <div className="pointer-events-none absolute bottom-4 left-4 right-4 z-20 sm:left-auto sm:right-4 sm:w-auto">
                    <Legend />
                  </div>

                  {filteredPoints.length === 0 ? (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-[2px]">
                      <div className="mx-4 max-w-md rounded-[28px] border border-[#dce8ce] bg-white px-6 py-8 text-center shadow-[0_20px_44px_rgba(59,89,34,0.12)]">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef6e4] text-[#66a939]">
                          <FiMapPin className="h-6 w-6" />
                        </div>
                        <h3 className="mt-4 text-xl font-semibold text-[#203014]">
                          No encontramos puntos para esta bÃºsqueda
                        </h3>
                        <p className="mt-3 text-sm leading-6 text-slate-600">
                          ProbÃ¡ cambiar el material, el barrio o el estado del punto para ampliar los resultados.
                        </p>
                        {hasFilters ? (
                          <button
                            type="button"
                            onClick={clearFilters}
                            className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl border border-[#d9e7ca] bg-[#fbfdf8] px-4 py-3 text-sm font-semibold text-[#35561a] transition hover:bg-[#f4f9ee]"
                          >
                            <FiRotateCcw className="h-4 w-4" />
                            Limpiar filtros
                          </button>
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                </>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

