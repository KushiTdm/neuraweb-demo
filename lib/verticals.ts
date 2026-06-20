import type { VerticalId } from "./types";

export interface VerticalConfig {
  id: VerticalId;
  /** segment de route racine, ex. "c/collectivite" */
  slug: string;
  name: string;
  tagline: string;
  /** secteur affiché */
  sector: string;
  emoji: string;
  /** couleur d'accent secondaire (classe Tailwind de base, ex. "indigo") */
  accent: "indigo" | "amber" | "teal";
  /** styles dérivés prêts à l'emploi (évite le purge dynamique de Tailwind) */
  styles: {
    /** dégradé de carte launcher */
    gradient: string;
    /** texte d'accent */
    text: string;
    /** fond d'accent doux */
    softBg: string;
    /** bordure d'accent */
    border: string;
    /** bouton plein */
    solid: string;
    /** halo */
    halo: string;
    /** point/anneau */
    ring: string;
  };
  appName: string;
  adminName: string;
  features: string[];
  /** surface côté usager : app mobile (collectivité) ou site web (resto/hôtel) */
  clientSurface: "phone" | "browser";
  /** libellé court de la surface usager */
  clientLabel: string;
  /** URL fictive affichée dans le BrowserFrame (si site web) */
  clientUrl?: string;
}

export const VERTICALS: Record<VerticalId, VerticalConfig> = {
  collectivite: {
    id: "collectivite",
    slug: "c/collectivite",
    name: "Ville de Néauville",
    sector: "Collectivité",
    tagline: "Back-office mairie + application citoyenne connectés",
    emoji: "🏛️",
    accent: "indigo",
    styles: {
      gradient: "from-indigo-500/20 via-sky-500/10 to-transparent",
      text: "text-indigo-300",
      softBg: "bg-indigo-500/10",
      border: "border-indigo-400/30",
      solid: "bg-indigo-500 hover:bg-indigo-400 text-white",
      halo: "bg-indigo-500",
      ring: "ring-indigo-400/40",
    },
    appName: "Néauville & moi",
    adminName: "Console mairie",
    features: ["Signalements citoyens", "Réservations municipales", "Démarches en ligne", "RGAA / RGPD"],
    clientSurface: "phone",
    clientLabel: "Application citoyenne",
  },
  restaurant: {
    id: "restaurant",
    slug: "r/restaurant",
    name: "La Table d'Henri",
    sector: "Restaurant",
    tagline: "Écran cuisine + application client connectés",
    emoji: "🍽️",
    accent: "amber",
    styles: {
      gradient: "from-amber-500/20 via-coral/10 to-transparent",
      text: "text-amber-300",
      softBg: "bg-amber-500/10",
      border: "border-amber-400/30",
      solid: "bg-amber-500 hover:bg-amber-400 text-navy-950",
      halo: "bg-amber-500",
      ring: "ring-amber-400/40",
    },
    appName: "La Table d'Henri",
    adminName: "Cockpit resto",
    features: ["Commandes en ligne", "Click & collect", "Réservations", "Carte & prix"],
    clientSurface: "browser",
    clientLabel: "Site web client",
    clientUrl: "latabledhenri.fr",
  },
  hotel: {
    id: "hotel",
    slug: "h/hotel",
    name: "Hôtel Lumen",
    sector: "Hôtel",
    tagline: "Console réception + application voyageur connectées",
    emoji: "🏨",
    accent: "teal",
    styles: {
      gradient: "from-teal-500/20 via-cyan-500/10 to-transparent",
      text: "text-teal-300",
      softBg: "bg-teal-500/10",
      border: "border-teal-400/30",
      solid: "bg-teal-500 hover:bg-teal-400 text-navy-950",
      halo: "bg-teal-500",
      ring: "ring-teal-400/40",
    },
    appName: "Hôtel Lumen",
    adminName: "Console réception",
    features: ["Réservation en ligne", "Conciergerie", "Check-in en ligne", "Tarifs & dispo"],
    clientSurface: "browser",
    clientLabel: "Site web voyageur",
    clientUrl: "hotellumen.fr",
  },
};

export const VERTICAL_LIST = Object.values(VERTICALS);

export function verticalFromPath(pathname: string): VerticalId | null {
  if (pathname.startsWith("/c/collectivite")) return "collectivite";
  if (pathname.startsWith("/r/restaurant")) return "restaurant";
  if (pathname.startsWith("/h/hotel")) return "hotel";
  return null;
}

/* ── Libellés de statut (FR) ─────────────────────────────────────────────── */
export const REPORT_STATUS_LABEL = {
  nouveau: "Nouveau",
  recu: "Reçu",
  en_cours: "En cours",
  resolu: "Résolu",
} as const;

export const ORDER_STATUS_LABEL = {
  en_attente: "En attente",
  en_preparation: "En préparation",
  prete: "Prête",
  recuperee: "Récupérée",
  refusee: "Refusée",
} as const;

export const HOTEL_RESERVATION_STATUS_LABEL = {
  demande: "Demande",
  confirmee: "Confirmée",
  refusee: "Refusée",
  arrivee: "Arrivée",
  partie: "Partie",
} as const;

export const SERVICE_STATUS_LABEL = {
  nouvelle: "Nouvelle",
  en_cours: "En cours",
  traitee: "Traitée",
} as const;

export const SERVICE_KIND_LABEL = {
  room_service: "Room service",
  late_checkout: "Late check-out",
  taxi: "Taxi / navette",
  menage: "Ménage",
  spa: "Spa & bien-être",
} as const;

export const RESERVATION_STATUS_LABEL = {
  demande: "Demande",
  validee: "Validée",
  refusee: "Refusée",
  annulee: "Annulée",
} as const;

export const PROCEDURE_STATUS_LABEL = {
  depose: "Déposé",
  instruction: "En instruction",
  complement: "Complément demandé",
  valide: "Validé",
} as const;
