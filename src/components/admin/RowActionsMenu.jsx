import { useEffect, useRef, useState } from "react";
import { FiMoreHorizontal } from "react-icons/fi";

export default function RowActionsMenu({ items = [], align = "right" }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    function handlePointer(event) {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleKey(event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  const visibleItems = items.filter(Boolean);
  if (visibleItems.length === 0) return null;

  const positionClass =
    align === "left" ? "left-0 origin-top-left" : "right-0 origin-top-right";

  return (
    <div ref={rootRef} className="relative inline-flex">
      <button
        type="button"
        aria-label="Más acciones"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-[#d7e5c5] bg-white text-slate-600 shadow-sm transition hover:bg-[#f6faf1] hover:text-[#3c6724] focus:outline-none focus:ring-2 focus:ring-[#66a939]/25"
      >
        <FiMoreHorizontal className="h-4 w-4" />
      </button>

      {open ? (
        <div
          className={`absolute top-11 z-20 min-w-[190px] rounded-2xl border border-[#dfe9d3] bg-white p-1.5 shadow-[0_18px_45px_rgba(59,89,34,0.16)] ${positionClass}`}
        >
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const toneClass =
              item.tone === "danger"
                ? "text-rose-700 hover:bg-rose-50"
                : "text-slate-700 hover:bg-[#f6faf1] hover:text-[#3c6724]";

            return (
              <button
                key={item.label}
                type="button"
                disabled={item.disabled}
                title={item.title}
                onClick={() => {
                  if (item.disabled) return;
                  item.onClick?.();
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition disabled:cursor-not-allowed disabled:opacity-50 ${toneClass}`}
              >
                {Icon ? <Icon className="h-4 w-4 shrink-0" /> : null}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
