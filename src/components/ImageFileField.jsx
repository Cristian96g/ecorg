import { useEffect, useId, useMemo, useRef, useState } from "react";
import { FiImage, FiTrash2, FiUpload } from "react-icons/fi";

export default function ImageFileField({
  value = null,
  onChange,
  label = "Imagen",
  helperText = "Formatos permitidos: JPG, PNG y WebP.",
  accept = "image/png,image/jpeg,image/webp",
}) {
  const inputId = useId();
  const inputRef = useRef(null);
  const [file, setFile] = useState(value instanceof File ? value : null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    setFile(value instanceof File ? value : null);
  }, [value]);

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return undefined;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  const buttonLabel = file ? "Cambiar imagen" : "Seleccionar imagen";
  const fileName = useMemo(() => file?.name || "Todavía no seleccionaste ninguna imagen.", [file]);

  function handleFileChange(event) {
    const nextFile = event.target.files?.[0] || null;
    if (!nextFile) return;

    setFile(nextFile);
    onChange?.(nextFile);
  }

  function handleRemove() {
    setFile(null);
    setPreviewUrl("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onChange?.(null);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[#2d3d33]">{label}</p>
          <p className="mt-1 text-xs text-slate-500">{helperText}</p>
        </div>
        {file ? (
          <button
            type="button"
            onClick={handleRemove}
            className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 hover:bg-rose-100"
          >
            <FiTrash2 className="h-4 w-4" />
            Quitar
          </button>
        ) : null}
      </div>

      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="rounded-2xl border border-[#cfe5d4] bg-[#f6fbf7] p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="flex-1">
            <label
              htmlFor={inputId}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#0f8237] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#0d6f2f]"
            >
              <FiUpload className="h-4 w-4" />
              {buttonLabel}
            </label>

            <p className="mt-3 break-all text-sm text-slate-600">{fileName}</p>
          </div>

          <div className="w-full sm:w-40">
            <div className="flex h-32 w-full items-center justify-center overflow-hidden rounded-2xl border border-dashed border-[#b9d7c0] bg-white">
              {previewUrl ? (
                <img src={previewUrl} alt="Vista previa de la imagen seleccionada" className="h-full w-full object-cover" />
              ) : (
                <div className="px-4 text-center text-slate-400">
                  <FiImage className="mx-auto h-6 w-6" />
                  <p className="mt-2 text-xs">Vista previa</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
