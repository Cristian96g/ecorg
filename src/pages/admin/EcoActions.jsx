import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiActivity,
  FiCheckCircle,
  FiEye,
  FiImage,
  FiXCircle,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { EcoActionsAPI, getAssetUrl, getFriendlyApiError } from "../../api/api";
import Modal from "../../components/ui/Modal";
import RowActionsMenu from "../../components/admin/RowActionsMenu";
import Pagination from "../../components/ui/Pagination";
import {
  AdminSectionHero,
  Button,
  Card,
  CardBody,
  CardHeader,
  EmptyState,
  FilterBar,
  Input,
  ResultCount,
  Select,
  Td,
  Th,
} from "../../components/ui/Admin-ui";

const STATUS_OPTIONS = [
  { value: "", label: "Todos los estados" },
  { value: "pendiente", label: "Pendiente" },
  { value: "aprobada", label: "Aprobada" },
  { value: "rechazada", label: "Rechazada" },
];

const TYPE_OPTIONS = [
  { value: "", label: "Todos los tipos" },
  { value: "reporte", label: "Reporte" },
  { value: "reciclaje", label: "Reciclaje" },
  { value: "educacion", label: "Educación" },
  { value: "punto_sugerido", label: "Punto sugerido" },
];

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function getTypeLabel(type) {
  const labels = {
    reporte: "Reporte",
    reciclaje: "Reciclaje",
    educacion: "Educación",
    punto_sugerido: "Punto sugerido",
  };

  return labels[type] || type || "Acción";
}

function getStatusMeta(status) {
  const map = {
    pendiente: "bg-amber-100 text-amber-700",
    aprobada: "bg-emerald-100 text-emerald-700",
    rechazada: "bg-rose-100 text-rose-700",
  };

  const labels = {
    pendiente: "Pendiente",
    aprobada: "Aprobada",
    rechazada: "Rechazada",
  };

  return {
    label: labels[status] || status || "Sin estado",
    className: map[status] || "bg-slate-100 text-slate-700",
  };
}

export default function AdminEcoActions() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [selected, setSelected] = useState(null);
  const [busyId, setBusyId] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchActions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await EcoActionsAPI.listAll({ q, status, type });
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("ADMIN_ECO_ACTIONS_LIST_ERROR", error);
      toast.error(
        getFriendlyApiError(error, "No se pudieron cargar las acciones eco.")
      );
    } finally {
      setLoading(false);
    }
  }, [q, status, type]);

  useEffect(() => {
    fetchActions();
  }, [fetchActions]);

  const rows = useMemo(() => items, [items]);

  const paginatedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [rows, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [q, status, type, pageSize]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [rows.length, page, pageSize]);

  async function refreshSelected(id) {
    const refreshed = await EcoActionsAPI.listAll({ q, status, type });
    const updated = Array.isArray(refreshed)
      ? refreshed.find((item) => item._id === id)
      : null;
    setSelected(updated || null);
  }

  async function handleApprove(id) {
    try {
      setBusyId(id);
      await EcoActionsAPI.approve(id);
      toast.success("Acción aprobada y puntos asignados.");
      await fetchActions();
      if (selected?._id === id) {
        await refreshSelected(id);
      }
    } catch (error) {
      console.error("ADMIN_ECO_ACTION_APPROVE_ERROR", error);
      toast.error(getFriendlyApiError(error, "No se pudo aprobar la acción eco."));
    } finally {
      setBusyId("");
    }
  }

  async function handleReject(id) {
    try {
      setBusyId(id);
      await EcoActionsAPI.reject(id);
      toast.success("Acción rechazada.");
      await fetchActions();
      if (selected?._id === id) {
        await refreshSelected(id);
      }
    } catch (error) {
      console.error("ADMIN_ECO_ACTION_REJECT_ERROR", error);
      toast.error(getFriendlyApiError(error, "No se pudo rechazar la acción eco."));
    } finally {
      setBusyId("");
    }
  }

  return (
    <div className="space-y-6">
      <AdminSectionHero
        title="Acciones Eco"
        description="Revisá acciones ambientales y validá puntos de gamificación."
      />

      <Card>
        <CardHeader
          title="Listado de acciones"
          subtitle="Filtrá por estado, tipo o búsqueda para moderar mejor cada acción registrada."
        />
        <CardBody>
          <FilterBar className="mb-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
              <Input
                placeholder="Buscar por usuario o descripción..."
                value={q}
                onChange={(event) => setQ(event.target.value)}
              />
              <Select value={status} onChange={(event) => setStatus(event.target.value)}>
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value || "all"} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              <Select value={type} onChange={(event) => setType(event.target.value)}>
                {TYPE_OPTIONS.map((option) => (
                  <option key={option.value || "all"} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              <div className="flex flex-wrap items-center gap-2 xl:justify-end">
                <ResultCount count={rows.length} label="acciones" />
                <Button
                  variant="ghost"
                  onClick={() => {
                    setQ("");
                    setStatus("");
                    setType("");
                  }}
                >
                  Limpiar filtros
                </Button>
              </div>
            </div>
          </FilterBar>

          <div className="overflow-x-auto rounded-[24px] border border-[#edf3e6]">
            <table className="min-w-full text-sm">
              <thead className="bg-[#f8fbf4] text-slate-700">
                <tr>
                  <Th>Usuario</Th>
                  <Th>Tipo</Th>
                  <Th>Puntos</Th>
                  <Th>Estado</Th>
                  <Th>Fecha</Th>
                  <Th className="w-[220px]">Acciones</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading && (
                  <tr>
                    <Td colSpan={6} className="py-8 text-center text-gray-500">
                      Cargando acciones eco...
                    </Td>
                  </tr>
                )}

                {!loading &&
                  paginatedRows.map((item) => {
                    const statusMeta = getStatusMeta(item.status);
                    const pending = item.status === "pendiente";

                    return (
                      <tr key={item._id} className="hover:bg-gray-50/60">
                        <Td>
                          <div className="min-w-[190px]">
                            <p className="font-medium text-[#2d3d33]">
                              {item.userId?.nombre || "Usuario eliminado"}
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                              {item.userId?.email || "Sin email"}
                            </p>
                          </div>
                        </Td>
                        <Td>{getTypeLabel(item.type)}</Td>
                        <Td className="font-medium text-[#35561a]">+{item.points}</Td>
                        <Td>
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusMeta.className}`}
                          >
                            {statusMeta.label}
                          </span>
                        </Td>
                        <Td className="text-slate-600">{formatDate(item.createdAt)}</Td>
                        <Td>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="ghost"
                              className="px-3 py-2"
                              onClick={() => setSelected(item)}
                            >
                              <FiEye className="h-4 w-4" /> Ver
                            </Button>
                            <RowActionsMenu
                              items={[
                                pending
                                  ? {
                                      label:
                                        busyId === item._id ? "Procesando..." : "Aprobar",
                                      icon: FiCheckCircle,
                                      disabled: busyId === item._id,
                                      onClick: () => handleApprove(item._id),
                                    }
                                  : null,
                                pending
                                  ? {
                                      label: "Rechazar",
                                      icon: FiXCircle,
                                      tone: "danger",
                                      disabled: busyId === item._id,
                                      onClick: () => handleReject(item._id),
                                    }
                                  : null,
                              ]}
                            />
                          </div>
                        </Td>
                      </tr>
                    );
                  })}

                {!loading && rows.length === 0 && (
                  <tr>
                    <Td colSpan={6} className="px-4 py-4">
                      <EmptyState
                        icon={FiActivity}
                        title="No hay acciones para mostrar"
                        description="Ajustá los filtros para encontrar acciones pendientes, aprobadas o rechazadas."
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

      {selected ? (
        <EcoActionDetailModal
          item={selected}
          busy={busyId === selected._id}
          onClose={() => setSelected(null)}
          onApprove={() => handleApprove(selected._id)}
          onReject={() => handleReject(selected._id)}
        />
      ) : null}
    </div>
  );
}

function EcoActionDetailModal({ item, busy, onClose, onApprove, onReject }) {
  const statusMeta = getStatusMeta(item.status);
  const imageUrl = item.image ? getAssetUrl(item.image) : "";
  const pending = item.status === "pendiente";

  return (
    <Modal open={!!item} onClose={onClose} title="Detalle de acción eco" size="lg">
      <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-5">
          <div className="rounded-3xl border border-[#e7efdb] bg-[#fbfdf8] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4f7a2f]">
              Acción ecológica
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-[#203014]">
              {getTypeLabel(item.type)}
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {item.description || "Sin descripción adicional."}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <DetailCard label="Usuario" value={item.userId?.nombre || "Usuario eliminado"} />
            <DetailCard label="Email" value={item.userId?.email || "Sin email"} />
            <DetailCard label="Puntos" value={`+${item.points}`} />
            <DetailCard label="Fecha" value={formatDate(item.createdAt)} />
            <DetailCard label="Estado" value={statusMeta.label} />
            <DetailCard label="Related ID" value={item.relatedId || "Sin relación"} />
          </div>

          {pending ? (
            <div className="flex flex-wrap gap-2">
              <Button variant="primary" onClick={onApprove} disabled={busy}>
                <FiCheckCircle className="h-4 w-4" />
                {busy ? "Procesando..." : "Aprobar"}
              </Button>
              <Button variant="danger" onClick={onReject} disabled={busy}>
                <FiXCircle className="h-4 w-4" />
                Rechazar
              </Button>
            </div>
          ) : null}
        </section>

        <aside className="space-y-5">
          <div className="rounded-3xl border border-[#e7efdb] bg-white p-5">
            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusMeta.className}`}>
              {statusMeta.label}
            </span>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              {pending
                ? "Esta acción todavía no fue moderada por el equipo admin."
                : item.status === "aprobada"
                  ? "La acción ya fue aprobada y los puntos se asignaron al usuario."
                  : "La acción fue rechazada y no sumó puntos al perfil del usuario."}
            </p>
          </div>

          <div className="rounded-3xl border border-[#e7efdb] bg-white p-5">
            <h4 className="text-base font-semibold text-[#203014]">Imagen adjunta</h4>
            <div className="mt-4 overflow-hidden rounded-2xl border border-[#edf3e6] bg-[#fbfdf8]">
              {imageUrl ? (
                <img src={imageUrl} alt="Acción eco" className="h-64 w-full object-cover" />
              ) : (
                <div className="flex h-64 items-center justify-center text-slate-400">
                  <div className="text-center">
                    <FiImage className="mx-auto h-8 w-8" />
                    <p className="mt-2 text-sm">Sin imagen adjunta</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </Modal>
  );
}

function DetailCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-[#e7efdb] bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-sm leading-6 text-[#203014]">{value}</p>
    </div>
  );
}
