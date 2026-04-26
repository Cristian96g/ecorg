import { useCallback, useEffect, useMemo, useState } from "react";
import { FiEdit2, FiLoader, FiMapPin, FiPlus, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
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
  StatusBadge,
  Td,
  Th,
} from "../../components/ui/Admin-ui";
import Modal from "../../components/ui/Modal";
import AddressAutocomplete from "../../components/AddressAutocomplete";
import RowActionsMenu from "../../components/admin/RowActionsMenu";
import Pagination from "../../components/ui/Pagination";
import { BarriosAPI, getFriendlyApiError, PointsAPI } from "../../api/api";

const MATERIAL_OPTIONS = [
  { value: "plastico", label: "Plástico" },
  { value: "vidrio", label: "Vidrio" },
  { value: "papel", label: "Papel" },
  { value: "pilas", label: "Pilas" },
  { value: "aceite", label: "Aceite usado" },
];

function normalizePointMaterials(types = []) {
  return [
    ...new Set(
      (Array.isArray(types) ? types : [types]).map((type) =>
        type === "papel_carton" ? "papel" : type
      )
    ),
  ];
}

function getPointMapUrl(point) {
  const coords = point?.location?.coordinates;
  if (!Array.isArray(coords) || coords.length < 2) return "";
  const [lng, lat] = coords.map(Number);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return "";
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

function openPointInMap(point) {
  const mapUrl = getPointMapUrl(point);
  if (!mapUrl) {
    toast.error("Este punto verde no tiene coordenadas válidas.");
    return;
  }

  window.open(mapUrl, "_blank", "noopener,noreferrer");
}

function normalizePoint(point) {
  return {
    ...point,
    types: normalizePointMaterials(point?.types || []),
  };
}

export default function Points() {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [barrio, setBarrio] = useState("");
  const [estado, setEstado] = useState("");
  const [barrios, setBarrios] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [removingId, setRemovingId] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchPoints = useCallback(async () => {
    try {
      setLoading(true);
      const data = await PointsAPI.list();
      setPoints((Array.isArray(data) ? data : []).map(normalizePoint));
    } catch (error) {
      console.error("ADMIN_POINTS_LIST_ERROR", error);
      toast.error(
        getFriendlyApiError(error, "No se pudieron cargar los puntos verdes.")
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPoints();
  }, [fetchPoints]);

  useEffect(() => {
    (async () => {
      try {
        const data = await BarriosAPI.list();
        setBarrios(["", ...data.map((item) => item.nombre)]);
      } catch (error) {
        console.error("ADMIN_POINTS_BARRIOS_ERROR", error);
        toast.error(
          getFriendlyApiError(error, "No se pudieron cargar los barrios.")
        );
      }
    })();
  }, []);

  const rows = useMemo(() => {
    return points.filter((point) => {
      const text =
        `${point._id} ${point.title ?? ""} ${point.address ?? ""} ${point.barrio ?? ""} ${(point.types || []).join(" ")}`.toLowerCase();
      const okQ = !q || text.includes(q.toLowerCase());
      const okB = !barrio || point.barrio === barrio;
      const okS = !estado || point.estado === estado;
      return okQ && okB && okS;
    });
  }, [points, q, barrio, estado]);

  const paginatedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [rows, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [q, barrio, estado, pageSize]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [rows.length, page, pageSize]);

  async function handleCreate(payload) {
    try {
      await PointsAPI.create(payload);
      await fetchPoints();
      toast.success("Punto verde creado con éxito.");
      return true;
    } catch (error) {
      console.error("ADMIN_POINTS_CREATE_ERROR", error);
      toast.error(
        getFriendlyApiError(error, "No se pudo crear el punto verde.")
      );
      return false;
    }
  }

  async function handleUpdate(id, payload) {
    try {
      await PointsAPI.update(id, payload);
      await fetchPoints();
      toast.success("Punto verde actualizado.");
      return true;
    } catch (error) {
      console.error("ADMIN_POINTS_UPDATE_ERROR", error);
      toast.error(
        getFriendlyApiError(error, "No se pudo actualizar el punto verde.")
      );
      return false;
    }
  }

  async function handleRemove(id) {
    try {
      setRemovingId(id);
      await PointsAPI.remove(id);
      await fetchPoints();
      toast.success("Punto verde eliminado.");
    } catch (error) {
      console.error("ADMIN_POINTS_DELETE_ERROR", error);
      toast.error(
        getFriendlyApiError(error, "No se pudo eliminar el punto verde.")
      );
    } finally {
      setRemovingId("");
    }
  }

  return (
    <div className="space-y-6">
      <AdminSectionHero
        title="Puntos verdes"
        description="Gestioná los lugares de reciclaje disponibles en el mapa y asegurá que la información pública esté siempre actualizada."
        action={
          <Button
            variant="primary"
            onClick={() => {
              setEditing(null);
              setOpenForm(true);
            }}
          >
            <FiPlus className="h-5 w-5" /> Nuevo punto
          </Button>
        }
      />

      <Card>
        <CardHeader
          title="Listado de puntos verdes"
          subtitle="Filtrá por barrio, estado o materiales para revisar la información cargada."
        />
        <CardBody>
          <FilterBar className="mb-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
              <Input
                placeholder="Buscar por nombre, dirección, barrio o materiales..."
                value={q}
                onChange={(event) => setQ(event.target.value)}
              />

              <Select value={barrio} onChange={(event) => setBarrio(event.target.value)}>
                {barrios.map((item) => (
                  <option key={item || "all"} value={item}>
                    {item || "Todos los barrios"}
                  </option>
                ))}
              </Select>

              <Select value={estado} onChange={(event) => setEstado(event.target.value)}>
                <option value="">Todos los estados</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </Select>

              <div className="flex flex-wrap items-center gap-2 xl:justify-end">
                <ResultCount count={rows.length} label="puntos" />
                <Button
                  variant="ghost"
                  onClick={() => {
                    setQ("");
                    setBarrio("");
                    setEstado("");
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
                  <Th>ID</Th>
                  <Th>Nombre</Th>
                  <Th>Barrio</Th>
                  <Th>Materiales</Th>
                  <Th>Estado</Th>
                  <Th className="w-48">Acciones</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading && (
                  <tr>
                    <Td colSpan={6} className="py-10 text-center text-gray-500">
                      Cargando puntos verdes...
                    </Td>
                  </tr>
                )}

                {!loading &&
                  paginatedRows.map((point) => (
                    <tr key={point._id} className="hover:bg-gray-50/60">
                      <Td className="font-medium text-[#2d3d33]">{point._id}</Td>
                      <Td>{point.title}</Td>
                      <Td>{point.barrio || "Sin barrio"}</Td>
                      <Td className="text-gray-600">
                        {normalizePointMaterials(point.types)
                          .map(
                            (type) =>
                              MATERIAL_OPTIONS.find((item) => item.value === type)?.label || type
                          )
                          .join(", ") || "Sin materiales"}
                      </Td>
                      <Td>
                        <StatusBadge state={point.estado} />
                      </Td>
                      <Td>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            className="px-3 py-2"
                            onClick={() => {
                              setEditing(point);
                              setOpenForm(true);
                            }}
                          >
                            <FiEdit2 className="h-4 w-4" /> Editar
                          </Button>
                          <RowActionsMenu
                            items={[
                              {
                                label: "Ver en mapa",
                                icon: FiMapPin,
                                onClick: () => openPointInMap(point),
                              },
                              {
                                label: "Eliminar",
                                icon: FiTrash2,
                                tone: "danger",
                                onClick: () => setToDelete(point),
                              },
                            ]}
                          />
                        </div>
                      </Td>
                    </tr>
                  ))}

                {!loading && rows.length === 0 && (
                  <tr>
                    <Td colSpan={6} className="px-4 py-4">
                      <EmptyState
                        title="No encontramos puntos verdes"
                        description="Probá con otra búsqueda o limpiá los filtros para volver a ver todas las ubicaciones."
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
        <PointPanel
          point={editing}
          barrios={barrios}
          onClose={() => setOpenForm(false)}
          onCreate={async (payload) => {
            const ok = await handleCreate(payload);
            if (ok) setOpenForm(false);
          }}
          onUpdate={async (id, payload) => {
            const ok = await handleUpdate(id, payload);
            if (ok) setOpenForm(false);
          }}
        />
      )}

      {toDelete && (
        <ConfirmDeletePoint
          point={toDelete}
          loading={removingId === toDelete._id}
          onCancel={() => setToDelete(null)}
          onConfirm={async () => {
            await handleRemove(toDelete._id);
            setToDelete(null);
          }}
        />
      )}
    </div>
  );
}

function ConfirmDeletePoint({ point, loading, onCancel, onConfirm }) {
  return (
    <Modal open={!!point} onClose={onCancel} title="Eliminar punto verde" size="sm">
      <p className="text-sm leading-6 text-slate-600">
        ¿Seguro que querés eliminar el punto{" "}
        <span className="font-medium">{point?.title || "sin nombre"}</span>?
        Esta acción no se puede deshacer.
      </p>

      <div className="mt-5 flex justify-end gap-2">
        <Button variant="ghost" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={loading}>
          {loading ? "Eliminando..." : "Eliminar"}
        </Button>
      </div>
    </Modal>
  );
}

function PointPanel({ point, barrios, onClose, onCreate, onUpdate }) {
  const isEdit = Boolean(point);
  const [form, setForm] = useState({
    title: point?.title ?? "",
    barrio: point?.barrio ?? "",
    address: point?.address ?? "",
    types: normalizePointMaterials(point?.types ?? []),
    lng: point?.location?.coordinates?.[0] ?? "",
    lat: point?.location?.coordinates?.[1] ?? "",
    estado: point?.estado ?? "activo",
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  function setField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  }

  function toggleType(value) {
    setForm((current) => {
      const hasType = current.types.includes(value);
      return {
        ...current,
        types: hasType
          ? current.types.filter((type) => type !== value)
          : [...current.types, value],
      };
    });
  }

  function validate() {
    const nextErrors = {};
    const lng = Number(form.lng);
    const lat = Number(form.lat);

    if (!form.title.trim()) nextErrors.title = "Ingresá un nombre para el punto verde.";
    if (!form.address.trim()) nextErrors.address = "Ingresá una dirección válida.";
    if (!Number.isFinite(lng)) nextErrors.lng = "Ingresá una longitud válida.";
    if (!Number.isFinite(lat)) nextErrors.lat = "Ingresá una latitud válida.";
    if (form.types.length === 0) {
      nextErrors.types = "Seleccioná al menos un material aceptado.";
    }

    return nextErrors;
  }

  async function submit() {
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.error("Revisá los campos marcados antes de guardar.");
      return;
    }

    const payload = {
      title: form.title.trim(),
      barrio: form.barrio || "",
      address: form.address.trim(),
      types: normalizePointMaterials(form.types),
      lng: Number(form.lng),
      lat: Number(form.lat),
      estado: form.estado,
    };

    setSaving(true);
    try {
      if (isEdit) {
        await onUpdate(point._id, payload);
      } else {
        await onCreate(payload);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open onClose={onClose} title={isEdit ? "Editar punto verde" : "Nuevo punto verde"} size="md">
      <p className="mb-4 text-gray-500">
        {isEdit
          ? "Actualizá los datos del punto y verificá que su ubicación sea correcta."
          : "Cargá un nuevo punto verde con ubicación, materiales y estado."}
      </p>

      <label className="mb-3 block">
        <span className="mb-1 block text-sm text-gray-500">Nombre</span>
        <Input
          value={form.title}
          onChange={(event) => setField("title", event.target.value)}
          placeholder="Ej: Punto Verde - Plaza San Martín"
        />
        {errors.title && <p className="mt-1 text-sm text-[#a53c53]">{errors.title}</p>}
      </label>

      <label className="mb-3 block">
        <span className="mb-1 block text-sm text-gray-500">Barrio</span>
        <Select value={form.barrio} onChange={(event) => setField("barrio", event.target.value)}>
          {barrios.map((item) => (
            <option key={item || "none"} value={item}>
              {item || "Sin barrio / otro"}
            </option>
          ))}
        </Select>
      </label>

      <label className="mb-3 block">
        <span className="mb-1 block text-sm text-gray-500">Dirección</span>
        <AddressAutocomplete
          value={form.address}
          onChange={(text) => {
            setField("address", text);
            setField("lat", "");
            setField("lng", "");
          }}
          onSelect={(item) => {
            setField("address", item.label);
            setField("lat", item.lat);
            setField("lng", item.lon);
          }}
          city="Río Gallegos"
          countryCodes="ar"
        />
        <p className="mt-1 text-xs text-gray-500">
          Al elegir una dirección del listado se completan automáticamente las coordenadas.
        </p>
        {errors.address && <p className="mt-1 text-sm text-[#a53c53]">{errors.address}</p>}
      </label>

      <label className="mb-3 block">
        <span className="mb-1 block text-sm text-gray-500">Materiales aceptados</span>
        <div className="grid grid-cols-2 gap-2">
          {MATERIAL_OPTIONS.map((option) => (
            <label key={option.value} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.types.includes(option.value)}
                onChange={() => toggleType(option.value)}
              />
              {option.label}
            </label>
          ))}
        </div>
        {errors.types && <p className="mt-1 text-sm text-[#a53c53]">{errors.types}</p>}
      </label>

      <div className="mb-3 grid grid-cols-2 gap-3">
        <label className="block">
          <span className="mb-1 block text-sm text-gray-500">Lng</span>
          <Input
            value={form.lng}
            onChange={(event) => setField("lng", event.target.value)}
            placeholder="-69.2181"
          />
          {errors.lng && <p className="mt-1 text-sm text-[#a53c53]">{errors.lng}</p>}
        </label>
        <label className="block">
          <span className="mb-1 block text-sm text-gray-500">Lat</span>
          <Input
            value={form.lat}
            onChange={(event) => setField("lat", event.target.value)}
            placeholder="-51.6230"
          />
          {errors.lat && <p className="mt-1 text-sm text-[#a53c53]">{errors.lat}</p>}
        </label>
      </div>

      <label className="mb-6 block">
        <span className="mb-1 block text-sm text-gray-500">Estado</span>
        <Select value={form.estado} onChange={(event) => setField("estado", event.target.value)}>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </Select>
      </label>

      <div className="flex items-center justify-end gap-2">
        <Button variant="ghost" onClick={onClose} disabled={saving}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={submit} disabled={saving}>
          {saving ? (
            <>
              <FiLoader className="h-4 w-4 animate-spin" /> Guardando...
            </>
          ) : isEdit ? (
            "Guardar cambios"
          ) : (
            "Crear punto"
          )}
        </Button>
      </div>
    </Modal>
  );
}
