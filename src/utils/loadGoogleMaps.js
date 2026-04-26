const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const GOOGLE_MAPS_SCRIPT_ID = "ecorg-google-maps-script";

let googleMapsPromise = null;

function hasRequestedLibraries(google, libraries) {
  if (!google?.maps) return false;

  return libraries.every((library) => {
    if (library === "places") return !!google.maps.places;
    return true;
  });
}

export function loadGoogleMaps({ libraries = [] } = {}) {
  if (!GOOGLE_MAPS_API_KEY) {
    return Promise.reject(
      new Error("Falta VITE_GOOGLE_MAPS_API_KEY en la configuración del frontend.")
    );
  }

  const normalizedLibraries = Array.from(new Set(libraries)).sort();

  if (hasRequestedLibraries(window.google, normalizedLibraries)) {
    return Promise.resolve(window.google);
  }

  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(GOOGLE_MAPS_SCRIPT_ID);

    const handleLoad = () => {
      if (hasRequestedLibraries(window.google, normalizedLibraries)) {
        resolve(window.google);
        return;
      }

      googleMapsPromise = null;
      reject(new Error("Google Maps se cargó, pero faltan librerías requeridas."));
    };

    const handleError = () => {
      googleMapsPromise = null;
      reject(new Error("No se pudo cargar Google Maps. Revisá la API key o la conexión."));
    };

    if (existingScript) {
      existingScript.addEventListener("load", handleLoad, { once: true });
      existingScript.addEventListener("error", handleError, { once: true });
      return;
    }

    const script = document.createElement("script");
    const params = new URLSearchParams({
      key: GOOGLE_MAPS_API_KEY,
      language: "es",
      region: "AR",
    });

    if (normalizedLibraries.length > 0) {
      params.set("libraries", normalizedLibraries.join(","));
    }

    script.id = GOOGLE_MAPS_SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
    script.async = true;
    script.defer = true;
    script.dataset.ecorgGoogleMaps = "true";
    script.addEventListener("load", handleLoad, { once: true });
    script.addEventListener("error", handleError, { once: true });

    document.head.appendChild(script);
  });

  return googleMapsPromise;
}

export function loadGoogleMapsPlaces() {
  return loadGoogleMaps({ libraries: ["places"] });
}
