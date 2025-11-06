import { useEffect, useMemo, useRef, useState } from "react";

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

/**
 * Autocompletado de direcciones (Nominatim).
 * Props:
 * - value: string (dirección visible)
 * - onChange: (text) => void
 * - onSelect: ({ label, lat, lon, raw }) => void   // cuando elige una sugerencia
 * - city: restringe por ciudad (ej: "Río Gallegos")
 * - countryCodes: ej "ar" (opcional)
 */
export default function AddressAutocomplete({
    value,
    onChange,
    onSelect,
    city = "Río Gallegos",
    countryCodes = "ar",
    placeholder = "Calle y número…",
}) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const controllerRef = useRef(null);

    // Debounce simple
    const query = value?.trim() || "";
    useEffect(() => {
        if (!query || query.length < 3) {
            setItems([]);
            setOpen(false);
            return;
        }
        setLoading(true);

        if (controllerRef.current) controllerRef.current.abort();
        const ab = new AbortController();
        controllerRef.current = ab;

        // número que tipeó el usuario (si lo hay)
        const typedNumber = (query.match(/\b\d+\b/) || [null])[0];

        async function fetchStructuredFirst() {
            // 1) intento con búsqueda estructurada
            const url1 = new URL(NOMINATIM_URL);
            url1.searchParams.set("format", "jsonv2");
            url1.searchParams.set("addressdetails", "1");
            url1.searchParams.set("limit", "5");
            url1.searchParams.set("street", query); // "los pozos 1089"
            url1.searchParams.set("city", city);    // "Río Gallegos"
            if (countryCodes) url1.searchParams.set("countrycodes", countryCodes);

            const res1 = await fetch(url1.toString(), {
                signal: ab.signal,
                headers: { "Accept-Language": "es" },
            });
            let data = await res1.json();

            // 2) si no hubo resultados, fallback a 'q'
            if (!Array.isArray(data) || data.length === 0) {
                const url2 = new URL(NOMINATIM_URL);
                url2.searchParams.set("format", "jsonv2");
                url2.searchParams.set("addressdetails", "1");
                url2.searchParams.set("limit", "5");
                url2.searchParams.set("q", `${query}, ${city}`);
                if (countryCodes) url2.searchParams.set("countrycodes", countryCodes);
                const res2 = await fetch(url2.toString(), {
                    signal: ab.signal,
                    headers: { "Accept-Language": "es" },
                });
                data = await res2.json();
            }

            const mapped = (data || []).map((r) => {
                const addr = r.address || {};

                // si no vino house_number y el usuario tipeó uno, lo insertamos
                const house = addr.house_number || typedNumber || "";

                // armamos label SIN barrio/suburb/neighbourhood
                const partes = [
                    [addr.road, house].filter(Boolean).join(" "),   // "Los Pozos 1089"
                    addr.city || addr.town,                        // "Río Gallegos"
                    addr.county,                                   // "Güer Aike"
                    addr.state,                                    // "Santa Cruz"
                    addr.country                                   // "Argentina"
                ].filter(Boolean);

                const label = partes.join(", ");

                return {
                    label,
                    lat: r.lat,
                    lon: r.lon,
                    raw: r,
                };
            });

            setItems(mapped);
            setOpen(true);
        }

        const t = setTimeout(() => {
            fetchStructuredFirst().catch(() => { });
        }, 300);

        return () => {
            clearTimeout(t);
            ab.abort();
        };
    }, [query, city, countryCodes]);


    function pick(item) {
        onSelect?.(item);
        setOpen(false);
    }

    return (
        <div className="relative">
            <input
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                onFocus={() => items.length > 0 && setOpen(true)}
                placeholder={placeholder}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
            {loading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                    Buscando…
                </div>
            )}
            {open && items.length > 0 && (
                <div className="absolute z-10 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
                    {items.map((it, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => pick(it)}
                            className="block w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                        >
                            {it.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
