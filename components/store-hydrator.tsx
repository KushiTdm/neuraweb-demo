"use client";

import { useEffect } from "react";
import { useDemoStore } from "@/lib/store";

/** Réhydrate le store persistant (skipHydration) et enregistre le service worker PWA.
 *  Monté une seule fois dans le layout racine. */
export function StoreHydrator() {
  useEffect(() => {
    void useDemoStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* PWA best-effort — sans incidence sur la démo */
      });
    }
  }, []);

  return null;
}
