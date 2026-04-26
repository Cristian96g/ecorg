import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";

const SIZE_CLASSES = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-4xl",
};

let scrollLockCount = 0;
let previousBodyOverflow = "";

function lockBodyScroll() {
  if (typeof document === "undefined") return;

  if (scrollLockCount === 0) {
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }

  scrollLockCount += 1;
}

function unlockBodyScroll() {
  if (typeof document === "undefined" || scrollLockCount === 0) return;

  scrollLockCount -= 1;

  if (scrollLockCount === 0) {
    document.body.style.overflow = previousBodyOverflow;
    previousBodyOverflow = "";
  }
}

export default function Modal({ open, onClose, title, children, size = "md", lockScroll = true }) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const frame = requestAnimationFrame(() => setVisible(true));

      if (lockScroll) {
        lockBodyScroll();
      }

      return () => {
        cancelAnimationFrame(frame);
        if (lockScroll) {
          unlockBodyScroll();
        }
      };
    }

    setVisible(false);
    const timeout = setTimeout(() => setMounted(false), 180);

    return () => {
      clearTimeout(timeout);
    };
  }, [open, lockScroll]);

  useEffect(() => {
    if (!mounted) return undefined;

    function onKeyDown(event) {
      if (event.key === "Escape") onClose?.();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mounted, onClose]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <button
        type="button"
        aria-label="Cerrar modal"
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-200 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        className={`relative z-10 flex max-h-[92vh] w-full flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_28px_70px_rgba(15,23,42,0.24)] transition-all duration-200 ${
          SIZE_CLASSES[size] || SIZE_CLASSES.md
        } ${visible ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
      >
        <div className="flex items-center justify-between gap-4 border-b border-[#e8efdf] px-5 py-4 sm:px-6">
          <h2 className="text-xl font-semibold text-[#203014]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-50"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
          {children}
        </div>
      </div>
    </div>
  );
}
