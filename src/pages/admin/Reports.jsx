import { useEffect, useMemo, useState } from "react";
import { FiPlus, FiMapPin, FiEye, FiTrash2, FiCheck, FiX, FiPlay, FiCheckCircle } from "react-icons/fi";
import { ReportsAPI } from "../../api/api";
import {
  Card, CardHeader, CardBody,
  Button, Th, Td, Input, Select
} from "../../components/ui/Admin-ui";
import AddressAutocomplete from "../../components/AddressAutocomplete";
import { toast } from "react-toastify";

/* ---------- helpers visuales específicos de Reportes ---------- */
const ESTADOS = [
  { value: "", label: "Todos" },
  // Moderación
  { value: "pending", label: "Pendiente" },
  { value: "approved", label: "Aprobado" },
  { value: "rejected", label: "Rechazado" },
  // Operativo
  { value: "en_progreso", label: "En progreso" },
  { value: "resuelto", label: "Resuelto" },
];

const SEVERIDADES = [
  { value: "", label: "Todas" },
  { value: "baja", label: "Baja" },
  { value: "media", label: "Media" },
  { value: "alta", label: "Alta" },
];

function EstadoBadge({ state }) {
  const map = {
    pending: "bg-amber-100 text-amber-700",
    approved: "bg-emerald-100 text-emerald-700",
    rejected: "bg-rose-100 text-rose-700",
    en_progreso: "bg-blue-100 text-blue-700",
    resuelto: "bg-emerald-100 text-emerald-700",
  };
  const txt = {
    pending: "Pendiente",
    approved: "Aprobado",
    rejected: "Rechazado",
    en_progreso: "En progreso",
    resuelto: "Resuelto",
  }[state] || state;
  return <span className={`inline-flex px-2 py-1 rounded-full text-xs ${map[state] || "bg-gray-100 text-gray-700"}`}>{txt}</span>;
}

const WEEKDAYS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const fmtFecha = (iso) => {
  if (!iso) return "-";
  const d = new Date(iso);
  return `${WEEKDAYS[d.getDay()]} ${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
};

/* ------------------------------------------------------------- */

export default function AdminReports() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);

  // filtros
  const [q, setQ] = useState("");
  const [barrio, setBarrio] = useState("");
  const [estado, setEstado] = useState("");
  const [severidad, setSeveridad] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await ReportsAPI.list();
        setItems(data.items ?? data);
      } catch (e) {
        console.error(e);
        toast.error("No se pudieron cargar los reportes.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const barrios = useMemo(() => {
    const set = new Set((items || []).map(r => r.barrio).filter(Boolean));
    return ["", ...Array.from(set).sort()];
  }, [items]);

  const rows = useMemo(() => {
    return (items || []).filter(r => {
      const okBarrio = !barrio || r.barrio === barrio;
      const okSev = !severidad || r.severidad === severidad;
      let okEstado = true;
      if (estado) {
        const esModeracion = ["pending", "approved", "rejected"].includes(estado);
        okEstado = esModeracion
          ? (r.status === estado)
          : (r.estado === estado && r.estado !== "abierto");
      }
      const txt = `${r._id} ${r.title} ${r.descripcion} ${r.direccion} ${r.barrio}`.toLowerCase();
      const okQ = !q || txt.includes(q.toLowerCase());
      return okBarrio && okEstado && okSev && okQ;
    });
  }, [items, q, barrio, estado, severidad]);

  /* -------- acciones: actualización optimista -------- */
  async function updateStatus(id, status) {
    const prev = items;
    const verbo = status === "approved" ? "Aprobando" : status === "rejected" ? "Rechazando" : "Actualizando";
    setItems(prev.map(r => r._id === id ? { ...r, status } : r));
    try {
    await toast.promise(
      ReportsAPI.setStatus(id, status),
      {
        pending: `${verbo} reporte…`,
        success: status === "approved"
          ? "Reporte aprobado. Ahora podés pasarlo a En progreso o marcarlo Resuelto."
          : "Reporte rechazado.",
        error: "No se pudo actualizar el estado de moderación.",
      }
    );
  } catch (e) {
    console.error(e);
    setItems(prev); // rollback
  }
}

  async function moveToOperational(id, op) {
    // op: "en_progreso" | "resuelto"
    const prev = items;
    const label = op === "en_progreso" ? "En progreso" : "Resuelto";

    setItems(prev.map(r => r._id === id ? { ...r, estado: op } : r));
     try {
    await toast.promise(
      ReportsAPI.setEstado(id, op),
      {
        pending: `Marcando como ${label}…`,
        success: `Reporte marcado como ${label}.`,
        error: "No se pudo actualizar el estado operativo.",
      }
    );
  } catch (e) {
    console.error(e);
    setItems(prev); // rollback
  }
}

  async function removeReport(id) {
    if (!confirm("¿Eliminar este reporte?")) return;

    const prev = items;
    setItems(prev.filter(r => r._id !== id));
      try {
    await toast.promise(
      ReportsAPI.remove(id),
      {
        pending: "Eliminando reporte…",
        success: "Reporte eliminado.",
        error: "No se pudo eliminar el reporte.",
      }
    );
  } catch (e) {
    console.error(e);
    setItems(prev); // rollback
  }
}
  async function createReport(payload) {
   try {
    const created = await toast.promise(
      ReportsAPI.create(payload),
      {
        pending: "Creando reporte…",
        success: "Reporte creado. Quedará pendiente de aprobación.",
        error: "No se pudo crear el reporte.",
      }
    );
    setItems((cur) => [created, ...cur]);
  } catch (e) {
    console.error(e);
  }
}

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Reportes</h1>
          <p className="text-slate-500 mt-1">Aprobá o rechazá reportes entrantes, y gestioná su resolución.</p>
        </div>
        <Button variant="primary" onClick={() => setOpenForm(true)}>
          <FiPlus className="w-5 h-5" /> Nuevo reporte
        </Button>
      </div>

      <Card>
        <CardHeader
          title="Listado de reportes"
          action={<Button variant="ghost" onClick={() => { setQ(""); setBarrio(""); setEstado(""); setSeveridad(""); toast.info("Filtros restablecidos.");}}>Limpiar filtros</Button>}
        />
        <CardBody>
          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-5">
            <Input placeholder="Buscar (ID, título, dirección…)" value={q} onChange={(e) => setQ(e.target.value)} />
            <Select value={barrio} onChange={(e) => setBarrio(e.target.value)}>
              {barrios.map(b => <option key={b || "all"} value={b}>{b || "Todos los barrios"}</option>)}
            </Select>
            <Select value={estado} onChange={(e) => setEstado(e.target.value)}>
              {ESTADOS.map(o => <option key={o.value || "all"} value={o.value}>{o.label}</option>)}
            </Select>
            <Select value={severidad} onChange={(e) => setSeveridad(e.target.value)}>
              {SEVERIDADES.map(o => <option key={o.value || "all"} value={o.value}>{o.label}</option>)}
            </Select>
            <div className="hidden lg:block" />
          </div>

          {/* Tabla */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#0f8237]/10 text-[#2d3d33]">
                <tr className="text-left">
                  <Th>ID</Th>
                  <Th>Título</Th>
                  <Th>Barrio</Th>
                  <Th>Severidad</Th>
                  <Th>Estado</Th>
                  <Th>Fecha</Th>
                  <Th className="w-[360px]">Acciones</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading && (
                  <tr>
                    <Td colSpan={7} className="py-8 text-center text-gray-500">Cargando…</Td>
                  </tr>
                )}
                {!loading && rows.map((r) => (
                  <tr key={r._id} className="hover:bg-gray-50/60">
                    <Td className="font-medium text-[#2d3d33]">{r._id?.slice(-6)}</Td>
                    <Td className="max-w-[280px]">
                      <div className="font-medium text-[#2d3d33] truncate">{r.title || r.titulo}</div>
                      <div className="text-xs text-gray-500 truncate">{r.direccion}</div>
                    </Td>
                    <Td>{r.barrio || "-"}</Td>
                    <Td className="text-gray-700 capitalize">{r.severidad || "-"}</Td>
                    <Td>
                      <div className="flex flex-col items-start gap-1">
                        {/* Moderación siempre visible */}
                        <EstadoBadge state={r.status} />
                        {/* Operativo solo si está aprobado */}
                        {r.status === "approved" && r.estado && r.estado !== "abierto" && (
                          <EstadoBadge state={r.estado} />
                        )}
                      </div>
                    </Td>
                    <Td className="text-gray-600">{fmtFecha(r.createdAt || r.fecha)}</Td>
                    <Td>
                      <div className="flex flex-wrap items-center gap-2">
                        {r.status === "pending" ? (
                          // ── PENDIENTE: solo Ver + Aprobar/Rechazar
                          <>
                            <Button variant="ghost" className="h-8 px-2 py-1">
                              <FiEye className="w-4 h-4" /> Ver
                            </Button>

                            <Button className="h-8 px-2 py-1" variant="primary" onClick={() => updateStatus(r._id, "approved")}>
                              <FiCheck className="w-4 h-4" /> Aprobar
                            </Button>
                            <Button className="h-8 px-2 py-1" variant="danger" onClick={() => updateStatus(r._id, "rejected")}>
                              <FiX className="w-4 h-4" /> Rechazar
                            </Button>
                          </>
                        ) : (
                          // ── NO PENDIENTE: Mapa + Ver + (operativo si aprobado) + Eliminar
                          <>
                            <Button variant="ghost" className="h-8 px-2 py-1">
                              <FiMapPin className="w-4 h-4" /> Mapa
                            </Button>
                            <Button variant="ghost" className="h-8 px-2 py-1">
                              <FiEye className="w-4 h-4" /> Ver
                            </Button>

                            {r.status === "approved" && r.estado !== "resuelto" && (
                              <>
                                {r.estado !== "en_progreso" && (
                                  <Button className="h-8 px-2 py-1" variant="ghost" onClick={() => moveToOperational(r._id, "en_progreso")}>
                                    <FiPlay className="w-4 h-4" /> En progreso
                                  </Button>
                                )}
                                <Button className="h-8 px-2 py-1" variant="primary" onClick={() => moveToOperational(r._id, "resuelto")}>
                                  <FiCheckCircle className="w-4 h-4" /> Resuelto
                                </Button>
                              </>
                            )}

                            <Button
                              variant="danger"
                              className="h-8 px-2 py-1"
                              onClick={() => { if (confirm("¿Eliminar este reporte?")) removeReport(r._id); }}
                            >
                              <FiTrash2 className="w-4 h-4" /> Eliminar
                            </Button>
                          </>
                        )}
                      </div>
                    </Td>

                  </tr>
                ))}
                {!loading && rows.length === 0 && (
                  <tr>
                    <Td colSpan={7} className="py-10 text-center text-gray-500">
                      No hay reportes con los filtros actuales.
                    </Td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* Panel lateral: crear nuevo reporte */}
      {openForm && (
        <SidePanel
          onClose={() => setOpenForm(false)}
          onCreate={async (payload) => {
            await createReport(payload);
            setOpenForm(false);
          }}
        />
      )}
    </div>
  );
}

/* ---------- Panel lateral para “Nuevo reporte” ---------- */
function SidePanel({ onClose, onCreate }) {
  const [form, setForm] = useState({
    title: "",
    barrio: "",
    direccion: "",
    severidad: "baja",
    descripcion: "",
    lat: "",
    lng: "",
  });
  const [saving, setSaving] = useState(false);

  function setField(k, v) { setForm(prev => ({ ...prev, [k]: v })); }

  async function submit() {
    if (!form.title || !form.direccion) {
      toast.warn("Completá al menos Título y Dirección.");
      return;
    }
    try {
      setSaving(true);
      // El backend que mostraste acepta create(payload) con campos libres + (opcional) foto
      await onCreate({
        titulo: form.title,
        barrio: form.barrio,
        direccion: form.direccion,
        severidad: form.severidad,
        descripcion: form.descripcion,
        lat: form.lat,
        lng: form.lng,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl p-6 overflow-y-auto">
        <h3 className="text-xl font-semibold text-[#2d3d33]">Nuevo reporte</h3>
        <p className="text-gray-500 mb-4">Cargá un reporte manualmente.</p>

        <label className="block mb-3">
          <span className="block text-sm text-gray-500 mb-1">Título</span>
          <Input value={form.title} onChange={(e) => setField("title", e.target.value)} placeholder="Ej: Residuos en vereda" />
        </label>
        <label className="block mb-3">
          <span className="block text-sm text-gray-500 mb-1">Barrio</span>
          <Input value={form.barrio} onChange={(e) => setForm(f => ({ ...f, barrio: e.target.value }))}
            placeholder="Ej: Centro"
          />
        </label>
        <label className="block mb-3">
          <span className="block text-sm text-gray-500 mb-1">Dirección</span>
          <AddressAutocomplete
            value={form.direccion}
            onChange={(text) => setField("direccion", text)}
            onSelect={(item) => {
              setField("direccion", item.label);
              setField("lat", item.lat);
              setField("lng", item.lon);
              // 👇 No seteamos el barrio: lo escribe la persona a mano
            }}
            city="Río Gallegos"
            countryCodes="ar"
          />
        </label>

        <label className="block mb-3">
          <span className="block text-sm text-gray-500 mb-1">Severidad</span>
          <Select value={form.severidad} onChange={(e) => setField("severidad", e.target.value)}>
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </Select>
        </label>
        <label className="block mb-4">
          <span className="block text-sm text-gray-500 mb-1">Descripción</span>
          <textarea rows={3} className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0f8237]/30"
            value={form.descripcion} onChange={(e) => setField("descripcion", e.target.value)} />
        </label>

        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" onClick={submit} disabled={saving}>
            {saving ? "Guardando…" : "Crear reporte"}
          </Button>
        </div>
      </div>
    </div>
  );
}
