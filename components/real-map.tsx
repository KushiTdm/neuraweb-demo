"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, LayerGroup } from "leaflet";
import "leaflet/dist/leaflet.css";
import { cn } from "@/lib/utils";

/* ── Coordonnées de la ville fictive de Néauville (réelles pour la carte) ── */
export const NEAUVILLE_CENTER = { lat: 50.6321, lng: 3.0582 };

/** Convertit la position relative (x/y en %) du modèle en lat/lng réels. */
export function xyToLatLng(x: number, y: number): { lat: number; lng: number } {
  return {
    lat: NEAUVILLE_CENTER.lat + (50 - y) * 0.00035,
    lng: NEAUVILLE_CENTER.lng + (x - 50) * 0.00055,
  };
}

/** Inverse : lat/lng réels → position relative (x/y en %) stockée dans le modèle. */
export function latLngToXY(lat: number, lng: number): { x: number; y: number } {
  return {
    x: Math.min(98, Math.max(2, 50 + (lng - NEAUVILLE_CENTER.lng) / 0.00055)),
    y: Math.min(98, Math.max(2, 50 - (lat - NEAUVILLE_CENTER.lat) / 0.00035)),
  };
}

export interface MapPoint {
  id: string;
  lat: number;
  lng: number;
  /** couleur CSS du point (hex) */
  color: string;
  title?: string;
  /** anneau pulsant (ex. signalement « nouveau ») */
  pulse?: boolean;
}

export interface MapCircle {
  id: string;
  lat: number;
  lng: number;
  color: string;
  /** rayon en mètres */
  radiusM: number;
  title?: string;
}

/**
 * Carte OpenStreetMap réelle et interactive (Leaflet), chargée uniquement côté
 * client (import dynamique dans l'effet — Leaflet touche `window` au chargement).
 * - `points` : pastilles colorées (divIcon, aucun asset à charger)
 * - `circles` : halos (points noirs)
 * - `pin` : épingle principale déplaçable par clic si `onPick` est fourni
 */
export function RealMap({
  center = NEAUVILLE_CENTER,
  zoom = 14.5,
  points = [],
  circles = [],
  pin,
  onPick,
  className,
}: {
  center?: { lat: number; lng: number };
  zoom?: number;
  points?: MapPoint[];
  circles?: MapCircle[];
  pin?: { lat: number; lng: number } | null;
  /** clic sur la carte → repositionne l'épingle et remonte la position */
  onPick?: (pos: { lat: number; lng: number }) => void;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const layerRef = useRef<LayerGroup | null>(null);
  const onPickRef = useRef(onPick);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    onPickRef.current = onPick;
  }, [onPick]);

  // Initialisation (une seule fois)
  useEffect(() => {
    let disposed = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (disposed || !containerRef.current || mapRef.current) return;
      const map = L.map(containerRef.current, {
        center: [center.lat, center.lng],
        zoom,
        zoomControl: true,
        attributionControl: false,
        // la molette reste dispo pour scroller la page hôte (démo dans un cadre)
        scrollWheelZoom: false,
      });
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);
      L.control.attribution({ prefix: false }).addAttribution("© OpenStreetMap").addTo(map);
      map.on("click", (e) => {
        onPickRef.current?.({ lat: e.latlng.lat, lng: e.latlng.lng });
      });
      layerRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;
      setReady(true);
    })();
    return () => {
      disposed = true;
      mapRef.current?.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // (Re)dessine points, halos et épingle quand les données changent
  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      const layer = layerRef.current;
      if (cancelled || !layer) return;
      layer.clearLayers();

      for (const c of circles) {
        L.circle([c.lat, c.lng], {
          radius: c.radiusM,
          color: c.color,
          weight: 1.5,
          fillColor: c.color,
          fillOpacity: 0.18,
        })
          .bindTooltip(c.title ?? "", { direction: "top" })
          .addTo(layer);
      }

      for (const p of points) {
        const icon = L.divIcon({
          className: "",
          iconSize: [14, 14],
          iconAnchor: [7, 7],
          html: `<span style="position:relative;display:block;width:14px;height:14px;">
              ${p.pulse ? `<span class="animate-ping" style="position:absolute;inset:0;border-radius:9999px;background:${p.color};opacity:.45;"></span>` : ""}
              <span style="position:absolute;inset:1px;border-radius:9999px;background:${p.color};box-shadow:0 0 0 2px rgba(255,255,255,.9);"></span>
            </span>`,
        });
        const m = L.marker([p.lat, p.lng], { icon }).addTo(layer);
        if (p.title) m.bindTooltip(p.title, { direction: "top" });
      }

      if (pin) {
        const pinIcon = L.divIcon({
          className: "",
          iconSize: [30, 30],
          iconAnchor: [15, 28],
          html: `<svg viewBox="0 0 24 24" width="30" height="30" fill="#4f46e5" stroke="#fff" stroke-width="1.2" style="filter:drop-shadow(0 2px 3px rgba(0,0,0,.35))"><path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7Z"/><circle cx="12" cy="9" r="2.6" fill="#fff" stroke="none"/></svg>`,
        });
        L.marker([pin.lat, pin.lng], { icon: pinIcon, zIndexOffset: 500 }).addTo(layer);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [ready, points, circles, pin]);

  return <div ref={containerRef} className={cn("z-0 h-44 w-full", className)} />;
}
