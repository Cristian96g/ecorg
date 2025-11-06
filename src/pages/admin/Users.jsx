import { useEffect, useMemo, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { UsersAPI } from "../../api/api";
import { Card, CardHeader, CardBody, Button, Th, Td, Input, Select } from "../../components/ui/Admin-ui";

const ROLES = [
  { value: "", label: "Todos" },
  { value: "user", label: "Usuario" },
  { value: "admin", label: "Admin" },
];

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // filtros
  const [q, setQ] = useState("");
  const [role, setRole] = useState("");

  // modal form
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState(null); // user | null

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const list = await UsersAPI.list();
        setUsers(Array.isArray(list) ? list : (list.items ?? []));
      } catch (e) {
        console.error(e);
        alert("No se pudieron cargar los usuarios.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const rows = useMemo(() => {
    const text = (u) =>
      `${u._id} ${u.nombre ?? ""} ${u.email ?? ""} ${u.role ?? ""}`.toLowerCase();
    return (users || []).filter((u) => {
      const okRole = !role || u.role === role;
      const okQ = !q || text(u).includes(q.toLowerCase());
      return okRole && okQ;
    });
  }, [users, q, role]);

  /* ---------- acciones (optimistas) ---------- */
  async function handleCreate(payload) {
    try {
      const created = await UsersAPI.create(payload);
      setUsers((cur) => [created, ...cur]);
      alert("Usuario creado con éxito.");
    } catch (e) {
      console.error(e);
      alert("No se pudo crear el usuario.");
    }
  }

  async function handleUpdate(id, payload) {
    const prev = users;
    setUsers((cur) => cur.map((u) => (u._id === id ? { ...u, ...payload } : u)));
    try {
      const saved = await UsersAPI.update(id, payload);
      setUsers((cur) => cur.map((u) => (u._id === id ? saved : u)));
    } catch (e) {
      console.error(e);
      setUsers(prev); // rollback
      alert("No se pudo actualizar el usuario.");
    }
  }

  async function handleRemove(id) {
    const prev = users;
    setUsers((cur) => cur.filter((u) => u._id !== id));
    try {
      await UsersAPI.remove(id);
    } catch (e) {
      console.error(e);
      setUsers(prev);
      alert("No se pudo eliminar el usuario.");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Usuarios</h1>
          <p className="text-slate-500 mt-1">Gestioná cuentas, roles y accesos de la plataforma.</p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setEditing(null);
            setOpenForm(true);
          }}
        >
          <FiPlus className="w-5 h-5" /> Nuevo usuario
        </Button>
      </div>

      <Card>
        <CardHeader
          title="Listado de usuarios"
          action={
            <Button variant="ghost" onClick={() => { setQ(""); setRole(""); }}>
              Limpiar filtros
            </Button>
          }
        />
        <CardBody>
          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
            <Input placeholder="Buscar por nombre o email…" value={q} onChange={(e)=>setQ(e.target.value)} />
            <Select value={role} onChange={(e)=>setRole(e.target.value)}>
              {ROLES.map(r => <option key={r.value || "all"} value={r.value}>{r.label}</option>)}
            </Select>
            <div className="hidden md:block" />
          </div>

          {/* Tabla */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#0f8237]/10 text-[#2d3d33]">
                <tr className="text-left">
                  <Th>Nombre</Th>
                  <Th>Email</Th>
                  <Th>Rol</Th>
                  <Th className="w-[220px]">Acciones</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading && (
                  <tr>
                    <Td colSpan={4} className="py-8 text-center text-gray-500">Cargando…</Td>
                  </tr>
                )}
                {!loading && rows.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50/60">
                    <Td className="font-medium text-[#2d3d33]">{u.nombre || "-"}</Td>
                    <Td className="text-gray-700">{u.email}</Td>
                    <Td className="capitalize">{u.role || "-"}</Td>
                    <Td>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="ghost"
                          className="px-2 py-1"
                          onClick={() => { setEditing(u); setOpenForm(true); }}
                        >
                          <FiEdit2 className="w-4 h-4" /> Editar
                        </Button>
                        <Button
                          variant="danger"
                          className="px-2 py-1"
                          onClick={() => {
                            if (confirm("¿Eliminar este usuario?")) handleRemove(u._id);
                          }}
                        >
                          <FiTrash2 className="w-4 h-4" /> Eliminar
                        </Button>
                      </div>
                    </Td>
                  </tr>
                ))}
                {!loading && rows.length === 0 && (
                  <tr>
                    <Td colSpan={4} className="py-10 text-center text-gray-500">
                      No hay usuarios con los filtros actuales.
                    </Td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* Panel lateral: crear/editar */}
      {openForm && (
        <UserPanel
          user={editing}
          onClose={() => setOpenForm(false)}
          onCreate={async (payload) => { await handleCreate(payload); setOpenForm(false); }}
          onUpdate={async (id, payload) => { await handleUpdate(id, payload); setOpenForm(false); }}
        />
      )}
    </div>
  );
}

/* ------------ Side Panel (Create / Edit) ------------- */
function UserPanel({ user, onClose, onCreate, onUpdate }) {
  const isEdit = !!user;
  const [form, setForm] = useState({
    nombre: user?.nombre ?? "",
    email: user?.email ?? "",
    role: user?.role ?? "user",
    password: "", // solo para crear o reset
  });
  const [saving, setSaving] = useState(false);

  function setField(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  async function submit() {
    if (!form.nombre || !form.email) {
      alert("Completá nombre y email.");
      return;
    }
    setSaving(true);
    try {
      if (isEdit) {
        const payload = { nombre: form.nombre, email: form.email, role: form.role };
        // si quiere resetear contraseña:
        if (form.password?.trim()) payload.password = form.password.trim();
        await onUpdate(user._id, payload);
      } else {
        if (!form.password?.trim()) {
          alert("Para crear un usuario, ingresá una contraseña.");
          setSaving(false);
          return;
        }
        await onCreate({
          nombre: form.nombre,
          email: form.email,
          role: form.role,
          password: form.password.trim(),
        });
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl p-6 overflow-y-auto">
        <h3 className="text-xl font-semibold text-[#2d3d33]">
          {isEdit ? "Editar usuario" : "Nuevo usuario"}
        </h3>
        <p className="text-gray-500 mb-4">
          {isEdit ? "Actualizá los datos del usuario." : "Cargá un nuevo usuario con su rol."}
        </p>

        <label className="block mb-3">
          <span className="block text-sm text-gray-500 mb-1">Nombre</span>
          <Input value={form.nombre} onChange={(e)=>setField("nombre", e.target.value)} placeholder="Nombre y apellido" />
        </label>

        <label className="block mb-3">
          <span className="block text-sm text-gray-500 mb-1">Email</span>
          <Input type="email" value={form.email} onChange={(e)=>setField("email", e.target.value)} placeholder="correo@ejemplo.com" />
        </label>

        <label className="block mb-3">
          <span className="block text-sm text-gray-500 mb-1">Rol</span>
          <Select value={form.role} onChange={(e)=>setField("role", e.target.value)}>
            <option value="user">Usuario</option>
            <option value="admin">Admin</option>
          </Select>
        </label>

        <label className="block mb-6">
          <span className="block text-sm text-gray-500 mb-1">
            {isEdit ? "Nueva contraseña (opcional)" : "Contraseña"}
          </span>
          <Input
            type="password"
            value={form.password}
            onChange={(e)=>setField("password", e.target.value)}
            placeholder={isEdit ? "Dejar vacío para no cambiar" : "Mínimo 6 caracteres"}
          />
        </label>

        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" onClick={submit} disabled={saving}>
            {saving ? "Guardando…" : (isEdit ? "Guardar cambios" : "Crear usuario")}
          </Button>
        </div>
      </div>
    </div>
  );
}
