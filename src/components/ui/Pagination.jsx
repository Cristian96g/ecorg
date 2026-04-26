import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

function buildPages(currentPage, totalPages) {
  const pages = [];
  const start = Math.max(1, currentPage - 1);
  const end = Math.min(totalPages, currentPage + 1);

  if (start > 1) pages.push(1);
  if (start > 2) pages.push("ellipsis-left");

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  if (end < totalPages - 1) pages.push("ellipsis-right");
  if (end < totalPages) pages.push(totalPages);

  return pages;
}

export default function Pagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20],
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startItem = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = totalItems === 0 ? 0 : Math.min(totalItems, page * pageSize);
  const pages = buildPages(page, totalPages);

  return (
    <div className="mt-5 flex flex-col gap-3 rounded-3xl border border-[#e4edd8] bg-[#f8fbf4] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-slate-600">
        Mostrando <span className="font-semibold text-[#24341a]">{startItem}-{endItem}</span> de{" "}
        <span className="font-semibold text-[#24341a]">{totalItems}</span>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <span>Por pagina</span>
          <select
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            className="rounded-2xl border border-[#d7e5c5] bg-white px-3 py-2 text-sm text-slate-700 shadow-sm outline-none transition focus:border-[#66a939] focus:ring-2 focus:ring-[#66a939]/20"
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[#d7e5c5] bg-white text-slate-600 shadow-sm transition hover:bg-[#f6faf1] disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Pagina anterior"
          >
            <FiChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-1">
            {pages.map((item) =>
              typeof item === "number" ? (
                <button
                  key={item}
                  type="button"
                  onClick={() => onPageChange(item)}
                  className={`inline-flex h-10 min-w-[2.5rem] items-center justify-center rounded-2xl px-3 text-sm font-medium transition ${
                    item === page
                      ? "bg-[#66a939] text-white shadow-[0_14px_30px_rgba(76,126,40,0.22)]"
                      : "border border-[#d7e5c5] bg-white text-slate-700 hover:bg-[#f6faf1]"
                  }`}
                >
                  {item}
                </button>
              ) : (
                <span
                  key={item}
                  className="inline-flex h-10 min-w-[2.5rem] items-center justify-center text-sm text-slate-400"
                >
                  ...
                </span>
              )
            )}
          </div>

          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[#d7e5c5] bg-white text-slate-600 shadow-sm transition hover:bg-[#f6faf1] disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Pagina siguiente"
          >
            <FiChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
