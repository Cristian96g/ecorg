// import { useEffect, useMemo, useRef, useState } from "react";

// const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

// /**
//  * Autocompletado de direcciones (Nominatim).
//  * Props:
//  * - value: string (dirección visible)
//  * - onChange: (text) => void
//  * - onSelect: ({ label, lat, lon, raw }) => void   // cuando elige una sugerencia
//  * - city: restringe por ciudad (ej: "Río Gallegos")
//  * - countryCodes: ej "ar" (opcional)
//  */
// export default function AddressAutocomplete({
//     value,
//     onChange,
//     onSelect,
//     city = "Río Gallegos",
//     countryCodes = "ar",
//     placeholder = "Calle y número…",
// }) {
//     const [open, setOpen] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [items, setItems] = useState([]);
//     const controllerRef = useRef(null);

//     // Debounce simple
//     const query = value?.trim() || "";
//     useEffect(() => {
//         if (!query || query.length < 3) {
//             setItems([]);
//             setOpen(false);
//             return;
//         }
//         setLoading(true);

//         if (controllerRef.current) controllerRef.current.abort();
//         const ab = new AbortController();
//         controllerRef.current = ab;

//         // número que tipeó el usuario (si lo hay)
//         const typedNumber = (query.match(/\b\d+\b/) || [null])[0];

//         async function fetchStructuredFirst() {
//             // 1) intento con búsqueda estructurada
//             const url1 = new URL(NOMINATIM_URL);
//             url1.searchParams.set("format", "jsonv2");
//             url1.searchParams.set("addressdetails", "1");
//             url1.searchParams.set("limit", "5");
//             url1.searchParams.set("street", query); // "los pozos 1089"
//             url1.searchParams.set("city", city);    // "Río Gallegos"
//             if (countryCodes) url1.searchParams.set("countrycodes", countryCodes);

//             const res1 = await fetch(url1.toString(), {
//                 signal: ab.signal,
//                 headers: { "Accept-Language": "es" },
//             });
//             let data = await res1.json();

//             // 2) si no hubo resultados, fallback a 'q'
//             if (!Array.isArray(data) || data.length === 0) {
//                 const url2 = new URL(NOMINATIM_URL);
//                 url2.searchParams.set("format", "jsonv2");
//                 url2.searchParams.set("addressdetails", "1");
//                 url2.searchParams.set("limit", "5");
//                 url2.searchParams.set("q", `${query}, ${city}`);
//                 if (countryCodes) url2.searchParams.set("countrycodes", countryCodes);
//                 const res2 = await fetch(url2.toString(), {
//                     signal: ab.signal,
//                     headers: { "Accept-Language": "es" },
//                 });
//                 data = await res2.json();
//             }

//             const mapped = (data || []).map((r) => {
//                 const addr = r.address || {};

//                 // si no vino house_number y el usuario tipeó uno, lo insertamos
//                 const house = addr.house_number || typedNumber || "";

//                 // armamos label SIN barrio/suburb/neighbourhood
//                 const partes = [
//                     [addr.road, house].filter(Boolean).join(" "),   // "Los Pozos 1089"
//                     addr.city || addr.town,                        // "Río Gallegos"
//                     addr.county,                                   // "Güer Aike"
//                     addr.state,                                    // "Santa Cruz"
//                     addr.country                                   // "Argentina"
//                 ].filter(Boolean);

//                 const label = partes.join(", ");

//                 return {
//                     label,
//                     lat: r.lat,
//                     lon: r.lon,
//                     raw: r,
//                 };
//             });

//             setItems(mapped);
//             setOpen(true);
//         }

//         const t = setTimeout(() => {
//             fetchStructuredFirst().catch(() => { });
//         }, 300);

//         return () => {
//             clearTimeout(t);
//             ab.abort();
//         };
//     }, [query, city, countryCodes]);


//     function pick(item) {
//         onSelect?.(item);
//         setOpen(false);
//     }

//     return (
//         <div className="relative">
//             <input
//                 value={value}
//                 onChange={(e) => onChange?.(e.target.value)}
//                 onFocus={() => items.length > 0 && setOpen(true)}
//                 placeholder={placeholder}
//                 className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300"
//             />
//             {loading && (
//                 <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
//                     Buscando…
//                 </div>
//             )}
//             {open && items.length > 0 && (
//                 <div className="absolute z-10 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
//                     {items.map((it, i) => (
//                         <button
//                             key={i}
//                             type="button"
//                             onClick={() => pick(it)}
//                             className="block w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
//                         >
//                             {it.label}
//                         </button>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// }


import { useEffect, useRef, useState } from "react";
import { loadGoogleMapsPlaces } from "../utils/loadGoogleMaps";
import { notifyError, notifyWarning } from "../utils/feedback";

const DEFAULT_CITY_CENTER = {
  // Centro aproximado de Río Gallegos
  lat: -51.623, 
  lng: -69.218,
};

/**
 * Autocompletado de direcciones con Google Places.
 * Props:
 * - value: string (dirección visible)
 * - onChange: (text) => void
 * - onSelect: ({ label, lat, lon, raw }) => void   // cuando elige una sugerencia
 * - city: ej: "Río Gallegos" (solo para contexto / futuro)
 * - countryCodes: ej "ar" (opcional)
 */
export default function AddressAutocomplete({
  value,
  onChange,
  onSelect,
  countryCodes = "ar",
  placeholder = "Calle y número…",
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);

  const serviceRef = useRef(null);
  const placesRef = useRef(null);
  const sessionTokenRef = useRef(null);
  const debounceRef = useRef(null);

  const query = value?.trim() || "";

  // Cargar Google Maps + crear servicios
  useEffect(() => {
    let canceled = false;

    loadGoogleMapsPlaces()
      .then((google) => {
        if (canceled) return;

        if (!serviceRef.current) {
          serviceRef.current = new google.maps.places.AutocompleteService();
        }
        if (!placesRef.current) {
          // PlacesService necesita un nodo DOM
          const dummy = document.createElement("div");
          placesRef.current = new google.maps.places.PlacesService(dummy);
        }
        if (!sessionTokenRef.current) {
          sessionTokenRef.current =
            new google.maps.places.AutocompleteSessionToken();
        }
      })
      .catch((err) => {
        console.error("Error cargando Google Maps Places:", err);
        notifyError("No pudimos cargar el autocompletado de direcciones.");
      });

    return () => {
      canceled = true;
    };
  }, []);

  // Buscar sugerencias cuando cambia el texto
  useEffect(() => {
    if (!query || query.length < 3) {
      setItems([]);
      setOpen(false);
      return;
    }

    setLoading(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      loadGoogleMapsPlaces()
        .then((google) => {
          const service = serviceRef.current;
          if (!service) {
            setLoading(false);
            return;
          }

          const request = {
            input: query,
            language: "es",
            // components limita por país
            ...(countryCodes && { componentRestrictions: { country: countryCodes } }),
            sessionToken: sessionTokenRef.current,
            // Opcional: sesgar por ubicación de Río Gallegos
            locationBias: new google.maps.Circle({
              center: DEFAULT_CITY_CENTER,
              radius: 15000, // 15km alrededor
            }),
          };

          service.getPlacePredictions(request, (predictions, status) => {
            if (status !== google.maps.places.PlacesServiceStatus.OK || !predictions) {
              setItems([]);
              setOpen(false);
              setLoading(false);
              return;
            }

            const mapped = predictions.map((p) => ({
              label: p.description,
              placeId: p.place_id,
              raw: p,
            }));

            setItems(mapped);
            setOpen(true);
            setLoading(false);
          });
        })
        .catch((err) => {
          console.error("Error en getPlacePredictions:", err);
          notifyWarning("No pudimos buscar sugerencias de direcciones.");
          setLoading(false);
        });
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, countryCodes]);

  function handlePick(item) {
    // Pedimos detalles para obtener lat/lng exactos
    loadGoogleMapsPlaces()
      .then((google) => {
        const places = placesRef.current;
        if (!places) return;

        places.getDetails(
          {
            placeId: item.placeId,
            fields: ["formatted_address", "geometry"],
            sessionToken: sessionTokenRef.current,
          },
          (place, status) => {
            if (status !== google.maps.places.PlacesServiceStatus.OK || !place) {
              console.warn("No se pudieron obtener detalles del lugar.");
              return;
            }

            const loc = place.geometry?.location;
            const lat = loc?.lat();
            const lng = loc?.lng();

            const payload = {
              label: place.formatted_address || item.label,
              lat,
              lon: lng,
              raw: place,
            };

            onSelect?.(payload);
            setOpen(false);

            // Opcional: resetear token de sesión para siguiente búsqueda
            sessionTokenRef.current =
              new google.maps.places.AutocompleteSessionToken();
          }
        );
      })
      .catch((err) => {
        console.error("Error en getDetails:", err);
        notifyWarning("No pudimos obtener el detalle de esa dirección.");
      });
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
              key={it.placeId || i}
              type="button"
              onClick={() => handlePick(it)}
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
