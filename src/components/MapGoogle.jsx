import { useEffect, useMemo, useRef } from "react";
import { FiAlertCircle, FiMapPin } from "react-icons/fi";
import { useGoogleMaps } from "../utils/useGoogleMaps";

const RG_CENTER = { lat: -51.623, lng: -69.216 };
const MATERIAL_PRIORITY = ["plastico", "vidrio", "papel", "papel_carton", "pilas", "aceite"];
const MATERIAL_META = {
  plastico: { label: "Plástico", color: "#E6F8EE", textColor: "#2D5B41" },
  vidrio: { label: "Vidrio", color: "#EAF4FF", textColor: "#2E5C89" },
  papel: { label: "Papel / Cartón", color: "#FFF6E6", textColor: "#8A6423" },
  papel_carton: { label: "Papel / Cartón", color: "#FFF6E6", textColor: "#8A6423" },
  pilas: { label: "Pilas", color: "#FCE9EF", textColor: "#8A3F58" },
  aceite: { label: "Aceite usado", color: "#EEF6FF", textColor: "#395D84" },
};
const FALLBACK_COLOR = "#66A939";

function normalizeMaterial(type) {
  if (!type) return "";
  return type === "papel_carton" ? "papel" : type;
}

function getMaterialMeta(type) {
  return MATERIAL_META[type] || MATERIAL_META[normalizeMaterial(type)] || null;
}

function getPrimaryType(types = [], activeType = "") {
  const normalizedTypes = types.map(normalizeMaterial);

  if (activeType && normalizedTypes.includes(normalizeMaterial(activeType))) {
    return normalizeMaterial(activeType);
  }

  return MATERIAL_PRIORITY
    .map(normalizeMaterial)
    .find((type) => normalizedTypes.includes(type)) || "";
}

function getMarkerColor(types, activeType) {
  const primaryType = getPrimaryType(types, activeType);
  return getMaterialMeta(primaryType)?.color || FALLBACK_COLOR;
}

function isValidPointCoordinates(coords) {
  if (!Array.isArray(coords) || coords.length < 2) return false;

  const [lng, lat] = coords.map(Number);
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

function formatStateLabel(state) {
  const labels = {
    activo: "Activo",
    inactivo: "Temporalmente inactivo",
  };

  return labels[state] || "Sin estado";
}

function buildInfoWindowContent(point, position) {
  const title = point.title || point.name || "Punto verde";
  const address = point.address || point.direccion || "Dirección no disponible";
  const materials = Array.isArray(point.types)
    ? point.types.map(normalizeMaterial).filter(Boolean)
    : [];
  const uniqueMaterials = Array.from(new Set(materials));
  const materialBadges = uniqueMaterials.length
    ? uniqueMaterials
        .map((material) => {
          const meta = getMaterialMeta(material);
          return `<span style="
            display:inline-flex;
            align-items:center;
            padding:4px 8px;
            border-radius:999px;
            background:${meta?.color || "#F3F4F6"};
            color:${meta?.textColor || "#374151"};
            font-size:12px;
            font-weight:600;
            border:1px solid rgba(0,0,0,0.06);
          ">${meta?.label || material}</span>`;
        })
        .join("")
    : `<span style="
      display:inline-flex;
      align-items:center;
      padding:4px 8px;
      border-radius:999px;
      background:#F3F4F6;
      color:#374151;
      font-size:12px;
      font-weight:600;
    ">Sin materiales especificados</span>`;

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${position.lat},${position.lng}`;

  return `
    <div style="max-width:270px; padding:4px 2px; font-family:Arial,sans-serif; color:#2d3d33;">
      <div style="font-size:16px; font-weight:700; margin-bottom:8px;">
        ${title}
      </div>
      ${
        point.barrio
          ? `<div style="font-size:13px; color:#4B5563; margin-bottom:4px;">
              Barrio: <strong>${point.barrio}</strong>
            </div>`
          : ""
      }
      <div style="font-size:13px; color:#4B5563; margin-bottom:8px;">
        Dirección: ${address}
      </div>
      <div style="font-size:13px; color:#4B5563; margin-bottom:6px;">
        Estado: <strong>${formatStateLabel(point.estado)}</strong>
      </div>
      <div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:12px;">
        ${materialBadges}
      </div>
      <a
        href="${mapsUrl}"
        target="_blank"
        rel="noopener noreferrer"
        style="
          display:inline-flex;
          align-items:center;
          justify-content:center;
          padding:8px 12px;
          border-radius:10px;
          background:#0f8237;
          color:#FFFFFF;
          text-decoration:none;
          font-size:13px;
          font-weight:600;
        "
      >
        Cómo llegar en Google Maps
      </a>
    </div>
  `;
}

function MapState({ title, description, tone = "neutral" }) {
  const tones = {
    neutral: "border-[#dce8ce] bg-[#fbfdf8] text-slate-600",
    error: "border-[#f0d7dc] bg-[#fff8f8] text-rose-700",
  };

  return (
    <div className={`flex h-full min-h-[460px] items-center justify-center px-6 text-center sm:min-h-[560px] ${tones[tone] || tones.neutral}`}>
      <div className="max-w-md">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
          {tone === "error" ? (
            <FiAlertCircle className="h-6 w-6 text-rose-500" />
          ) : (
            <FiMapPin className="h-6 w-6 text-[#66a939]" />
          )}
        </div>
        <p className="mt-4 text-lg font-semibold text-[#203014]">{title}</p>
        <p className="mt-2 text-sm leading-6">{description}</p>
      </div>
    </div>
  );
}

export default function MapGoogle({ points = [], activeType = "" }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const infoWindowRef = useRef(null);
  const { isLoaded, error } = useGoogleMaps();

  const validPoints = useMemo(
    () => points.filter((point) => isValidPointCoordinates(point.location?.coordinates)),
    [points]
  );

  useEffect(() => {
    if (!isLoaded || !mapContainerRef.current || mapInstanceRef.current) return;

    mapInstanceRef.current = new window.google.maps.Map(mapContainerRef.current, {
      center: RG_CENTER,
      zoom: 13,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
    });
  }, [isLoaded]);

  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current) return;

    const google = window.google;
    const map = mapInstanceRef.current;

    markersRef.current.forEach((marker) => {
      google.maps.event.clearInstanceListeners(marker);
      marker.setMap(null);
    });
    markersRef.current = [];

    if (!infoWindowRef.current) {
      infoWindowRef.current = new google.maps.InfoWindow();
    }

    const bounds = new google.maps.LatLngBounds();

    validPoints.forEach((point) => {
      const [lng, lat] = point.location.coordinates.map(Number);
      const position = { lat, lng };
      const markerColor = getMarkerColor(point.types, activeType);

      const marker = new google.maps.Marker({
        position,
        map,
        title: point.title || point.name || "Punto verde",
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: markerColor,
          fillOpacity: 1,
          strokeColor: "#2D3D33",
          strokeWeight: 1.5,
          scale: 10,
        },
      });

      marker.addListener("click", () => {
        infoWindowRef.current.setContent(buildInfoWindowContent(point, position));
        infoWindowRef.current.open({ anchor: marker, map });
      });

      markersRef.current.push(marker);
      bounds.extend(position);
    });

    if (validPoints.length === 1) {
      map.setCenter(bounds.getCenter());
      map.setZoom(15);
    } else if (validPoints.length > 1) {
      map.fitBounds(bounds);
    } else {
      map.setCenter(RG_CENTER);
      map.setZoom(13);
    }
  }, [activeType, isLoaded, validPoints]);

  if (error) {
    return (
      <MapState
        tone="error"
        title="No pudimos cargar Google Maps"
        description={error.message || "Revisá la API key o la conexión e intentá nuevamente."}
      />
    );
  }

  if (!isLoaded) {
    return (
      <MapState
        title="Cargando Google Maps"
        description="Estamos preparando los puntos verdes disponibles para Río Gallegos."
      />
    );
  }

  return <div ref={mapContainerRef} className="h-[460px] w-full sm:h-[560px] xl:h-[72vh]" />;
}
