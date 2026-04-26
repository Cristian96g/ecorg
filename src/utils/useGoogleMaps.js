import { useEffect, useState } from "react";
import { loadGoogleMaps } from "./loadGoogleMaps";

export function useGoogleMaps() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    setIsLoaded(false);
    setError(null);

    loadGoogleMaps({ libraries: ["places"] })
      .then(() => {
        if (!cancelled) {
          setIsLoaded(true);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { isLoaded, error };
}
