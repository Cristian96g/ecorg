import { FiGrid } from "react-icons/fi";

export function AdminSectionHero({
  eyebrow = "Panel admin",
  title,
  description,
  action = null,
  children = null,
  className = "",
}) {
  return (
    <section
      className={`rounded-[28px] border border-[#dbe7cf] bg-[linear-gradient(135deg,#fbfdf8_0%,#f2f8eb_100%)] px-5 py-5 shadow-[0_16px_40px_rgba(59,89,34,0.08)] sm:px-7 sm:py-6 ${className}`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#5d8a38]">
            {eyebrow}
          </p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-[#24341a] sm:text-[2rem]">
            {title}
          </h1>
          {description ? (
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-[0.95rem]">
              {description}
            </p>
          ) : null}
        </div>

        {action ? (
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-end">
            {action}
          </div>
        ) : null}
      </div>

      {children ? <div className="mt-5">{children}</div> : null}
    </section>
  );
}

export function Card({ className = "", children }) {
  return (
    <div
      className={`rounded-[28px] border border-[#dbe7cf] bg-white shadow-[0_18px_45px_rgba(59,89,34,0.08)] ${className}`}
    >
      {children}
    </div>
  );
}

export function CardBody({ className = "", children }) {
  return <div className={`px-5 py-5 sm:px-6 ${className}`}>{children}</div>;
}

export function CardHeader({ title, subtitle = "", action = null }) {
  return (
    <div className="flex flex-col gap-3 border-b border-[#edf3e6] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div>
        <h3 className="text-[15px] font-semibold text-[#24341a]">{title}</h3>
        {subtitle ? (
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function FilterBar({ children, className = "" }) {
  return (
    <div
      className={`rounded-3xl border border-[#e4edd8] bg-[#f8fbf4] p-3 sm:p-4 ${className}`}
    >
      {children}
    </div>
  );
}

export function ResultCount({ count, label = "resultados" }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[#eef6e4] px-3 py-1 text-xs font-semibold text-[#4d7e28]">
      {count} {label}
    </span>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action = null,
  className = "",
}) {
  const IconComponent = icon || FiGrid;

  return (
    <div
      className={`rounded-[24px] border border-dashed border-[#d7e5c5] bg-[#fbfdf8] px-6 py-10 text-center ${className}`}
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef6e4] text-[#66a939]">
        <IconComponent className="h-5 w-5" />
      </div>
      <h4 className="mt-4 text-base font-semibold text-[#24341a]">{title}</h4>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}) {
  const base =
    "inline-flex justify-center items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#66a939]/30 disabled:cursor-not-allowed disabled:opacity-60";
  const styles = {
    primary:
      "bg-[#66a939] text-white shadow-[0_14px_30px_rgba(76,126,40,0.22)] hover:bg-[#578f31]",
    ghost:
      "border border-[#d7e5c5] bg-white text-slate-700 hover:border-[#c7dbaf] hover:bg-[#f6faf1]",
    danger:
      "border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100",
  };

  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function Th({ className = "", children }) {
  return (
    <th
      className={`px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 ${className}`}
    >
      {children}
    </th>
  );
}

export function Td({ className = "", colSpan, children }) {
  return (
    <td colSpan={colSpan} className={`px-4 py-4 text-gray-700 ${className}`}>
      {children}
    </td>
  );
}

export function Input({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`w-full rounded-2xl border border-[#d7e5c5] bg-white px-3.5 py-2.5 text-sm text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[#66a939] focus:ring-2 focus:ring-[#66a939]/20 ${className}`}
    />
  );
}

export function Select({ className = "", ...props }) {
  return (
    <select
      {...props}
      className={`w-full appearance-none rounded-2xl border border-[#d7e5c5] bg-white px-3.5 py-2.5 pr-9 text-sm text-slate-700 shadow-sm outline-none transition focus:border-[#66a939] focus:ring-2 focus:ring-[#66a939]/20 ${className}`}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg fill='%235b6b58' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath d='M5.5 7.5l4.5 4.5 4.5-4.5'/%3E%3C/svg%3E\")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right .8rem center",
        backgroundSize: "1rem 1rem",
      }}
    />
  );
}

export function StatusBadge({ state }) {
  const map = {
    activo: "bg-emerald-100 text-emerald-700",
    pendiente: "bg-amber-100 text-amber-700",
    inactivo: "bg-slate-100 text-slate-700",
  };
  const labels = {
    activo: "Activo",
    pendiente: "Pendiente",
    inactivo: "Inactivo",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${map[state] || "bg-slate-100 text-slate-700"}`}
    >
      {labels[state] || state}
    </span>
  );
}
