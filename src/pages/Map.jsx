// import { useState, useEffect } from 'react';
// import MapLeaflet from '../components/MapLeaflet';
// import mockPoints from "../constants/mockPoints";

// export default function Map() {
//    const [points, setPoints] = useState([]);
//   const [type, setType] = useState("");

//   useEffect(() => {
//     // Filtro local con mockPoints
//     const filtered = type
//       ? mockPoints.filter((p) => p.types.includes(type))
//       : mockPoints;
//     setPoints(filtered);
//   }, [type]);

//   return (
//     <div className="mx-auto max-w-7xl px-6 md:px-8 py-8">
//       <div className="flex items-center gap-3 mb-4">
//         <h2 className="text-center pb-4 titlesecond">Mapa de Puntos Verdes</h2>
//         <select
//           value={type}
//           onChange={e => setType(e.target.value)}
//           className="border rounded-md px-3 py-2"
//         >
//           <option value="">Todos</option>
//           <option value="plastico">Plástico</option>
//           <option value="vidrio">Vidrio</option>
//           <option value="papel">Papel/Cartón</option>
//           <option value="pilas">Pilas</option>
//           <option value="aceite">Aceite usado</option>
//         </select>
//       </div>
//       <MapLeaflet points={points} />
//     </div>
//   );
// }

import { useEffect, useMemo, useState } from "react";
import { FiSearch, FiPlus } from "react-icons/fi";
import MapLeaflet from "../components/MapLeaflet";
import mockPoints from "../constants/mockPoints";

export default function Map() {
  const [type, setType] = useState("");
  const [barrio, setBarrio] = useState("");
  const [estado, setEstado] = useState("");
  const [q, setQ] = useState("");

  const barrios = useMemo(() => {
    const set = new Set();
    mockPoints.forEach((p) => p.barrio && set.add(p.barrio));
    return ["", ...Array.from(set).sort()];
  }, []);

  const points = useMemo(() => {
    return mockPoints.filter((p) => {
      const okType   = !type   || (p.types || []).includes(type);
      const okBarrio = !barrio || p.barrio === barrio;
      const okEstado = !estado || (p.estado || "activo") === estado;
      const hayQ     = ((p.title || p.name || "") + " " + (p.address || "")).toLowerCase();
      const okQ      = !q || hayQ.includes(q.toLowerCase());
      return okType && okBarrio && okEstado && okQ;
    });
  }, [type, barrio, estado, q]);

  return (
    <div className="mx-auto max-w-7xl px-6 md:px-8 py-8">
      {/* Título */}
      <header className="mb-6">
        <h1 className="titlesecond">Mapa de Puntos Verdes</h1>
        <p className="text-gray-500 mt-2">Encontrá centros de reciclaje y reportá mini basurales en tu barrio.</p>
      </header>

      {/* --- LAYOUT 2 COLUMNAS --- */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Sidebar filtros */}
        <aside className="md:col-span-4">
          <div className="sticky top-24 rounded-2xl border border-gray-100 bg-white shadow-sm p-4 space-y-4">
            {/* Búsqueda */}
            <label className="block">
              <span className="block text-sm text-gray-500 mb-1">Buscar</span>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Nombre o dirección…"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0f8237]/30"
                />
              </div>
            </label>

            <Select
              label="Barrio"
              value={barrio}
              onChange={setBarrio}
              options={barrios.map((b) => ({ value: b, label: b || "Todos" }))}
            />
            <Select
              label="Tipo de material"
              value={type}
              onChange={setType}
              options={[
                { value: "", label: "Todos" },
                { value: "plastico", label: "Plástico" },
                { value: "vidrio", label: "Vidrio" },
                { value: "papel", label: "Papel/Cartón" },
                { value: "pilas", label: "Pilas" },
                { value: "aceite", label: "Aceite usado" },
              ]}
            />
            <Select
              label="Estado del punto"
              value={estado}
              onChange={setEstado}
              options={[
                { value: "", label: "Todos" },
                { value: "activo", label: "Activo" },
                { value: "inactivo", label: "Temporalmente inactivo" },
              ]}
            />
          </div>
        </aside>

        {/* Mapa */}
        <section className="md:col-span-8 !py-0">
          <div className="relative rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
            {/* Contenedor absoluto para que los overlays queden arriba */}
            <div className="relative h-[70vh] min-h-[520px]">
              {/* Mapa en z-0 */}
              <div className="absolute inset-0 z-0">
                <MapLeaflet points={points} />
              </div>

              {/* Leyenda y FAB en z-20 para que no los tape Leaflet */}
              <div className="absolute bottom-4 right-4 z-20">
                <Legend />
              </div>

              <button
                type="button"
                className="absolute bottom-4 left-4 z-20 inline-flex items-center gap-2 px-4 py-2 rounded-xl shadow-md bg-[#0f8237] text-white hover:bg-[#0d6f2f] transition"
                onClick={() => alert("Ir a crear reporte")}
                aria-label="Nuevo reporte"
              >
                <FiPlus className="w-5 h-5" />
                Nuevo reporte
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ---------- helpers ---------- */
function Select({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="block text-sm text-gray-500 mb-1">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-[#0f8237]/30"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg fill='%23727272' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath d='M5.5 7.5l4.5 4.5 4.5-4.5'/%3E%3C/svg%3E\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right .6rem center",
          backgroundSize: "1rem 1rem",
        }}
      >
        {options.map((o) => (
          <option key={o.value || "all"} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function Legend() {
  const Item = ({ color, label }) => (
    <div className="flex items-center gap-2">
      <span
        className="inline-flex w-5 h-5 rounded-md border border-black/10"
        style={{ background: color }}
      />
      <span className="text-sm text-gray-600">{label}</span>
    </div>
  );
  return (
    <div className="rounded-xl bg-white/90 backdrop-blur border border-gray-100 shadow p-3 space-y-2">
      <Item color="#E6F8EE" label="Plástico" />
      <Item color="#EAF4FF" label="Vidrio" />
      <Item color="#FFF6E6" label="Papel/Cartón" />
      <Item color="#FCE9EF" label="Pilas" />
      <Item color="#EEF6FF" label="Aceite" />
      <div className="h-px bg-gray-100 my-1" />
      <Item color="#FFE9D9" label="Reporte" />
    </div>
  );
}
