"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/** True une fois monté côté client — évite les mismatchs d'hydratation pour tout
 *  rendu dépendant de Date.now() ou de l'état persistant. Pattern SSR-safe sans effet. */
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true, // client
    () => false, // serveur
  );
}
