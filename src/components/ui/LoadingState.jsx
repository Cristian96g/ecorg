import { FiLoader } from "react-icons/fi";

export default function LoadingState({
  title = "Cargando contenido",
  description = "Estamos preparando la información para vos.",
  compact = false,
  className = "",
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-[28px] border border-[#dbe7cf] bg-white px-6 py-10 text-center shadow-sm ${compact ? "min-h-[180px]" : "min-h-[260px]"} ${className}`.trim()}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef6e4] text-[#66a939]">
        <FiLoader className="h-6 w-6 animate-spin" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-[#24341a]">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
        {description}
      </p>
    </div>
  );
}
