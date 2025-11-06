import { useMemo, useState } from "react";
import { scheduleData } from "../constants/scheduleData.js";
import { FiSearch, FiCalendar } from "react-icons/fi";

// utilidad simple: próximo día desde hoy según lista de días
const weekOrder = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
function proximoDiaLabel(dias = []) {
  const hoy = new Date().getDay(); // 0..6
  let minDiff = 8, diaProx = null;
  dias.forEach(d => {
    const idx = weekOrder.indexOf(d);
    if (idx >= 0) {
      const diff = (idx - hoy + 7) % 7;
      if (diff < minDiff) { minDiff = diff; diaProx = d; }
    }
  });
  if (diaProx == null) return null;
  return minDiff === 0 ? "Hoy" : (minDiff === 1 ? "Mañana" : diaProx);
}

export default function Schedule() {
  const [barrio, setBarrio] = useState("");
  const [q, setQ] = useState("");

  const barrios = useMemo(() => {
    const set = new Set(scheduleData.map(s => s.barrio));
    return ["", ...Array.from(set).sort()];
  }, []);

  const rows = useMemo(() => {
    return scheduleData.filter(r => {
      const okBarrio = !barrio || r.barrio === barrio;
      const text = `${r.barrio} ${r.dias.join(" ")} ${r.horario1} ${r.horario2}`.toLowerCase();
      const okQ = !q || text.includes(q.toLowerCase());
      return okBarrio && okQ;
    });
  }, [barrio, q]);

  return (
    <div className="mx-auto max-w-7xl px-6 md:px-8 py-10">
      {/* Header */}
      <header className="mb-6">
        <h1 className="titlesecond">
          Horarios de Recolección por Barrios
        </h1>
        <p className="text-gray-500 mt-2">
          Encontrá el día y horario en tu zona.
        </p>
      </header>

      {/* GRID: sidebar + tabla */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Sidebar filtros */}
        <aside className="md:col-span-4">
          <div className="sticky top-24 rounded-2xl border border-gray-100 bg-white shadow-sm p-4 space-y-4">
            <label className="block">
              <span className="block text-sm text-gray-500 mb-1">Buscar</span>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Barrio, día u horario…"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0f8237]/30"
                />
              </div>
            </label>

            <label className="block">
              <span className="block text-sm text-gray-500 mb-1">Filtrar por Barrio</span>
              <select
                value={barrio}
                onChange={(e) => setBarrio(e.target.value)}
                className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-[#0f8237]/30"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg fill='%23727272' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath d='M5.5 7.5l4.5 4.5 4.5-4.5'/%3E%3C/svg%3E\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right .6rem center",
                  backgroundSize: "1rem 1rem",
                }}
              >
                {barrios.map((b, i) => (
                  <option key={i} value={b}>{b || "Todos"}</option>
                ))}
              </select>
            </label>

            <div className="text-xs text-gray-500">
              Consejo: si cambiás de domicilio, podés guardar tu barrio preferido en tu perfil.
            </div>
          </div>
        </aside>

        {/* Tabla */}
        <section className="md:col-span-8 !py-0">
          <div className="rounded-2xl border border-gray-100 shadow-sm bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-[#0f8237]/10 text-[#2d3d33]">
                  <tr className="text-left">
                    <Th>Barrio</Th>
                    <Th>Días y Recolección</Th>
                    <Th>Horario Estimado</Th>
                    <Th className="w-28">Próximo</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rows.map((r) => {
                    const prox = proximoDiaLabel(r.dias);
                    return (
                      <tr key={r.id} className="hover:bg-gray-50/60">
                        <Td>{r.barrio}</Td>
                        <Td>
                          <span className="text-[#2d3d33]">{r.dias.join(", ")}</span>
                        </Td>
                        <Td>{r.horario1}</Td>
                        <Td>
                          {prox && (
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs
                              ${prox === "Hoy" ? "bg-emerald-100 text-emerald-700" :
                                 prox === "Mañana" ? "bg-amber-100 text-amber-700" :
                                 "bg-gray-100 text-gray-700"}`}>
                              <FiCalendar className="w-4 h-4" />
                              {prox}
                            </span>
                          )}
                        </Td>
                      </tr>
                    );
                  })}
                  {rows.length === 0 && (
                    <tr>
                      <Td colSpan={5} className="text-center py-10 text-gray-500">
                        No se encontraron horarios con los filtros actuales.
                      </Td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Th({ children, className = "" }) {
  return (
    <th className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide ${className}`}>
      {children}
    </th>
  );
}
function Td({ children, className = "", colSpan }) {
  return (
    <td colSpan={colSpan} className={`px-4 py-3 text-gray-700 ${className}`}>
      {children}
    </td>
  );
}
