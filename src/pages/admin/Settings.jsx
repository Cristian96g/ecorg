import { FiShield, FiSliders } from "react-icons/fi";
import {
  AdminSectionHero,
  Card,
  CardBody,
  CardHeader,
} from "../../components/ui/Admin-ui";

export default function AdminAjustes() {
  return (
    <div className="space-y-6">
      <AdminSectionHero
        title="Ajustes"
        description="ConfigurÃ¡ la base operativa del sistema y centralizÃ¡ decisiones de branding, permisos y despliegue futuro."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="ConfiguraciÃ³n general"
            subtitle="Espacio previsto para branding institucional, parÃ¡metros globales y mantenimiento."
          />
          <CardBody>
            <div className="flex items-start gap-4 rounded-3xl border border-dashed border-[#d7e5c5] bg-[#fbfdf8] p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef6e4] text-[#66a939]">
                <FiSliders className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#24341a]">
                  MÃ³dulo en preparaciÃ³n
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Esta secciÃ³n queda lista para sumar reglas de branding, preferencias
                  del panel y configuraciones generales sin mezclarlo con la gestiÃ³n diaria.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Seguridad y permisos"
            subtitle="Referencia visual para el manejo de accesos administrativos."
          />
          <CardBody>
            <div className="flex items-start gap-4 rounded-3xl border border-dashed border-[#d7e5c5] bg-[#fbfdf8] p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef6e4] text-[#66a939]">
                <FiShield className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#24341a]">
                  Gobierno del sistema
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Los permisos sensibles ya se controlan desde roles y rutas protegidas.
                  Este bloque sirve como base para futuras polÃ­ticas de acceso y auditorÃ­a.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

