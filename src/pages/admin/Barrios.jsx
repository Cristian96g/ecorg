import { useCallback, useEffect, useMemo, useState } from "react";
import { FiEdit2, FiLoader, FiPlus, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
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
import { BarriosAPI, getFriendlyApiError } from "../../api/api";

export default function AdminBarrios() {
  const [barrios, setBarrios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [estado, setEstado] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [removingId, setRemovingId] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchBarrios = useCallback(async () => {
    try {
      setLoading(true);
      const data = await BarriosAPI.list();
      setBarrios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("ADMIN_BARRIOS_LIST_ERROR", error);
      toast.error(getFriendlyApiError(error, "No se pudieron cargar los barrios."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBarrios();
  }, [fetchBarrios]);

  const rows = useMemo(() => {
    return barrios.filter((barrio) => {
      const txt =
        `${barrio._id} ${barrio.nombre ?? ""} ${barrio.ciudad ?? ""} ${barrio.provincia ?? ""}`.toLowerCase();
      const okQ = !q || txt.includes(q.toLowerCase());
      const okS =
        !estado ||
        (estado === "activo" && barrio.activo) ||
        (estado === "inactivo" && !barrio.activo);
      return okQ && okS;
    });
  }, [barrios, q, estado]);

  const paginatedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [rows, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [q, estado, pageSize]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [rows.length, page, pageSize]);

  async function handleCreate(payload) {
    try {
      await BarriosAPI.create(payload);
      await fetchBarrios();
      toast.success("Barrio creado con éxito.");
      return true;
    } catch (error) {
      console.error("ADMIN_BARRIOS_CREATE_ERROR", error);
      toast.error(getFriendlyApiError(error, "No se pudo crear el barrio."));
      return false;
    }
  }

  async function handleUpdate(id, payload) {
    try {
      await BarriosAPI.update(id, payload);
      await fetchBarrios();
      toast.success("Barrio actualizado.");
      return true;
    } catch (error) {
      console.error("ADMIN_BARRIOS_UPDATE_ERROR", error);
      toast.error(getFriendlyApiError(error, "No se pudo actualizar el barrio."));
      return false;
    }
  }

  async function handleRemove(id) {
    try {
      setRemovingId(id);
      await BarriosAPI.remove(id);
      await fetchBarrios();
      toast.success("Barrio eliminado.");
    } catch (error) {
      console.error("ADMIN_BARRIOS_DELETE_ERROR", error);
      toast.error(getFriendlyApiError(error, "No se pudo eliminar el barrio."));
    } finally {
      setRemovingId("");
    }
  }

  return (
    <div className="space-y-6">
      <AdminSectionHero
        title="Barrios"
        description="Administrá el catálogo maestro de barrios utilizado en puntos verdes, reportes y calendario."
        action={
          <Button
            variant="primary"
            onClick={() => {
              setEditing(null);
              setOpenForm(true);
            }}
          >
            <FiPlus className="h-5 w-5" /> Nuevo barrio
          </Button>
        }
      />

      <Card>
        <CardHeader
          title="Listado de barrios"
          subtitle="Filtrá por nombre o estado para mantener ordenado el catálogo maestro."
        />
        <CardBody>
          <FilterBar className="mb-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              <Input
                placeholder="Buscar por nombre, ciudad o provincia..."
                value={q}
                onChange={(event) => setQ(event.target.value)}
              />
              <Select value={estado} onChange={(event) => setEstado(event.target.value)}>
                <option value="">Todos los estados</option>
                <option value="activo">Solo activos</option>
                <option value="inactivo">Solo inactivos</option>
              </Select>
              <div className="flex flex-wrap items-center gap-2 xl:justify-end">
                <ResultCount count={rows.length} label="barrios" />
                <Button
                  variant="ghost"
                  onClick={() => {
                    setQ("");
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
                  <Th>Nombre</Th>
                  <Th>Ciudad</Th>
                  <Th>Provincia</Th>
                  <Th>Estado</Th>
                  <Th className="w-40">Acciones</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading && (
                  <tr>
                    <Td colSpan={5} className="py-8 text-center text-gray-500">
                      Cargando barrios...
                    </Td>
                  </tr>
                )}

                {!loading &&
                  paginatedRows.map((barrio) => (
                    <tr key={barrio._id} className="hover:bg-gray-50/60">
                      <Td className="font-medium text-[#2d3d33]">{barrio.nombre}</Td>
                      <Td>{barrio.ciudad || "—"}</Td>
                      <Td>{barrio.provincia || "—"}</Td>
                      <Td>
                        {barrio.activo ? (
                          <span className="inline-flex rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
                            Activo
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                            Inactivo
                          </span>
                        )}
                      </Td>
                      <Td>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            className="px-3 py-2"
                            onClick={() => {
                              setEditing(barrio);
                              setOpenForm(true);
                            }}
                          >
                            <FiEdit2 className="h-4 w-4" /> Editar
                          </Button>
                          <RowActionsMenu
                            items={[
                              {
                                label: "Eliminar",
                                icon: FiTrash2,
                                tone: "danger",
                                onClick: () => setToDelete(barrio),
                              },
                            ]}
                          />
                        </div>
                      </Td>
                    </tr>
                  ))}

                {!loading && rows.length === 0 && (
                  <tr>
                    <Td colSpan={5} className="px-4 py-4">
                      <EmptyState
                        title="No encontramos barrios"
                        description="Probá con otra búsqueda o limpiá los filtros para volver a ver todo el catálogo."
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
        <BarrioPanel
          barrio={editing}
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
        <ConfirmDeleteBarrio
          barrio={toDelete}
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

function BarrioPanel({ barrio, onClose, onCreate, onUpdate }) {
  const isEdit = Boolean(barrio);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    nombre: barrio?.nombre ?? "",
    ciudad: barrio?.ciudad ?? "Río Gallegos",
    provincia: barrio?.provincia ?? "Santa Cruz",
    activo: barrio?.activo ?? true,
  });

  function setField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  }

  function validate() {
    const nextErrors = {};
    if (!form.nombre.trim()) nextErrors.nombre = "El nombre del barrio es obligatorio.";
    if (!form.ciudad.trim()) nextErrors.ciudad = "La ciudad es obligatoria.";
    if (!form.provincia.trim()) nextErrors.provincia = "La provincia es obligatoria.";
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
      nombre: form.nombre.trim(),
      ciudad: form.ciudad.trim(),
      provincia: form.provincia.trim(),
      activo: Boolean(form.activo),
    };

    setSaving(true);
    try {
      if (isEdit) {
        await onUpdate(barrio._id, payload);
      } else {
        await onCreate(payload);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open onClose={onClose} title={isEdit ? "Editar barrio" : "Nuevo barrio"} size="md">
      <p className="mb-4 text-gray-500">
        {isEdit
          ? "Actualizá los datos del barrio."
          : "Cargá un nuevo barrio para utilizarlo en los selectores de la app."}
      </p>

      <label className="mb-3 block">
        <span className="mb-1 block text-sm text-gray-500">Nombre</span>
        <Input
          value={form.nombre}
          onChange={(event) => setField("nombre", event.target.value)}
          placeholder="Ej: San Benito, Centro o Jardín"
        />
        {errors.nombre && <p className="mt-1 text-sm text-[#a53c53]">{errors.nombre}</p>}
      </label>

      <label className="mb-3 block">
        <span className="mb-1 block text-sm text-gray-500">Ciudad</span>
        <Input
          value={form.ciudad}
          onChange={(event) => setField("ciudad", event.target.value)}
          placeholder="Ej: Río Gallegos"
        />
        {errors.ciudad && <p className="mt-1 text-sm text-[#a53c53]">{errors.ciudad}</p>}
      </label>

      <label className="mb-3 block">
        <span className="mb-1 block text-sm text-gray-500">Provincia</span>
        <Input
          value={form.provincia}
          onChange={(event) => setField("provincia", event.target.value)}
          placeholder="Ej: Santa Cruz"
        />
        {errors.provincia && <p className="mt-1 text-sm text-[#a53c53]">{errors.provincia}</p>}
      </label>

      <label className="mb-6 block">
        <span className="mb-1 block text-sm text-gray-500">Estado</span>
        <Select
          value={form.activo ? "activo" : "inactivo"}
          onChange={(event) => setField("activo", event.target.value === "activo")}
        >
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
            "Crear barrio"
          )}
        </Button>
      </div>
    </Modal>
  );
}

function ConfirmDeleteBarrio({ barrio, loading, onCancel, onConfirm }) {
  return (
    <Modal open={!!barrio} onClose={onCancel} title="Eliminar barrio" size="sm">
      <p className="text-sm leading-6 text-slate-600">
        ¿Seguro que querés eliminar el barrio{" "}
        <span className="font-medium">{barrio?.nombre}</span>? Esta acción no se puede deshacer.
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
