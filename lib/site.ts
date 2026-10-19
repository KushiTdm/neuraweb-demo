// Constantes liées au site principal NeuraWeb.
// Les liens reprennent ceux de l'accueil du portfolio (en-tête, boutons et pied de page de neuraweb.fr/fr).

const SITE = "https://neuraweb.fr";

/** Accueil du site principal (français) — cible du lien « retour » depuis la démo. */
export const NEURAWEB_URL = `${SITE}/fr`;

/** Sous-domaine Vercel hébergeant cette démo. */
export const DEMO_URL = "https://demo.neuraweb.fr";

/** Pages du site principal, telles que liées depuis son accueil. */
export const NEURAWEB_LINKS = {
  home: `${SITE}/fr`,
  /** Bouton principal de l'accueil : « Demander un devis ». */
  booking: `${SITE}/fr/booking`,
  /** Bouton secondaire de l'accueil : « Voir les tarifs ». */
  services: `${SITE}/fr/services`,
  contact: `${SITE}/fr/contact`,
  blog: `${SITE}/fr/blog`,
  team: `${SITE}/fr/equipe`,
  web: `${SITE}/fr/developpement-web`,
  mobile: `${SITE}/fr/mobile-app-development`,
  automation: `${SITE}/fr/automatisation`,
  ai: `${SITE}/fr/integration-ia`,
  sectors: `${SITE}/fr/secteurs`,
  health: `${SITE}/fr/secteurs/sante`,
  restaurants: `${SITE}/fr/secteurs/restaurants-hotels`,
  publicSector: `${SITE}/fr/secteurs/collectivites`,
} as const;
