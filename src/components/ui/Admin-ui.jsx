// Primitivas de UI con el look del panel (Tailwind)
export function Card({ className = "", children }) {
  return <div className={`rounded-2xl border border-gray-100 bg-white shadow-sm ${className}`}>{children}</div>;
}
export function CardBody({ className = "", children }) {
  return <div className={`px-5 py-5 ${className}`}>{children}</div>;
}
export function CardHeader({ title, action }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
      <h3 className="text-[15px] font-semibold text-slate-800">{title}</h3>
      {action}
    </div>
  );
}

/* Botón con variantes */
export function Button({ variant="primary", className="", children, ...props }) {
  const base = "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm transition";
  const styles = {
    primary:   "bg-[#0f8237] text-white hover:bg-[#0d6f2f] shadow-md",
    ghost:     "border border-gray-200 text-slate-700 hover:bg-gray-50",
    danger:    "border border-rose-200 text-rose-600 hover:bg-rose-50",
  };
  return <button className={`${base} ${styles[variant]} ${className}`} {...props}>{children}</button>;
}

/* Tabla */
export function Th({ className="", children }) {
  return <th className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide ${className}`}>{children}</th>;
}
export function Td({ className="", colSpan, children }) {
  return <td colSpan={colSpan} className={`px-4 py-3 text-gray-700 ${className}`}>{children}</td>;
}

/* Inputs */
export function Input(props) {
  return <input {...props} className={`w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0f8237]/30 ${props.className||""}`} />;
}
export function Select({ className="", ...props }) {
  return (
    <select
      {...props}
      className={`w-full appearance-none rounded-xl border border-gray-200 bg-white px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-[#0f8237]/30 ${className}`}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg fill='%23727272' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath d='M5.5 7.5l4.5 4.5 4.5-4.5'/%3E%3C/svg%3E\")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right .6rem center",
        backgroundSize: "1rem 1rem",
      }}
    />
  );
}

/* Badges */
export function StatusBadge({ state }) {
  const map = {
    activo:     "bg-emerald-100 text-emerald-700",
    pendiente:  "bg-amber-100 text-amber-700",
    inactivo:   "bg-gray-100 text-gray-700",
  };
  const txt = { activo:"Activo", pendiente:"Pendiente", inactivo:"Inactivo" }[state] || state;
  return <span className={`inline-flex px-2 py-1 rounded-full text-xs ${map[state]||"bg-gray-100 text-gray-700"}`}>{txt}</span>;
}
