import { FiImage, FiMapPin } from "react-icons/fi";
import { getAssetUrl } from "../../api/api";
import Modal from "../ui/Modal";

function getPrimaryImage(report) {
  return report?.fotos?.[0] ? getAssetUrl(report.fotos[0]) : "";
}

function normalizeUser(user) {
  if (!user) return "No disponible";
  if (typeof user === "string") return user;
  if (user.nombre && user.email) return `${user.nombre} (${user.email})`;
  return user.nombre || user.email || "No disponible";
}

function PlaceholderImage() {
  return (
    <div className="flex h-full min-h-[240px] items-center justify-center text-slate-400">
      <div className="text-center">
        <FiImage className="mx-auto h-8 w-8" />
        <p className="mt-2 text-sm">Sin imagen disponible</p>
      </div>
    </div>
  );
}

function DetailItem({ label, value, fullWidth = false }) {
  return (
    <div className={fullWidth ? "md:col-span-2" : ""}>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm leading-6 text-slate-700">{value || "-"}</dd>
    </div>
  );
}

export default function ReportDetailModal({
  report,
  onClose,
  onOpenMap,
  mapDisabled = false,
  statusBadge = null,
  moderationBadge = null,
  actions = null,
  showModeration = false,
  showId = false,
}) {
  const imageUrl = getPrimaryImage(report);

  return (
    <Modal
      open={!!report}
      onClose={onClose}
      title={report?.titulo || "Reporte comunitario"}
      size="lg"
    >
      <div className="grid grid-cols-1 gap-0 md:grid-cols-[340px,1fr]">
        <div className="bg-slate-100">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={report?.titulo || "Reporte comunitario"}
              className="h-full min-h-[240px] w-full object-cover"
            />
          ) : (
            <PlaceholderImage />
          )}
        </div>

        <div className="p-1 sm:p-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#66a939]">
            Reporte comunitario
          </p>
          {showId && (
            <p className="mt-1 break-all text-sm text-slate-500">
              {report?.code || report?._id || "-"}
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {moderationBadge}
            {statusBadge}
          </div>

          <dl className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <DetailItem label="Barrio" value={report?.barrio || "-"} />
            <DetailItem label="Dirección" value={report?.direccion || "-"} />
            <DetailItem label="Severidad" value={report?.severidad || "-"} />
            <DetailItem label="Fecha" value={report?.createdAtLabel || "-"} />
            {showModeration && <DetailItem label="Moderación" value={report?.statusLabel || "-"} />}
            {showModeration && <DetailItem label="Estado operativo" value={report?.estadoLabel || "-"} />}
            <DetailItem label="Usuario creador" value={normalizeUser(report?.user)} />
            {showId && <DetailItem label="ID" value={report?._id || "-"} />}
            <DetailItem
              label="Descripción"
              value={report?.descripcion || "Sin descripción"}
              fullWidth
            />
          </dl>

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onOpenMap}
              disabled={mapDisabled}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiMapPin className="h-4 w-4" />
              Ver en mapa
            </button>
            {actions}
          </div>
        </div>
      </div>
    </Modal>
  );
}
