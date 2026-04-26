import { useEffect, useMemo, useState } from "react";
import {
  FiAlertCircle,
  FiEye,
  FiImage,
  FiMapPin,
  FiPlus,
  FiSearch,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import AddressAutocomplete from "../components/AddressAutocomplete";
import ImageFileField from "../components/ImageFileField";
import Modal from "../components/ui/Modal";
import SectionHero from "../components/ui/SectionHero";
import { ReportsAPI, getAssetUrl, getFriendlyApiError, getToken } from "../api/api";

const ESTADOS = [
  { value: "", label: "Todos" },
  { value: "abierto", label: "Abierto" },
  { value: "en_revision", label: "En revision" },
  { value: "resuelto", label: "Resuelto" },
];

const SEVERIDADES = [
  { value: "", label: "Todas" },
  { value: "baja", label: "Baja" },
  { value: "media", label: "Media" },
  { value: "alta", label: "Alta" },
];

const WEEKDAYS = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];
const PLACEHOLDER_LABEL = "Sin imagen";

function fmtFecha(iso) {
  if (!iso) return "-";
  const date = new Date(iso);
  return `${WEEKDAYS[date.getDay()]} ${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

function getMapUrl(report) {
  const coords = report?.location?.coordinates;
  if (!Array.isArray(coords) || coords.length < 2) return "";
  const [lng, lat] = coords.map(Number);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return "";
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

function getEstadoMeta(state) {
  const meta = {
    abierto: {
      label: "Abierto",
      className: "bg-rose-100 text-rose-700",
      title: "El reporte fue recibido y esta esperando atencion.",
    },
    en_revision: {
      label: "En revision",
      className: "bg-amber-100 text-amber-700",
      title: "El reporte esta siendo evaluado por el equipo.",
    },
    resuelto: {
      label: "Resuelto",
      className: "bg-emerald-100 text-emerald-700",
      title: "El reporte ya fue resuelto.",
    },
  };

  return meta[state] || {
    label: state || "Sin estado",
    className: "bg-gray-100 text-gray-700",
    title: "",
  };
}

function getSeverityMeta(level) {
  const meta = {
    baja: "bg-gray-100 text-gray-700",
    media: "bg-amber-100 text-amber-700",
    alta: "bg-red-100 text-red-700",
  };

  return meta[level] || "bg-gray-100 text-gray-700";
}

function getPrimaryImage(report) {
  return report?.fotos?.[0] ? getAssetUrl(report.fotos[0]) : "";
}

function isFiniteCoordinate(value) {
  return Number.isFinite(Number(value));
}

function getDetailReport(report) {
  const estadoMeta = getEstadoMeta(report?.estado);
  return {
    ...report,
    createdAtLabel: fmtFecha(report?.createdAt),
    estadoLabel: estadoMeta.label,
  };
}

function openMap(report) {
  const mapUrl = getMapUrl(report);
  if (!mapUrl) {
    toast.error("Este reporte no tiene ubicacion disponible.");
    return;
  }

  window.open(mapUrl, "_blank", "noopener,noreferrer");
}

function validateReportForm(form) {
  const errors = {};
  const titulo = form.titulo?.trim() || "";
  const direccion = form.direccion?.trim() || "";
  const descripcion = form.descripcion?.trim() || "";
  const barrio = form.barrio?.trim() || "";
  const hasAnyCoord = form.lat !== "" || form.lng !== "";
  const hasValidCoords = isFiniteCoordinate(form.lat) && isFiniteCoordinate(form.lng);

  if (!titulo) {
    errors.titulo = "Ingresa un titulo para identificar el reporte.";
  } else if (titulo.length < 6) {
    errors.titulo = "El titulo necesita al menos 6 caracteres.";
  }

  if (!direccion) {
    errors.direccion = "Ingresa una direccion o selecciona una sugerencia.";
  } else if (direccion.length < 5) {
    errors.direccion = "La direccion es demasiado corta.";
  }

  if (!descripcion) {
    errors.descripcion = "Agrega una descripcion breve del problema.";
  } else if (descripcion.length < 12) {
    errors.descripcion = "La descripcion necesita un poco mas de detalle.";
  }

  if (barrio && barrio.length < 3) {
    errors.barrio = "Si completas el barrio, usa al menos 3 caracteres.";
  }

  if (hasAnyCoord && !hasValidCoords) {
    errors.ubicacion = "La ubicacion seleccionada no es valida. Vuelve a elegir la direccion.";
  }

  return errors;
}

export default function Reports() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [barrio, setBarrio] = useState("");
  const [estado, setEstado] = useState("");
  const [severidad, setSeveridad] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const isLoggedIn = !!getToken();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await ReportsAPI.list({ status: "approved" });
        setItems((data?.items ?? data) || []);
      } catch (e) {
        console.error(e);
        setError("No se pudieron cargar los reportes comunitarios.");
        toast.error("No se pudieron cargar los reportes.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const barrios = useMemo(() => {
    const set = new Set(items.map((report) => report.barrio).filter(Boolean));
    return ["", ...Array.from(set).sort()];
  }, [items]);

  const rows = useMemo(() => {
    return items.filter((report) => {
      const okBarrio = !barrio || report.barrio === barrio;
      const okEstado = !estado || report.estado === estado;
      const okSeveridad = !severidad || report.severidad === severidad;
      const text = `${report.code || report._id} ${report.titulo || ""} ${report.direccion || ""} ${report.barrio || ""}`.toLowerCase();
      const okQ = !q || text.includes(q.toLowerCase());
      return okBarrio && okEstado && okSeveridad && okQ;
    });
  }, [items, q, barrio, estado, severidad]);

  function clearFilters() {
    setQ("");
    setBarrio("");
    setEstado("");
    setSeveridad("");
  }

  function handleNewReportClick() {
    if (!isLoggedIn) return;
    setOpenForm(true);
  }

  function handleCreated(report) {
    if (report?.status === "approved") {
      setItems((current) => [report, ...current]);
    }
  }

  const hasFilters = Boolean(q || barrio || estado || severidad);
  const emptyMessage = error
    || (items.length === 0
      ? "No hay reportes para mostrar."
      : "No se encontraron resultados con estos filtros.");

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 md:px-8">
      <SectionHero
        eyebrow="Participación ciudadana"
        title="Reportes Comunitarios"
        description="Consultá reportes aprobados y ayudá a identificar mini basurales o problemas ambientales en Río Gallegos."
        className="mb-6"
        actions={
          isLoggedIn ? (
            <button
              onClick={handleNewReportClick}
              className="buttonprimary inline-flex w-full items-center justify-center gap-2 self-start rounded-2xl px-5 py-3 lg:w-auto"
            >
              <FiPlus className="h-5 w-5" />
              Nuevo reporte
            </button>
          ) : (
            <div className="rounded-3xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-800 shadow-sm">
              <p className="font-medium">Necesitás iniciar sesión para crear un reporte.</p>
              <Link
                to="/login?next=/reportes"
                className="mt-3 inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 font-medium text-amber-900 shadow-sm ring-1 ring-amber-200 transition hover:bg-amber-100"
              >
                Ingresar para reportar
              </Link>
            </div>
          )
        }
      >
        <div className="flex flex-wrap gap-2">
          <SummaryPill label="Reportes visibles" value={rows.length} tone="green" />
          <SummaryPill label="Filtros activos" value={hasFilters ? "Sí" : "No"} tone="slate" />
        </div>
        <div className="mt-4 rounded-2xl border border-[#d6e8cf] bg-white/80 px-4 py-3 text-sm text-slate-600">
          Los puntos de gamificación se asignan cuando un administrador valida tu reporte.
        </div>
      </SectionHero>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <aside className="md:col-span-4">
          <div className="sticky top-24 space-y-4 rounded-3xl border border-[#dce8dd] bg-white/95 p-5 shadow-[0_18px_50px_-28px_rgba(15,130,55,0.35)] backdrop-blur">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#66a939]">Filtrar reportes</p>
              <p className="mt-1 text-sm text-gray-500">Ajusta la busqueda por barrio, estado o severidad.</p>
            </div>

            <label className="block">
              <span className="mb-1 block text-sm text-gray-500">Buscar</span>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Titulo o direccion..."
                  className="w-full rounded-2xl border border-gray-200 bg-slate-50/70 py-3 pl-10 pr-3 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f8237]/30"
                />
              </div>
            </label>

            <Select
              label="Barrio"
              value={barrio}
              onChange={setBarrio}
              options={barrios.map((value) => ({ value, label: value || "Todos" }))}
            />
            <Select label="Estado" value={estado} onChange={setEstado} options={ESTADOS} />
            <Select label="Severidad" value={severidad} onChange={setSeveridad} options={SEVERIDADES} />

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="w-full rounded-2xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </aside>

        <section className="section md:col-span-8 !py-0">
          <div className="overflow-hidden rounded-3xl border border-[#dce8dd] bg-white shadow-[0_18px_50px_-30px_rgba(15,130,55,0.35)]">
            <div className="border-b border-[#edf3ed] bg-gradient-to-r from-[#f3f9f1] via-white to-[#f8fcf7] px-5 py-4">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-base font-semibold text-[#2d3d33]">Listado publico</h2>
                  <p className="text-sm text-slate-500">Reportes aprobados listos para consulta ciudadana.</p>
                </div>
                <span className="inline-flex w-fit items-center rounded-full bg-[#0f8237]/10 px-3 py-1 text-xs font-semibold text-[#0f8237]">
                  {rows.length} resultados
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-[#0f8237]/10 text-[#2d3d33]">
                  <tr className="text-left">
                    <Th>Imagen</Th>
                    <Th>Barrio</Th>
                    <Th>Direccion</Th>
                    <Th>Severidad</Th>
                    <Th>Estado</Th>
                    <Th>Fecha</Th>
                    <Th className="w-40">Acciones</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading && <LoadingRows colSpan={7} />}

                  {!loading && rows.map((report) => (
                    <tr key={report._id} className="transition hover:bg-[#f7fbf6]">
                      <Td>
                        <ReportThumb report={report} />
                      </Td>
                      <Td>{report.barrio || "-"}</Td>
                      <Td className="text-gray-600">{report.direccion || "-"}</Td>
                      <Td>
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getSeverityMeta(report.severidad)}`}>
                          {report.severidad || "-"}
                        </span>
                      </Td>
                      <Td>
                        <StatusBadge state={report.estado} />
                      </Td>
                      <Td className="text-gray-600">{fmtFecha(report.createdAt)}</Td>
                      <Td>
                        <div className="flex flex-wrap items-center gap-2">
                          <ActionButton icon={FiMapPin} onClick={() => openMap(report)}>
                            Ver en mapa
                          </ActionButton>
                          <ActionButton icon={FiEye} onClick={() => setSelectedReport(report)}>
                            Ver detalle
                          </ActionButton>
                        </div>
                      </Td>
                    </tr>
                  ))}

                  {!loading && rows.length === 0 && (
                    <tr>
                      <Td colSpan={7} className="px-0 py-0">
                        <EmptyStatePanel
                          title={items.length === 0 ? "Todavia no hay reportes visibles" : "No encontramos coincidencias"}
                          message={emptyMessage}
                          action={hasFilters ? (
                            <button
                              type="button"
                              onClick={clearFilters}
                              className="rounded-2xl border border-gray-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-gray-50"
                            >
                              Limpiar filtros
                            </button>
                          ) : null}
                        />
                      </Td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>

      {openForm && (
        <CreateReportPanel onClose={() => setOpenForm(false)} onCreated={handleCreated} />
      )}

      {selectedReport && (
        <ReportDetailDialog report={getDetailReport(selectedReport)} onClose={() => setSelectedReport(null)} />
      )}
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-gray-500">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-2xl border border-gray-200 bg-white px-3 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-[#0f8237]/30"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg fill='%23727272' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath d='M5.5 7.5l4.5 4.5 4.5-4.5'/%3E%3C/svg%3E\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right .6rem center",
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

function Th({ children, className = "" }) {
  return <th className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide ${className}`}>{children}</th>;
}

function Td({ children, className = "", colSpan }) {
  return <td colSpan={colSpan} className={`px-4 py-3 text-gray-700 ${className}`}>{children}</td>;
}

function StatusBadge({ state }) {
  const meta = getEstadoMeta(state);
  return (
    <span title={meta.title} className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${meta.className}`}>
      {meta.label}
    </span>
  );
}

function ActionButton({ icon, children, disabled = false, onClick }) {
  const IconComponent = icon;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:-translate-y-0.5 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {IconComponent ? <IconComponent className="h-4 w-4" /> : null}
      {children}
    </button>
  );
}

function ReportThumb({ report }) {
  const imageUrl = getPrimaryImage(report);

  if (!imageUrl) {
    return (
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-slate-400">
        <FiImage className="h-5 w-5" />
      </div>
    );
  }

  return <img src={imageUrl} alt={report.titulo || "Reporte"} className="h-14 w-14 rounded-2xl border border-slate-200 object-cover shadow-sm" />;
}

function CreateReportPanel({ onClose, onCreated }) {
  const [form, setForm] = useState({
    titulo: "",
    barrio: "",
    direccion: "",
    severidad: "baja",
    descripcion: "",
    lat: "",
    lng: "",
    fotos: null,
  });
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState({});

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key] && !(key === "lat" || key === "lng" || prev.ubicacion)) return prev;
      const next = { ...prev };
      delete next[key];
      if (key === "lat" || key === "lng" || key === "direccion") delete next.ubicacion;
      return next;
    });
    if (submitError) setSubmitError("");
  }

  async function submit() {
    const validation = validateReportForm(form);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      setSubmitError("Revisa los campos marcados para poder enviar el reporte.");
      toast.warn("Revisa los campos obligatorios.");
      return;
    }

    try {
      setSaving(true);
      setSubmitError("");
      const created = await ReportsAPI.create(form);
      onCreated?.(created);
      toast.success("Reporte enviado. Quedo pendiente de revision.");
      onClose();
    } catch (error) {
      console.error(error);
      const message = error?.response?.status === 401
        ? "Necesitas iniciar sesion para crear un reporte."
        : getFriendlyApiError(error, "No se pudo crear el reporte.");
      setSubmitError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  const hasSelectedCoordinates = isFiniteCoordinate(form.lat) && isFiniteCoordinate(form.lng);

  return (
    <Modal open onClose={onClose} title="Nuevo reporte" size="lg">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#66a939]">Nuevo reporte</p>
        <p className="mb-5 mt-2 text-sm text-gray-500">Completá los datos y, si podés, agregá una imagen para facilitar la revisión.</p>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          {submitError ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {submitError}
            </div>
          ) : null}

          <Field label="Titulo">
            <input
              value={form.titulo}
              onChange={(e) => setField("titulo", e.target.value)}
              className={`w-full rounded-2xl border px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#0f8237]/30 ${errors.titulo ? "border-rose-300 bg-rose-50/40" : "border-gray-200"}`}
              placeholder="Ej: Residuos acumulados en la esquina"
            />
            {errors.titulo ? <FieldError message={errors.titulo} /> : null}
          </Field>

          <Field label="Barrio">
            <input
              value={form.barrio}
              onChange={(e) => setField("barrio", e.target.value)}
              className={`w-full rounded-2xl border px-3 py-3 ${errors.barrio ? "border-rose-300 bg-rose-50/40" : "border-gray-200"}`}
              placeholder="Ej: Centro"
            />
            {errors.barrio ? <FieldError message={errors.barrio} /> : null}
          </Field>

          <Field label="Direccion">
            <AddressAutocomplete
              value={form.direccion}
              onChange={(text) => {
                setField("direccion", text);
                setField("lat", "");
                setField("lng", "");
              }}
              onSelect={(item) => {
                setField("direccion", item.label);
                setField("lat", item.lat);
                setField("lng", item.lon);
              }}
              city="Rio Gallegos"
              countryCodes="ar"
            />
            {hasSelectedCoordinates ? (
              <div className="mt-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                Ubicacion lista para mapa: lat {Number(form.lat).toFixed(5)}, lng {Number(form.lng).toFixed(5)}
              </div>
            ) : (
              <div className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                Si seleccionas una sugerencia, el reporte quedara vinculado a una ubicacion precisa.
              </div>
            )}
            {errors.direccion ? <FieldError message={errors.direccion} /> : null}
            {errors.ubicacion ? <FieldError message={errors.ubicacion} /> : null}
          </Field>

          <Field label="Severidad">
            <select
              value={form.severidad}
              onChange={(e) => setField("severidad", e.target.value)}
              className="w-full rounded-2xl border border-gray-200 px-3 py-3"
            >
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
            </select>
          </Field>

          <Field label="Descripcion">
            <textarea
              rows={4}
              value={form.descripcion}
              onChange={(e) => setField("descripcion", e.target.value)}
              className={`w-full rounded-2xl border px-3 py-3 ${errors.descripcion ? "border-rose-300 bg-rose-50/40" : "border-gray-200"}`}
              placeholder="Contanos que esta pasando y cualquier detalle util."
            />
            {errors.descripcion ? <FieldError message={errors.descripcion} /> : null}
          </Field>

          <Field label="Foto opcional">
            <ImageFileField
              value={form.fotos}
              onChange={(file) => setField("fotos", file)}
              label="Imagen del reporte"
              helperText="Subi una imagen clara del problema para facilitar la revision."
            />
          </Field>

          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
            Estado inicial: pendiente de revision. Una vez aprobado, el equipo podra trabajarlo como abierto, en revision o resuelto.
          </div>
          <div className="rounded-2xl border border-[#d6e8cf] bg-[#f5fbf2] p-4 text-sm text-slate-600">
            Los puntos se suman solo cuando el reporte es validado por un administrador.
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-2xl border border-gray-200 px-4 py-2.5 font-medium hover:bg-gray-50">
              Cancelar
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={saving}
              className="rounded-2xl bg-[#0f8237] px-4 py-2.5 font-medium text-white transition hover:bg-[#0d6f2f] disabled:opacity-60"
            >
              {saving ? "Enviando..." : "Enviar reporte"}
            </button>
          </div>
        </form>
    </Modal>
  );
}

function FieldError({ message }) {
  return <p className="mt-2 text-xs font-medium text-rose-600">{message}</p>;
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-gray-500">{label}</span>
      {children}
    </label>
  );
}

function ReportDetailDialog({ report, onClose }) {
  const imageUrl = getPrimaryImage(report);

  return (
    <Modal open={!!report} onClose={onClose} title="Detalle del reporte" size="lg">
        <div className="grid gap-0 md:grid-cols-[320px,1fr]">
          <div className="bg-slate-100">
            {imageUrl ? (
              <img src={imageUrl} alt={report.titulo || "Reporte"} className="h-full min-h-[220px] w-full object-cover" />
            ) : (
              <div className="flex h-full min-h-[220px] items-center justify-center text-slate-400">
                <div className="text-center">
                  <FiImage className="mx-auto h-8 w-8" />
                  <p className="mt-2 text-sm">{PLACEHOLDER_LABEL}</p>
                </div>
              </div>
            )}
          </div>

          <div className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#66a939]">Detalle del reporte</p>
                <h3 className="mt-2 text-xl font-semibold text-[#2d3d33]">{report.titulo || "Reporte comunitario"}</h3>
                <p className="mt-1 text-sm text-gray-500">{report.code || report._id}</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <StatusBadge state={report.estado} />
              <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getSeverityMeta(report.severidad)}`}>
                {report.severidad || "Sin severidad"}
              </span>
            </div>

            <dl className="mt-5 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
              <DetailRow label="Barrio" value={report.barrio || "-"} />
              <DetailRow
                label="Usuario creador"
                value={typeof report.user === "object" ? (report.user?.nombre || report.user?.email || "-") : "-"}
              />
              <DetailRow label="Direccion" value={report.direccion || "-"} />
              <DetailRow label="Fecha" value={report.createdAtLabel || fmtFecha(report.createdAt)} />
              <DetailRow label="Descripcion" value={report.descripcion || "Sin descripcion"} fullWidth />
            </dl>

            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => openMap(report)}
                className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:bg-gray-50"
              >
                <FiMapPin className="h-4 w-4" />
                Ver en mapa
              </button>
            </div>
          </div>
        </div>
    </Modal>
  );
}

function DetailRow({ label, value, fullWidth = false }) {
  return (
    <div className={fullWidth ? "sm:col-span-2" : ""}>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm leading-6 text-slate-700">{value}</dd>
    </div>
  );
}

function SummaryPill({ label, value, tone = "green" }) {
  const tones = {
    green: "bg-[#eef7eb] text-[#2f6b22]",
    slate: "bg-slate-100 text-slate-700",
  };

  return (
    <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ${tones[tone] || tones.slate}`}>
      <span>{label}</span>
      <span className="rounded-full bg-white/80 px-2 py-0.5 text-xs font-semibold">{value}</span>
    </div>
  );
}

function LoadingRows({ colSpan }) {
  return (
    <>
      {Array.from({ length: 4 }).map((_, index) => (
        <tr key={`loading-${index}`} className="animate-pulse">
          <Td colSpan={colSpan} className="px-4 py-3">
            <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white px-4 py-4">
              <div className="h-14 w-14 rounded-2xl bg-slate-200" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-4 w-40 rounded-full bg-slate-200" />
                <div className="h-3 w-3/4 rounded-full bg-slate-100" />
              </div>
              <div className="hidden h-8 w-28 rounded-full bg-slate-100 sm:block" />
            </div>
          </Td>
        </tr>
      ))}
    </>
  );
}

function EmptyStatePanel({ title, message, action = null }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#eef7eb] text-[#66a939]">
        <FiAlertCircle className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-[#2d3d33]">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">{message}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
