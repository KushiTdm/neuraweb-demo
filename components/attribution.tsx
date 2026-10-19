"use client";

import { useEffect } from "react";

const KEY = "nw_attribution";
const PARAMS = ["utm_source", "utm_medium", "utm_campaign", "ref", "prospect"] as const;

/** Mémorise l'origine de la visite (UTM, ref, prospect) le temps de la session, pour l'ajouter à la demande de contact. */
export function Attribution() {
  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search);
      const found = PARAMS.filter((k) => q.get(k)).map((k) => `${k}=${q.get(k)!.slice(0, 40)}`);
      if (found.length) sessionStorage.setItem(KEY, found.join(" "));
    } catch {
      /* stockage indisponible : on ignore */
    }
  }, []);
  return null;
}

/** Origine mémorisée de la visite (ex. « utm_source=devis utm_campaign=hotel-lille »), ou chaîne vide. */
export function getAttribution(): string {
  try {
    return sessionStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
}
