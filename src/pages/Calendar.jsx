import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiCalendar, FiClock, FiMapPin, FiSearch } from "react-icons/fi";
import LoadingState from "../components/ui/LoadingState";
import SectionHero from "../components/ui/SectionHero";
import {
  loadScheduleData,
  scheduleTypes,
} from "../constants/scheduleData.js";
import { notifyError } from "../utils/feedback";

const weekOrder = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

const typeStyles = {
  reciclables: {
    badge: "bg-[#e9f7e4] text-[#4c7d26]",
    accent: "#EAF6DE",
  },
  "residuos-secos": {
    badge: "bg-[#fff5e7] text-[#9b6a1a]",
    accent: "#FFF6E6",
  },
  "residuos-especiales": {
    badge: "bg-[#eef3ff] text-[#365c9b]",
    accent: "#EEF6FF",
  },
};

function getNextCollectionLabel(days = []) {
  const today = new Date().getDay();
  let minDiff = 8;
  let nextDay = null;

  days.forEach((day) => {
    const index = weekOrder.indexOf(day);
    if (index >= 0) {
      const diff = (index - today + 7) % 7;
      if (diff < minDiff) {
        minDiff = diff;
        nextDay = day;
      }
    }
  });

  if (!nextDay) return null;
  if (minDiff === 0) return "Hoy";
  if (minDiff === 1) return "Mañana";
  return nextDay;
}

function ScheduleCard({ item }) {
  const styles = typeStyles[item.tipo] ?? typeStyles.reciclables;
  const nextLabel = getNextCollectionLabel(item.dias);

  return (
    <article className="rounded-[28px] border border-[#dce8ce] bg-white p-5 shadow-[0_16px_40px_rgba(59,89,34,0.08)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">Barrio</p>
          <h2 className="mt-1 text-2xl font-semibold text-[#203014]">
            {item.barrio}
          </h2>
        </div>

        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${styles.badge}`}
        >
          {item.tipoLabel}
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div
          className="rounded-2xl border border-[#ebf1e2] p-4"
          style={{ backgroundColor: styles.accent }}
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-[#33561a]">
            <FiCalendar className="h-4 w-4" />
            Días de recolección
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            {item.dias.join(", ")}
          </p>
        </div>

        <div className="rounded-2xl border border-[#ebf1e2] bg-[#fbfdf8] p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#33561a]">
            <FiClock className="h-4 w-4" />
            Horario estimado
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-700">{item.horario}</p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-[#ebf1e2] bg-white p-4">
        <p className="text-sm font-semibold text-[#33561a]">Observaciones</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {item.observaciones || "Sin observaciones adicionales por el momento."}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        {nextLabel ? (
          <span className="inline-flex items-center gap-2 rounded-full bg-[#f2f8ea] px-3 py-2 text-sm font-medium text-[#4f7a2f]">
            <FiMapPin className="h-4 w-4" />
            Próxima recolección: {nextLabel}
          </span>
        ) : (
          <span className="text-sm text-slate-500">
            No hay una próxima fecha disponible.
          </span>
        )}

        <div className="flex flex-wrap gap-2">
          <Link
            to="/mapa"
            className="inline-flex items-center justify-center rounded-2xl border border-[#cfe1b7] bg-white px-4 py-2 text-sm font-semibold text-[#4c7d26] transition hover:border-[#66a939] hover:text-[#33561a]"
          >
            Ver puntos verdes cercanos
          </Link>
          <Link
            to="/reportes"
            className="inline-flex items-center justify-center rounded-2xl bg-[#66a939] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#5a9732]"
          >
            Crear reporte ambiental
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function Calendar() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBarrio, setSelectedBarrio] = useState("");
  const [selectedType, setSelectedType] = useState("todos");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadItems() {
      setLoading(true);
      setError("");

      try {
        const data = await loadScheduleData();
        if (!cancelled) {
          setItems(data);
        }
      } catch (loadError) {
        console.error("CALENDAR_LOAD_ERROR", loadError);
        if (!cancelled) {
          setError("No pudimos cargar los horarios de recolección en este momento.");
          notifyError("No se pudo cargar el calendario de recolección.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadItems();

    return () => {
      cancelled = true;
    };
  }, []);

  const barrios = useMemo(() => {
    const unique = new Set(items.map((item) => item.barrio));
    return ["", ...Array.from(unique).sort()];
  }, [items]);

  const filteredItems = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchesBarrio = !selectedBarrio || item.barrio === selectedBarrio;
      const matchesType =
        selectedType === "todos" || item.tipo === selectedType;

      const haystack = [
        item.barrio,
        item.tipoLabel,
        item.horario,
        item.observaciones,
        item.dias.join(" "),
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        normalizedSearch.length === 0 || haystack.includes(normalizedSearch);

      return matchesBarrio && matchesType && matchesSearch;
    });
  }, [items, search, selectedBarrio, selectedType]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <SectionHero
        eyebrow="Calendario de recolección"
        title="Consultá días y horarios según tu barrio"
        description="Consultá los horarios de recolección diferenciada disponibles para tu zona. Podés filtrar por barrio o por tipo de residuo para ubicar mejor la información que necesitás."
      />

      <section className="mt-8 rounded-[30px] border border-[#e1ecd2] bg-white p-4 shadow-sm sm:p-6">
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr_1fr]">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Buscar por barrio
            </span>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Ejemplo: Centro, San Benito"
                className="w-full rounded-2xl border border-[#d9e7ca] bg-[#fbfdf8] py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#66a939] focus:ring-2 focus:ring-[#66a939]/20"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Seleccionar barrio
            </span>
            <select
              value={selectedBarrio}
              onChange={(event) => setSelectedBarrio(event.target.value)}
              className="w-full appearance-none rounded-2xl border border-[#d9e7ca] bg-[#fbfdf8] px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#66a939] focus:ring-2 focus:ring-[#66a939]/20"
            >
              {barrios.map((barrio) => (
                <option key={barrio || "todos"} value={barrio}>
                  {barrio || "Todos los barrios"}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Filtrar por tipo
            </span>
            <select
              value={selectedType}
              onChange={(event) => setSelectedType(event.target.value)}
              className="w-full appearance-none rounded-2xl border border-[#d9e7ca] bg-[#fbfdf8] px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#66a939] focus:ring-2 focus:ring-[#66a939]/20"
            >
              {scheduleTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="mt-8">
        {loading ? (
          <LoadingState
            title="Cargando calendario"
            description="Estamos preparando los horarios de recolección por barrio."
          />
        ) : error ? (
          <LoadingState
            title="No pudimos cargar el calendario"
            description={error}
          />
        ) : filteredItems.length === 0 ? (
          <div className="rounded-[30px] border border-dashed border-[#d7e5c5] bg-[#fbfdf8] px-6 py-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef6e4] text-2xl">
              🗓️
            </div>
            <h2 className="mt-4 text-xl font-semibold text-[#203014]">
              No encontramos horarios para ese barrio
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
              Probá con otro barrio, cambiá el tipo de residuo o limpiá la
              búsqueda para volver a ver todos los cronogramas disponibles.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedBarrio("");
                setSelectedType("todos");
              }}
              className="mt-6 inline-flex items-center justify-center rounded-2xl border border-[#cfe1b7] bg-white px-4 py-3 text-sm font-semibold text-[#4c7d26] transition hover:border-[#66a939] hover:text-[#33561a]"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <>
            <div className="mb-5 flex items-center justify-between gap-4">
              <p className="text-sm text-slate-600">
                {filteredItems.length} horario
                {filteredItems.length === 1 ? "" : "s"} disponible
                {filteredItems.length === 1 ? "" : "s"} para consultar.
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              {filteredItems.map((item) => (
                <ScheduleCard key={item.id} item={item} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
