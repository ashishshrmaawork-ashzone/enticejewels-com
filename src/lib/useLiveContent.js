"use client";

import { useEffect, useState } from "react";

// One request at a time. Preserve good content on transient failures and ignore
// responses from a previous route, filter, pagination selection, or unmount.
export default function useLiveContent(loader, initialData = null) {
  const [fallback] = useState(initialData);
  const [snapshot, setSnapshot] = useState({ loader, data: fallback, error: null, loaded: fallback !== null });
  const current = snapshot.loader === loader ? snapshot : { data: fallback, error: null, loaded: fallback !== null };

  useEffect(() => {
    let active = true;
    let pending = false;
    async function refresh() {
      if (pending || document.visibilityState === "hidden") return;
      pending = true;
      try {
        const fresh = await loader();
        if (active) setSnapshot(previous => ({
          loader,
          data: previous.loader === loader && JSON.stringify(previous.data) === JSON.stringify(fresh) ? previous.data : fresh,
          error: null,
          loaded: true,
        }));
      } catch (error) {
        if (active) setSnapshot(previous => ({
          loader,
          data: previous.loader === loader ? previous.data : fallback,
          loaded: previous.loader === loader ? previous.loaded : fallback !== null,
          error,
        }));
      } finally {
        pending = false;
      }
    }
    refresh();
    const timer = window.setInterval(refresh, 5000);
    window.addEventListener("focus", refresh);
    window.addEventListener("online", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      active = false;
      window.clearInterval(timer);
      window.removeEventListener("focus", refresh);
      window.removeEventListener("online", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [loader, fallback]);

  return { data: current.data, error: current.error, loaded: current.loaded, loading: !current.loaded && !current.error };
}
