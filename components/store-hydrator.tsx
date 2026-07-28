"use client";

import { useEffect } from "react";
import { STORE_STORAGE_KEY, useDemoStore } from "@/lib/store";

/** Réhydrate le store persistant (skipHydration) et enregistre le service worker PWA.
 *  Monté une seule fois dans le layout racine. */
export function StoreHydrator() {
  useEffect(() => {
    void useDemoStore.persist.rehydrate();
    // Synchro temps réel entre onglets/fenêtres : quand un autre onglet écrit
    // (ex. app citoyenne d'un côté, console mairie de l'autre), on recharge
    // l'état depuis le localStorage. Sans cela, chaque onglet écraserait les
    // écritures de l'autre (dernier écrivain gagnant → signalements perdus).
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORE_STORAGE_KEY) void useDemoStore.persist.rehydrate();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
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
