import { useCallback, useEffect, useMemo, useState } from "react";
import { FiEdit2, FiLoader, FiPlus, FiTrash2, FiUsers } from "react-icons/fi";
import { toast } from "react-toastify";
import Modal from "../../components/ui/Modal";
import RowActionsMenu from "../../components/admin/RowActionsMenu";
import Pagination from "../../components/ui/Pagination";
import { useAuth } from "../../state/auth";
import { UsersAPI, getFriendlyApiError } from "../../api/api";
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

const ROLES = [
  { value: "", label: "Todos" },
  { value: "user", label: "Usuario" },
  { value: "admin", label: "Admin" },
];

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function validateUserForm(form, isEdit) {
  const errors = {};
  const email = form.email.trim().toLowerCase();

  if (!form.nombre.trim()) {
    errors.nombre = "El nombre es obligatorio.";
  }

  if (!email) {
    errors.email = "El email es obligatorio.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Ingresá un email válido.";
  }

  if (!["user", "admin"].includes(form.role)) {
    errors.role = "Seleccioná un rol válido.";
  }

  if (form.telefono && !/^[0-9+\-\s()]{6,20}$/.test(form.telefono.trim())) {
    errors.telefono = "Ingresá un teléfono válido.";
  }

  if (!isEdit) {
    if (!form.password.trim()) {
      errors.password = "La contraseña es obligatoria para crear un usuario.";
    } else if (form.password.trim().length < 6) {
      errors.password = "La contraseña debe tener al menos 6 caracteres.";
    }
  }

  return errors;
}

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [role, setRole] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [removingId, setRemovingId] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const list = await UsersAPI.list();
      setUsers(Array.isArray(list) ? list : list?.items ?? []);
    } catch (error) {
      console.error("ADMIN_USERS_LIST_ERROR", error);
      toast.error(getFriendlyApiError(error, "No se pudieron cargar los usuarios."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const adminCount = useMemo(
    () => users.filter((item) => item.role === "admin").length,
    [users]
  );

  const rows = useMemo(() => {
    return users.filter((user) => {
      const text =
        `${user._id} ${user.nombre ?? ""} ${user.email ?? ""} ${user.role ?? ""} ${user.telefono ?? ""} ${user.barrio ?? ""}`.toLowerCase();
      const okRole = !role || user.role === role;
      const okQ = !q || text.includes(q.toLowerCase());
      return okRole && okQ;
    });
  }, [users, q, role]);

  const paginatedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [rows, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [q, role, pageSize]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [rows.length, page, pageSize]);

  async function handleCreate(payload) {
    try {
      await UsersAPI.create(payload);
      await fetchUsers();
      toast.success("Usuario creado con éxito.");
      return true;
    } catch (error) {
      console.error("ADMIN_USERS_CREATE_ERROR", error);
      toast.error(getFriendlyApiError(error, "No se pudo crear el usuario."));
      return false;
    }
  }

  async function handleUpdate(id, payload) {
    try {
      await UsersAPI.update(id, payload);
      await fetchUsers();
      toast.success("Usuario actualizado.");
      return true;
    } catch (error) {
      console.error("ADMIN_USERS_UPDATE_ERROR", error);
      toast.error(getFriendlyApiError(error, "No se pudo actualizar el usuario."));
      return false;
    }
  }

  async function handleRemove(id) {
    try {
      setRemovingId(id);
      await UsersAPI.remove(id);
      await fetchUsers();
      toast.success("Usuario eliminado.");
    } catch (error) {
      console.error("ADMIN_USERS_DELETE_ERROR", error);
      toast.error(getFriendlyApiError(error, "No se pudo eliminar el usuario."));
    } finally {
      setRemovingId("");
    }
  }

  return (
    <div className="space-y-6">
      <AdminSectionHero
        title="Usuarios"
        description="Gestioná cuentas, roles y datos básicos de la plataforma."
        action={
          <Button
            variant="primary"
            onClick={() => {
              setEditing(null);
              setOpenForm(true);
            }}
          >
            <FiPlus className="h-5 w-5" /> Nuevo usuario
          </Button>
        }
      />

      <Card>
        <CardHeader
          title="Listado de usuarios"
          subtitle="Buscá por nombre, email o rol para revisar accesos y permisos."
        />
        <CardBody>
          <FilterBar className="mb-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              <Input
                placeholder="Buscar por nombre o email..."
                value={q}
                onChange={(event) => setQ(event.target.value)}
              />
              <Select value={role} onChange={(event) => setRole(event.target.value)}>
                {ROLES.map((item) => (
                  <option key={item.value || "all"} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </Select>
              <div className="flex flex-wrap items-center gap-2 xl:justify-end">
                <ResultCount count={rows.length} label="usuarios" />
                <Button
                  variant="ghost"
                  onClick={() => {
                    setQ("");
                    setRole("");
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
                  <Th>Rol</Th>
                  <Th>Contacto</Th>
                  <Th>Alta</Th>
                  <Th className="w-[220px]">Acciones</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading && (
                  <tr>
                    <Td colSpan={5} className="py-8 text-center text-gray-500">
                      Cargando usuarios...
                    </Td>
                  </tr>
                )}

                {!loading &&
                  paginatedRows.map((user) => {
                    const isSelf = currentUser?._id === user._id;
                    const isLastAdmin = user.role === "admin" && adminCount <= 1;

                    return (
                      <tr key={user._id} className="hover:bg-gray-50/60">
                        <Td>
                          <div className="min-w-[180px]">
                            <p className="font-medium text-[#2d3d33]">
                              {user.nombre || "-"}
                            </p>
                            <p className="mt-1 text-sm text-slate-500">{user.email}</p>
                          </div>
                        </Td>
                        <Td>
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                              user.role === "admin"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {user.role === "admin" ? "Admin" : "Usuario"}
                          </span>
                        </Td>
                        <Td>
                          <div className="text-sm text-slate-600">
                            <p>{user.telefono || "Sin teléfono"}</p>
                            <p className="mt-1">{user.barrio || "Sin barrio"}</p>
                          </div>
                        </Td>
                        <Td className="text-slate-600">{formatDate(user.createdAt)}</Td>
                        <Td>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="ghost"
                              className="px-3 py-2"
                              onClick={() => {
                                setEditing(user);
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
                                  disabled: isSelf || isLastAdmin || removingId === user._id,
                                  title: isSelf
                                    ? "No podés eliminar tu propia cuenta desde este panel."
                                    : isLastAdmin
                                      ? "No podés eliminar el último administrador."
                                      : undefined,
                                  onClick: () => setToDelete(user),
                                },
                              ]}
                            />
                          </div>
                        </Td>
                      </tr>
                    );
                  })}

                {!loading && rows.length === 0 && (
                  <tr>
                    <Td colSpan={5} className="px-4 py-4">
                      <EmptyState
                        icon={FiUsers}
                        title="No hay usuarios para mostrar"
                        description="Ajustá la búsqueda o el filtro por rol para encontrar cuentas registradas."
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
        <UserPanel
          user={editing}
          currentUserId={currentUser?._id}
          adminCount={adminCount}
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
        <ConfirmDeleteUser
          user={toDelete}
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

function UserPanel({ user, currentUserId, adminCount, onClose, onCreate, onUpdate }) {
  const isEdit = Boolean(user);
  const isSelf = currentUserId === user?._id;
  const [form, setForm] = useState({
    nombre: user?.nombre ?? "",
    email: user?.email ?? "",
    role: user?.role ?? "user",
    telefono: user?.telefono ?? "",
    barrio: user?.barrio ?? "",
    password: "",
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  function setField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  }

  async function submit() {
    const validationErrors = validateUserForm(form, isEdit);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.error("Revisá los campos marcados antes de guardar.");
      return;
    }

    if (
      isEdit &&
      isSelf &&
      user?.role === "admin" &&
      form.role === "user" &&
      adminCount <= 1
    ) {
      toast.error("No podés quitar el último administrador del sistema.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        nombre: form.nombre.trim(),
        email: form.email.trim().toLowerCase(),
        role: form.role,
        telefono: form.telefono.trim(),
        barrio: form.barrio.trim(),
      };

      if (isEdit) {
        await onUpdate(user._id, payload);
      } else {
        await onCreate({
          ...payload,
          password: form.password.trim(),
        });
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open onClose={onClose} title={isEdit ? "Editar usuario" : "Nuevo usuario"} size="md">
      <p className="mb-4 text-gray-500">
        {isEdit
          ? "Actualizá los datos básicos y el rol del usuario."
          : "Cargá un nuevo usuario para darle acceso al sistema."}
      </p>

      <label className="mb-3 block">
        <span className="mb-1 block text-sm text-gray-500">Nombre</span>
        <Input
          value={form.nombre}
          onChange={(e) => setField("nombre", e.target.value)}
          placeholder="Nombre y apellido"
        />
        {errors.nombre && <p className="mt-1 text-sm text-[#a53c53]">{errors.nombre}</p>}
      </label>

      <label className="mb-3 block">
        <span className="mb-1 block text-sm text-gray-500">Email</span>
        <Input
          type="email"
          value={form.email}
          onChange={(e) => setField("email", e.target.value)}
          placeholder="correo@ejemplo.com"
        />
        {errors.email && <p className="mt-1 text-sm text-[#a53c53]">{errors.email}</p>}
      </label>

      <label className="mb-3 block">
        <span className="mb-1 block text-sm text-gray-500">Rol</span>
        <Select
          value={form.role}
          onChange={(e) => setField("role", e.target.value)}
          disabled={isEdit && isSelf && user?.role === "admin" && adminCount <= 1}
        >
          <option value="user">Usuario</option>
          <option value="admin">Admin</option>
        </Select>
        {errors.role && <p className="mt-1 text-sm text-[#a53c53]">{errors.role}</p>}
      </label>

      <label className="mb-3 block">
        <span className="mb-1 block text-sm text-gray-500">Teléfono</span>
        <Input
          value={form.telefono}
          onChange={(e) => setField("telefono", e.target.value)}
          placeholder="Ej: 2966 123456"
        />
        {errors.telefono && <p className="mt-1 text-sm text-[#a53c53]">{errors.telefono}</p>}
      </label>

      <label className="mb-3 block">
        <span className="mb-1 block text-sm text-gray-500">Barrio</span>
        <Input
          value={form.barrio}
          onChange={(e) => setField("barrio", e.target.value)}
          placeholder="Ej: Centro"
        />
      </label>

      {!isEdit ? (
        <label className="mb-6 block">
          <span className="mb-1 block text-sm text-gray-500">Contraseña</span>
          <Input
            type="password"
            value={form.password}
            onChange={(e) => setField("password", e.target.value)}
            placeholder="Mínimo 6 caracteres"
          />
          {errors.password && <p className="mt-1 text-sm text-[#a53c53]">{errors.password}</p>}
        </label>
      ) : (
        <div className="mb-6 rounded-2xl border border-[#e7efdb] bg-[#fbfdf8] px-4 py-3 text-sm text-slate-600">
          La contraseña no se muestra ni se edita desde este formulario.
        </div>
      )}

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
            "Crear usuario"
          )}
        </Button>
      </div>
    </Modal>
  );
}

function ConfirmDeleteUser({ user, loading, onCancel, onConfirm }) {
  return (
    <Modal open={!!user} onClose={onCancel} title="Eliminar usuario" size="sm">
      <p className="text-sm leading-6 text-slate-600">
        ¿Seguro que querés eliminar al usuario{" "}
        <span className="font-medium">{user?.nombre || user?.email}</span>?
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
