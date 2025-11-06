import { useMemo, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiMapPin } from "react-icons/fi";
import { Card, CardHeader, CardBody, Button, Th, Td, Input, Select, StatusBadge } from "../../components/ui/Admin-ui";

// mock simple (cambiá por tus datos reales)
const pointsMock = [
  { id: "PV-101", nombre: "Plaza San Martín", barrio: "Centro", materiales: ["Vidrio","Plástico"], estado: "activo" },
  { id: "PV-102", nombre: "Av. Kirchner",     barrio: "Belgrano", materiales: ["Papel"],          estado: "pendiente" },
  { id: "PV-103", nombre: "Club Güemes",      barrio: "Güemes",   materiales: ["Pilas","Aceite"], estado: "inactivo" },
];

export default function AdminPoints() {
  const [q, setQ] = useState("");
  const [barrio, setBarrio] = useState("");
  const [estado, setEstado] = useState("");

  const barrios = useMemo(() => ["", ...Array.from(new Set(pointsMock.map(p => p.barrio))).sort()], []);
  const rows = useMemo(() => {
    return pointsMock.filter(p => {
      const txt = `${p.id} ${p.nombre} ${p.barrio} ${p.materiales.join(" ")}`.toLowerCase();
      const okQ = !q || txt.includes(q.toLowerCase());
      const okB = !barrio || p.barrio === barrio;
      const okS = !estado || p.estado === estado;
      return okQ && okB && okS;
    });
  }, [q, barrio, estado]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-800">Puntos</h1>
        <Button variant="primary">
          <FiPlus className="w-5 h-5" /> Nuevo puntos
        </Button>
      </div>

      <Card>
        <CardHeader
          title="Listado de puntos verdes"
          action={
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost">Exportar</Button>
              <Button variant="ghost">Importar</Button>
            </div>
          }
        />
        <CardBody>
          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
            <Input placeholder="Buscar (ID, nombre, materiales…)" value={q} onChange={(e)=>setQ(e.target.value)} />
            <Select value={barrio} onChange={(e)=>setBarrio(e.target.value)}>
              {barrios.map(b => <option key={b || "all"} value={b}>{b || "Todos los barrios"}</option>)}
            </Select>
            <Select value={estado} onChange={(e)=>setEstado(e.target.value)}>
              <option value="">Todos los estados</option>
              <option value="activo">Activo</option>
              <option value="pendiente">Pendiente</option>
              <option value="inactivo">Inactivo</option>
            </Select>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={()=>{setQ("");setBarrio("");setEstado("");}}>Limpiar</Button>
            </div>
          </div>

          {/* Tabla */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#0f8237]/10 text-[#2d3d33]">
                <tr className="text-left">
                  <Th>ID</Th>
                  <Th>Nombre</Th>
                  <Th>Barrio</Th>
                  <Th>Materiales</Th>
                  <Th>Estado</Th>
                  <Th className="w-40">Acciones</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/60">
                    <Td className="font-medium text-[#2d3d33]">{p.id}</Td>
                    <Td>{p.nombre}</Td>
                    <Td>{p.barrio}</Td>
                    <Td className="text-gray-600">{p.materiales.join(", ")}</Td>
                    <Td><StatusBadge state={p.estado} /></Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" className="px-2 py-1">
                          <FiMapPin className="w-4 h-4" /> Mapa
                        </Button>
                        <Button variant="ghost" className="px-2 py-1">
                          <FiEdit2 className="w-4 h-4" /> Editar
                        </Button>
                        <Button variant="danger" className="px-2 py-1">
                          <FiTrash2 className="w-4 h-4" /> Eliminar
                        </Button>
                      </div>
                    </Td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <Td colSpan={6} className="text-center py-10 text-gray-500">
                      No hay puntos con los filtros actuales.
                    </Td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
