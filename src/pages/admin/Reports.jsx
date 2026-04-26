import { useEffect, useMemo, useState } from "react";
import {
  FiAlertCircle,
  FiCheck,
  FiCheckCircle,
  FiEye,
  FiImage,
  FiMapPin,
  FiPlus,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import { toast } from "react-toastify";
import AddressAutocomplete from "../../components/AddressAutocomplete";
import ImageFileField from "../../components/ImageFileField";
import RowActionsMenu from "../../components/admin/RowActionsMenu";
import Modal from "../../components/ui/Modal";
import Pagination from "../../components/ui/Pagination";
import { ReportsAPI, getAssetUrl, getFriendlyApiError } from "../../api/api";
import {
  AdminSectionHero,
  Card,
  CardBody,
  CardHeader,
  Button,
  FilterBar,
  ResultCount,
  Th,
  Td,
  Input,
  Select,
} from "../../components/ui/Admin-ui";

const FILTER_OPTIONS = [
  { value: "", label: "Todos los estados" },
  { value: "pending", label: "Pendiente" },
  { value: "approved", label: "Aprobado" },
  { value: "rejected", label: "Rechazado" },
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

function fmtFecha(iso) {
  if (!iso) return "-";
  const date = new Date(iso);
  return `${WEEKDAYS[date.getDay()]} ${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

function getStatusMeta(status) {
  const map = {
    pending: { label: "Pendiente", className: "bg-amber-100 text-amber-700" },
    approved: { label: "Aprobado", className: "bg-emerald-100 text-emerald-700" },
    rejected: { label: "Rechazado", className: "bg-rose-100 text-rose-700" },
  };

  return map[status] || { label: status || "Sin moderacion", className: "bg-gray-100 text-gray-700" };
}

function getEstadoMeta(estado) {
  const map = {
    abierto: { label: "Abierto", className: "bg-rose-100 text-rose-700" },
    en_revision: { label: "En revision", className: "bg-amber-100 text-amber-700" },
    resuelto: { label: "Resuelto", className: "bg-emerald-100 text-emerald-700" },
  };

  return map[estado] || { label: estado || "Sin estado", className: "bg-gray-100 text-gray-700" };
}

function getMapUrl(report) {
  const coords = report?.location?.coordinates;
  if (!Array.isArray(coords) || coords.length < 2) return "";
  const [lng, lat] = coords.map(Number);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return "";
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

function getPrimaryImage(report) {
  return report?.fotos?.[0] ? getAssetUrl(report.fotos[0]) : "";
}

function isFiniteCoordinate(value) {
  return Number.isFinite(Number(value));
}

function validateAdminReportForm(form) {
  const errors = {};
  const titulo = form.titulo?.trim() || "";
  const direccion = form.direccion?.trim() || "";
  const descripcion = form.descripcion?.trim() || "";
  const barrio = form.barrio?.trim() || "";
  const hasAnyCoord = form.lat !== "" || form.lng !== "";
  const hasValidCoords = isFiniteCoordinate(form.lat) && isFiniteCoordinate(form.lng);

  if (!titulo) errors.titulo = "Ingresa un titulo para identificar el reporte.";
  if (!direccion) errors.direccion = "Ingresa una direccion o selecciona una sugerencia.";
  if (!descripcion) errors.descripcion = "Agrega una descripcion breve del problema.";
  if (barrio && barrio.length < 3) errors.barrio = "Si completas el barrio, usa al menos 3 caracteres.";
  if (hasAnyCoord && !hasValidCoords) {
    errors.ubicacion = "La ubicacion seleccionada no es valida. Vuelve a elegir la direccion.";
  }

  return errors;
}

function openMap(report) {
  const mapUrl = getMapUrl(report);
  if (!mapUrl) {
    toast.error("Este reporte no tiene ubicacion disponible.");
    return;
  }

  window.open(mapUrl, "_blank", "noopener,noreferrer");
}

export default function AdminReports() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [barrio, setBarrio] = useState("");
  const [estado, setEstado] = useState("");
  const [severidad, setSeveridad] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportToDelete, setReportToDelete] = useState(null);
  const [actionState, setActionState] = useState({ reportId: "", action: "" });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    void loadReports();
  }, []);

  async function loadReports() {
    try {
      setLoading(true);
      const data = await ReportsAPI.list();
      setItems(data.items ?? data);
    } catch (error) {
      console.error(error);
      toast.error("No se pudieron cargar los reportes.");
    } finally {
      setLoading(false);
    }
  }

  const barrios = useMemo(() => {
    const set = new Set((items || []).map((report) => report.barrio).filter(Boolean));
    return ["", ...Array.from(set).sort()];
  }, [items]);

  const rows = useMemo(() => {
    return (items || []).filter((report) => {
      const okBarrio = !barrio || report.barrio === barrio;
      const okSeveridad = !severidad || report.severidad === severidad;
      let okEstado = true;
      if (estado) {
        if (["pending", "approved", "rejected"].includes(estado)) {
          okEstado = report.status === estado;
        } else {
          okEstado = report.estado === estado;
        }
      }

      const txt = `${report._id} ${report.titulo || ""} ${report.descripcion || ""} ${report.direccion || ""} ${report.barrio || ""}`.toLowerCase();
      const okQ = !q || txt.includes(q.toLowerCase());
      return okBarrio && okEstado && okSeveridad && okQ;
    });
  }, [items, q, barrio, estado, severidad]);

  const paginatedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [rows, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [q, barrio, estado, severidad, pageSize]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [rows.length, page, pageSize]);

  function clearFilters() {
    setQ("");
    setBarrio("");
    setEstado("");
    setSeveridad("");
  }

  function startAction(reportId, action) {
    setActionState({ reportId, action });
  }

  function finishAction() {
    setActionState({ reportId: "", action: "" });
  }

  function isActionRunning(reportId, action = "") {
    if (!actionState.reportId) return false;
    if (actionState.reportId !== reportId) return false;
    return action ? actionState.action === action : true;
  }

  async function updateStatus(id, status) {
    const previous = items;
    startAction(id, status === "approved" ? "approve" : "reject");
    setItems((current) => current.map((report) => (
      report._id === id
        ? { ...report, status, ...(status !== "approved" ? { estado: "abierto" } : {}) }
        : report
    )));

    try {
      const updated = await ReportsAPI.setStatus(id, status);
      const successMessage = updated?.gamification?.message
        || (status === "approved" ? "Reporte aprobado." : "Reporte rechazado.");
      toast.success(successMessage);
      if (updated?.gamification?.awarded === false && status === "approved") {
        toast.info("No se sumaron puntos adicionales para este reporte.");
      }
      setItems((current) => current.map((report) => (report._id === id ? updated : report)));
      if (selectedReport?._id === id) setSelectedReport(updated);
    } catch (error) {
      console.error(error);
      toast.error(getFriendlyApiError(error, "No se pudo actualizar la moderacion."));
      setItems(previous);
    } finally {
      finishAction();
    }
  }

  async function updateOperationalState(id, nextState) {
    const previous = items;
    startAction(id, nextState);
    setItems((current) => current.map((report) => (
      report._id === id ? { ...report, estado: nextState } : report
    )));

    try {
      const updated = await ReportsAPI.setEstado(id, nextState);
      const successMessage = updated?.gamification?.message || "Estado operativo actualizado.";
      toast.success(successMessage);
      if (updated?.gamification?.awarded === false && nextState === "resuelto") {
        toast.info("No se sumaron puntos adicionales para este reporte.");
      }
      setItems((current) => current.map((report) => (report._id === id ? updated : report)));
      if (selectedReport?._id === id) setSelectedReport(updated);
    } catch (error) {
      console.error(error);
      toast.error(getFriendlyApiError(error, "No se pudo actualizar el estado operativo."));
      setItems(previous);
    } finally {
      finishAction();
    }
  }

  async function removeReport(id) {
    const previous = items;
    startAction(id, "delete");
    setItems((current) => current.filter((report) => report._id !== id));

    try {
      await toast.promise(ReportsAPI.remove(id), {
        pending: "Eliminando reporte...",
        success: "Reporte eliminado.",
        error: "No se pudo eliminar el reporte.",
      });
      if (selectedReport?._id === id) setSelectedReport(null);
      setReportToDelete(null);
    } catch (error) {
      console.error(error);
      toast.error(getFriendlyApiError(error, "No se pudo eliminar el reporte."));
      setItems(previous);
    } finally {
      finishAction();
    }
  }

  async function createReport(payload) {
    try {
      const created = await toast.promise(ReportsAPI.create(payload), {
        pending: "Creando reporte...",
        success: "Reporte creado.",
        error: "No se pudo crear el reporte.",
      });
      setItems((current) => [created, ...current]);
      return created;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  const hasFilters = Boolean(q || barrio || estado || severidad);
  const emptyMessage = items.length === 0
    ? "No hay reportes para mostrar."
    : "No se encontraron resultados con estos filtros.";

  return (
    <div className="space-y-6">
      <AdminSectionHero
        title="Reportes"
        description="Moderá los reportes ambientales enviados por la comunidad."
        action={
          <Button
            variant="primary"
            className="self-start rounded-2xl px-5 py-3"
            onClick={() => setOpenForm(true)}
          >
            <FiPlus className="h-5 w-5" /> Nuevo reporte
          </Button>
        }
      >
        <div className="flex flex-wrap gap-2">
          <SummaryPill label="Totales" value={items.length} tone="green" />
          <SummaryPill label="Filtrados" value={rows.length} tone="slate" />
        </div>
      </AdminSectionHero>

      <Card className="overflow-hidden rounded-3xl border border-[#dce8dd] shadow-[0_18px_50px_-30px_rgba(15,130,55,0.35)]">
        <CardHeader
          title="Listado de reportes"
          subtitle="Filtrá por barrio, estado o severidad para priorizar la moderación."
          action={
            hasFilters ? (
              <Button variant="ghost" className="rounded-2xl" onClick={clearFilters}>
                Limpiar filtros
              </Button>
            ) : null
          }
        />
        <CardBody className="px-0 py-0">
          <FilterBar className="rounded-none border-x-0 border-t-0 border-b border-[#edf3ed] px-5 py-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
              <Input
                placeholder="Buscar por titulo o direccion..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="rounded-2xl bg-white"
              />
              <Select value={barrio} onChange={(e) => setBarrio(e.target.value)} className="rounded-2xl bg-white">
                {barrios.map((value) => (
                  <option key={value || "all"} value={value}>
                    {value || "Todos los barrios"}
                  </option>
                ))}
              </Select>
              <Select value={estado} onChange={(e) => setEstado(e.target.value)} className="rounded-2xl bg-white">
                {FILTER_OPTIONS.map((option) => (
                  <option key={option.value || "all"} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              <Select value={severidad} onChange={(e) => setSeveridad(e.target.value)} className="rounded-2xl bg-white">
                {SEVERIDADES.map((option) => (
                  <option key={option.value || "all"} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              <div className="flex items-center justify-start xl:justify-end">
                <ResultCount count={rows.length} label="resultados" />
              </div>
            </div>
          </FilterBar>

          <div className="overflow-x-auto rounded-b-[24px] border-t border-[#edf3e6]">
            <table className="min-w-full text-sm">
              <thead className="bg-[#f8fbf4] text-slate-700">
                <tr>
                  <Th>Imagen</Th>
                  <Th>ID</Th>
                  <Th>Titulo</Th>
                  <Th>Barrio</Th>
                  <Th>Estado</Th>
                  <Th>Fecha</Th>
                  <Th className="w-[380px]">Acciones</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading && <LoadingRows colSpan={7} />}

                {!loading && paginatedRows.map((report) => (
                  <tr key={report._id} className="transition hover:bg-[#f7fbf6]">
                    <Td><ReportThumb report={report} /></Td>
                    <Td className="font-medium text-[#2d3d33]">{report.code || report._id?.slice(-6)}</Td>
                    <Td className="max-w-[280px]">
                      <div className="truncate font-medium text-[#2d3d33]">{report.titulo || "Sin titulo"}</div>
                      <div className="truncate text-xs text-gray-500">{report.direccion || "Sin direccion"}</div>
                    </Td>
                    <Td>{report.barrio || "-"}</Td>
                    <Td>
                      <div className="flex flex-col items-start gap-1">
                        <Badge meta={getStatusMeta(report.status)} />
                        <Badge meta={getEstadoMeta(report.estado)} />
                      </div>
                    </Td>
                    <Td className="text-gray-600">{fmtFecha(report.createdAt)}</Td>
                    <Td>
                      <div className="flex flex-wrap items-center gap-2">
                        <ActionButton icon={FiEye} disabled={isActionRunning(report._id)} onClick={() => setSelectedReport(report)}>
                          Ver detalle
                        </ActionButton>
                        <RowActionsMenu
                          items={[
                            {
                              label: "Ver en mapa",
                              icon: FiMapPin,
                              disabled: isActionRunning(report._id),
                              onClick: () => openMap(report),
                            },
                            report.status === "pending"
                              ? {
                                  label: isActionRunning(report._id, "approve")
                                    ? "Aprobando..."
                                    : "Aprobar",
                                  icon: FiCheck,
                                  disabled: isActionRunning(report._id),
                                  onClick: () => updateStatus(report._id, "approved"),
                                }
                              : null,
                            report.status === "pending"
                              ? {
                                  label: isActionRunning(report._id, "reject")
                                    ? "Rechazando..."
                                    : "Rechazar",
                                  icon: FiX,
                                  tone: "danger",
                                  disabled: isActionRunning(report._id),
                                  onClick: () => updateStatus(report._id, "rejected"),
                                }
                              : null,
                            report.status === "approved"
                              ? {
                                  label: isActionRunning(report._id, "abierto")
                                    ? "Actualizando..."
                                    : "Marcar como abierto",
                                  disabled:
                                    isActionRunning(report._id) || report.estado === "abierto",
                                  onClick: () => updateOperationalState(report._id, "abierto"),
                                }
                              : null,
                            report.status === "approved"
                              ? {
                                  label: isActionRunning(report._id, "en_revision")
                                    ? "Actualizando..."
                                    : "Marcar en revisión",
                                  disabled:
                                    isActionRunning(report._id) || report.estado === "en_revision",
                                  onClick: () => updateOperationalState(report._id, "en_revision"),
                                }
                              : null,
                            report.status === "approved"
                              ? {
                                  label: isActionRunning(report._id, "resuelto")
                                    ? "Actualizando..."
                                    : "Marcar resuelto",
                                  icon: FiCheckCircle,
                                  disabled:
                                    isActionRunning(report._id) || report.estado === "resuelto",
                                  onClick: () => updateOperationalState(report._id, "resuelto"),
                                }
                              : null,
                            {
                              label: isActionRunning(report._id, "delete")
                                ? "Eliminando..."
                                : "Eliminar",
                              icon: FiTrash2,
                              tone: "danger",
                              disabled: isActionRunning(report._id),
                              onClick: () => setReportToDelete(report),
                            },
                          ]}
                        />
                      </div>
                    </Td>
                  </tr>
                ))}

                {!loading && rows.length === 0 && (
                  <tr>
                    <Td colSpan={7} className="px-0 py-0">
                      <EmptyStatePanel
                        title={items.length === 0 ? "Todavia no hay reportes cargados" : "No encontramos coincidencias"}
                        message={emptyMessage}
                        action={hasFilters ? (
                          <Button variant="ghost" className="rounded-2xl" onClick={clearFilters}>
                            Limpiar filtros
                          </Button>
                        ) : null}
                      />
                    </Td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {!loading && rows.length > 0 ? (
        <Pagination
          page={page}
          pageSize={pageSize}
          totalItems={rows.length}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      ) : null}

      {openForm && (
        <CreateReportPanel
          onClose={() => setOpenForm(false)}
          onCreate={async (payload) => {
            await createReport(payload);
            setOpenForm(false);
          }}
        />
      )}

      {selectedReport && (
        <AdminReportDetailModal
          report={selectedReport}
          isBusy={isActionRunning(selectedReport._id)}
          actionLabel={isActionRunning(selectedReport._id) ? actionState.action : ""}
          onClose={() => setSelectedReport(null)}
          onApprove={() => updateStatus(selectedReport._id, "approved")}
          onReject={() => updateStatus(selectedReport._id, "rejected")}
          onChangeState={(nextState) => updateOperationalState(selectedReport._id, nextState)}
          onDelete={() => setReportToDelete(selectedReport)}
        />
      )}

      {reportToDelete && (
        <ConfirmDeleteModal
          report={reportToDelete}
          onCancel={() => setReportToDelete(null)}
          onConfirm={() => removeReport(reportToDelete._id)}
        />
      )}
    </div>
  );
}

function Badge({ meta }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${meta.className}`}>{meta.label}</span>;
}

function ActionButton({ icon: Icon, children, className = "", disabled = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:-translate-y-0.5 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {Icon ? <Icon className="h-4 w-4" /> : null}
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

function CreateReportPanel({ onClose, onCreate }) {
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
    const validation = validateAdminReportForm(form);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      setSubmitError("Revisa los campos marcados para poder crear el reporte.");
      toast.warn("Revisa los campos obligatorios.");
      return;
    }

    try {
      setSaving(true);
      setSubmitError("");
      await onCreate(form);
    } catch (error) {
      console.error(error);
      const message = getFriendlyApiError(error, "No se pudo crear el reporte.");
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
        <p className="mb-5 mt-2 text-sm text-gray-500">Completá la información y agregá evidencia visual si está disponible.</p>

        <div className="space-y-4">
          {submitError ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {submitError}
            </div>
          ) : null}

          <Field label="Titulo">
            <Input
              value={form.titulo}
              onChange={(e) => setField("titulo", e.target.value)}
              placeholder="Ej: Basural en esquina"
              className={`rounded-2xl ${errors.titulo ? "border-rose-300 bg-rose-50/40" : ""}`}
            />
            {errors.titulo ? <FieldError message={errors.titulo} /> : null}
          </Field>
          <Field label="Barrio">
            <Input
              value={form.barrio}
              onChange={(e) => setField("barrio", e.target.value)}
              placeholder="Ej: Centro"
              className={`rounded-2xl ${errors.barrio ? "border-rose-300 bg-rose-50/40" : ""}`}
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
            <Select value={form.severidad} onChange={(e) => setField("severidad", e.target.value)} className="rounded-2xl">
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
            </Select>
          </Field>
          <Field label="Descripcion">
            <textarea
              rows={4}
              value={form.descripcion}
              onChange={(e) => setField("descripcion", e.target.value)}
              className={`w-full rounded-2xl border px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#0f8237]/30 ${errors.descripcion ? "border-rose-300 bg-rose-50/40" : "border-gray-200"}`}
            />
            {errors.descripcion ? <FieldError message={errors.descripcion} /> : null}
          </Field>
          <Field label="Foto opcional">
            <ImageFileField
              value={form.fotos}
              onChange={(file) => setField("fotos", file)}
              label="Imagen del reporte"
              helperText="Podes adjuntar una imagen para dejar evidencia visual en el panel."
            />
          </Field>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="ghost" className="rounded-2xl" onClick={onClose}>Cancelar</Button>
            <Button variant="primary" className="rounded-2xl" onClick={submit} disabled={saving}>
              {saving ? "Guardando..." : "Crear reporte"}
            </Button>
          </div>
        </div>
    </Modal>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-gray-500">{label}</span>
      {children}
    </label>
  );
}

function FieldError({ message }) {
  return <p className="mt-2 text-xs font-medium text-rose-600">{message}</p>;
}

function AdminReportDetailModal({ report, isBusy, actionLabel, onClose, onApprove, onReject, onChangeState, onDelete }) {
  const imageUrl = getPrimaryImage(report);
  const moderationMeta = getStatusMeta(report.status);
  const operationalMeta = getEstadoMeta(report.estado);
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <>
      <Modal open={!!report} onClose={onClose} title="Detalle administrativo" size="lg">
        <div className="space-y-5">
          <div className="rounded-3xl border border-[#e7efdb] bg-[#fbfdf8] p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#66a939]">Detalle administrativo</p>
                <h3 className="mt-2 text-xl font-semibold text-[#2d3d33]">{report.titulo || "Reporte"}</h3>
                <p className="mt-1 text-sm text-gray-500">{report.code || report._id}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge meta={moderationMeta} />
                <Badge meta={operationalMeta} />
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Flujo actual</p>
              <p className="mt-2 text-sm text-slate-700">
                {report.status === "pending" && "El reporte está pendiente de moderación. Podés aprobarlo o rechazarlo."}
                {report.status === "approved" && `El reporte ya fue aprobado y hoy se encuentra ${operationalMeta.label.toLowerCase()}.`}
                {report.status === "rejected" && "El reporte fue rechazado. Solo queda disponible eliminarlo o revisar su información."}
              </p>
              {isBusy ? (
                <p className="mt-2 text-xs font-medium text-[#0f8237]">
                  Procesando acción: {formatActionLabel(actionLabel)}
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2 xl:grid-cols-3">
            <DetailRow
              label="Usuario"
              value={typeof report.user === "object" ? (report.user?.nombre || report.user?.email || "-") : "-"}
            />
            <DetailRow label="Barrio" value={report.barrio || "-"} />
            <DetailRow label="Dirección" value={report.direccion || "-"} />
            <DetailRow label="Severidad" value={report.severidad || "-"} />
            <DetailRow label="Fecha" value={fmtFecha(report.createdAt)} />
            <DetailRow label="Estado operativo" value={getEstadoMeta(report.estado).label} />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Descripción</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">{report.descripcion || "Sin descripción"}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Imagen adjunta</p>
              {imageUrl ? (
                <button
                  type="button"
                  onClick={() => setPreviewOpen(true)}
                  className="text-sm font-semibold text-[#4f7a2f] transition hover:text-[#35561a]"
                >
                  Ver imagen ampliada
                </button>
              ) : null}
            </div>
            <div className="mt-3 overflow-hidden rounded-2xl border border-[#edf3e6] bg-[#fbfdf8]">
              {imageUrl ? (
                <button type="button" onClick={() => setPreviewOpen(true)} className="block w-full">
                  <img
                    src={imageUrl}
                    alt={report.titulo || "Reporte"}
                    className="max-h-[180px] w-full object-cover sm:max-h-[220px]"
                  />
                </button>
              ) : (
                <div className="flex h-[180px] items-center justify-center text-slate-400 sm:h-[220px]">
                  <div className="text-center">
                    <FiImage className="mx-auto h-8 w-8" />
                    <p className="mt-2 text-sm">Sin imagen</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <ActionButton icon={FiMapPin} disabled={isBusy} onClick={() => openMap(report)}>
              Ver en mapa
            </ActionButton>

            {report.status === "pending" && (
              <>
                <ActionButton
                  icon={FiCheck}
                  disabled={isBusy}
                  className="border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  onClick={onApprove}
                >
                  {actionLabel === "approve" ? "Aprobando..." : "Aprobar"}
                </ActionButton>
                <ActionButton
                  icon={FiX}
                  disabled={isBusy}
                  className="border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                  onClick={onReject}
                >
                  {actionLabel === "reject" ? "Rechazando..." : "Rechazar"}
                </ActionButton>
              </>
            )}

            {report.status === "approved" && (
              <>
                <ActionButton
                  disabled={isBusy || report.estado === "abierto"}
                  className={report.estado === "abierto" ? "border-rose-200 bg-rose-50 text-rose-700" : ""}
                  onClick={() => onChangeState("abierto")}
                >
                  {actionLabel === "abierto" ? "Actualizando..." : "Abierto"}
                </ActionButton>
                <ActionButton
                  disabled={isBusy || report.estado === "en_revision"}
                  className={report.estado === "en_revision" ? "border-amber-200 bg-amber-50 text-amber-700" : ""}
                  onClick={() => onChangeState("en_revision")}
                >
                  {actionLabel === "en_revision" ? "Actualizando..." : "En revisión"}
                </ActionButton>
                <ActionButton
                  icon={FiCheckCircle}
                  disabled={isBusy || report.estado === "resuelto"}
                  className={report.estado === "resuelto" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : ""}
                  onClick={() => onChangeState("resuelto")}
                >
                  {actionLabel === "resuelto" ? "Actualizando..." : "Resuelto"}
                </ActionButton>
              </>
            )}

            <ActionButton
              icon={FiTrash2}
              disabled={isBusy}
              className="border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
              onClick={onDelete}
            >
              {actionLabel === "delete" ? "Eliminando..." : "Eliminar"}
            </ActionButton>
          </div>
        </div>
      </Modal>

      {imageUrl ? (
        <Modal
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          title="Imagen del reporte"
          size="lg"
          lockScroll={false}
        >
          <div className="overflow-hidden rounded-3xl border border-[#e7efdb] bg-[#fbfdf8]">
            <img
              src={imageUrl}
              alt={report.titulo || "Reporte"}
              className="max-h-[75vh] w-full object-contain bg-[#f7fbf1]"
            />
          </div>
        </Modal>
      ) : null}
    </>
  );
}

function DetailRow({ label, value, fullWidth = false }) {
  return (
    <div className={fullWidth ? "sm:col-span-2" : ""}>
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-sm leading-6 text-slate-700">{value}</div>
    </div>
  );
}

function ConfirmDeleteModal({ report, onCancel, onConfirm }) {
  return (
    <Modal open={!!report} onClose={onCancel} title="Eliminar reporte" size="sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
          <FiTrash2 className="h-5 w-5" />
        </div>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Seguro que queres eliminar el reporte <span className="font-medium">{report?.titulo || report?.code}</span>?
          Esta accion no se puede deshacer.
        </p>

        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" className="rounded-2xl" onClick={onCancel}>Cancelar</Button>
          <Button variant="danger" className="rounded-2xl" onClick={onConfirm}>Eliminar</Button>
        </div>
    </Modal>
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

function formatActionLabel(action) {
  const labels = {
    approve: "Aprobacion",
    reject: "Rechazo",
    abierto: "Cambio a abierto",
    en_revision: "Cambio a en revision",
    resuelto: "Cambio a resuelto",
    delete: "Eliminacion",
  };
  return labels[action] || "Actualizacion";
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
