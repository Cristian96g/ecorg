import React from "react";

/* ------ UI helpers ------ */
function Card({ children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-slate-100 bg-white shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function CardHeader({ title, action }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
      <h3 className="text-[15px] font-semibold text-slate-800">{title}</h3>
      {action}
    </div>
  );
}

function CardBody({ children, className = "" }) {
  return <div className={`px-5 py-5 ${className}`}>{children}</div>;
}

function StatCard({ icon, label, value, delta, deltaPositive = true }) {
  return (
    <Card>
      <CardBody className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-xs text-slate-500">{label}</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-slate-800">{value}</span>
            <span
              className={`text-[11px] rounded-full px-2 py-0.5 ${
                deltaPositive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
              }`}
            >
              {delta}
            </span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

/* ------ Gauge semicircular simple ------ */
function SemiGauge({ percent = 75 }) {
  // clamp
  const p = Math.max(0, Math.min(100, percent));
  const r = 60;
  const c = Math.PI * r;              // semicircle length
  const dash = (p / 100) * c;

  return (
    <div className="flex justify-center">
      <svg width="180" height="110" viewBox="0 0 200 120">
        {/* track */}
        <path d="M20 100 A80 80 0 0 1 180 100" fill="none" stroke="#e5e7eb" strokeWidth="12" />
        {/* progress */}
        <path
          d="M20 100 A80 80 0 0 1 180 100"
          fill="none"
          stroke="#22c55e"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
        />
        <text x="100" y="88" textAnchor="middle" className="fill-slate-800" fontSize="22" fontWeight="600">
          {p}%
        </text>
      </svg>
    </div>
  );
}

/* ------ Mini barras “Monthly Sales” sin librerías ------ */
function TinyBars({ data = [] }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex h-28 items-end gap-2">
      {data.map((v, i) => (
        <div key={i} className="flex-1 rounded-md bg-emerald-100">
          <div
            className="w-full rounded-md bg-emerald-500"
            style={{ height: `${(v / max) * 100}%` }}
            title={`${v}`}
          />
        </div>
      ))}
    </div>
  );
}

/* ------ Página Dashboard ------ */
export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* fila de stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<span className="text-lg">👥</span>} label="Usuarios" value="3,782" delta="+11.0%" />
        <StatCard icon={<span className="text-lg">🧹</span>} label="Reportes" value="5,359" delta="-9.0%" deltaPositive={false} />
        <StatCard icon={<span className="text-lg">📍</span>} label="Puntos verdes" value="126" delta="+2.3%" />
        <StatCard icon={<span className="text-lg">✅</span>} label="Aprobaciones hoy" value="24" delta="+1.2%" />
      </div>

      {/* ventas + gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader title="Actividad mensual" />
          <CardBody>
            <TinyBars data={[140, 360, 220, 310, 180, 290, 120, 90, 260, 340, 280, 110]} />
            <div className="mt-3 text-xs text-slate-500">Últimos 12 meses</div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Objetivo del mes" />
          <CardBody>
            <SemiGauge percent={76} />
            <p className="mt-3 text-center text-sm text-slate-600">
              Vas <span className="font-medium text-emerald-600">+10%</span> respecto al mes pasado. ¡Buen trabajo!
            </p>
            <div className="mt-4 grid grid-cols-3 text-center">
              <div>
                <div className="text-xs text-slate-500">Meta</div>
                <div className="font-semibold text-slate-800">$20K</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Ingresos</div>
                <div className="font-semibold text-slate-800">$20K</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Hoy</div>
                <div className="font-semibold text-slate-800">$2.1K</div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

{/* Tabla simple / últimas acciones con mismo estilo de las tablas del panel */}
<Card>
  <CardHeader title="Últimas acciones" />
  <CardBody>
    <div className="rounded-2xl border border-gray-100 shadow-sm bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-[#0f8237]/10 text-[#2d3d33]">
            <tr className="text-left">
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">Fecha</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">Usuario</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">Acción</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">Estado</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {[
              { d: "02/11", u: "cgomez", a: "Aprobó punto", s: "Completado" },
              { d: "02/11", u: "admin", a: "Editó reporte", s: "Pendiente" },
              { d: "01/11", u: "lfer", a: "Creó punto", s: "Completado" },
            ].map((row, i) => (
              <tr key={i} className="hover:bg-gray-50/60 text-slate-700">
                <td className="px-4 py-3">{row.d}</td>
                <td className="px-4 py-3">{row.u}</td>
                <td className="px-4 py-3">{row.a}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      row.s === "Completado"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {row.s}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </CardBody>
</Card>
    </div>
  );
}
