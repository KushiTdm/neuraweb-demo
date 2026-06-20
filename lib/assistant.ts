import type { VerticalId } from "./types";

export interface AssistantScript {
  greeting: string;
  suggestions: string[];
  /** règles déterministes : si l'un des mots-clés est présent, renvoie la réponse */
  rules: { keywords: string[]; answer: string }[];
  fallback: string;
}

const GENERAL: AssistantScript = {
  greeting:
    "Bonjour 👋 Je suis l'assistant de la NeuraWeb Connected Suite. Je peux vous orienter dans la démo : collectivité, restaurant ou hôtel ?",
  suggestions: ["Qu'est-ce que cette démo ?", "Comment fonctionne la synchro ?", "Parler à NeuraWeb"],
  rules: [
    { keywords: ["démo", "demo", "quoi", "c'est quoi"], answer: "Cette suite illustre le savoir-faire NeuraWeb : pour 3 métiers, un back-office web et une app mobile **connectés en temps réel**. Tout est simulé, les données sont fictives." },
    { keywords: ["synchro", "temps réel", "connecté", "connect"], answer: "Web et mobile partagent le même état (store local). Une action côté app — un signalement, une commande, une demande — apparaît instantanément côté back-office, et inversement. Lancez le « Mode présentation » pour le voir tout seul." },
    { keywords: ["neuraweb", "contact", "projet", "devis", "prix"], answer: "NeuraWeb conçoit sites, apps mobiles, intégrations IA et automatisations (Lille, partout en France). Pour un vrai projet, utilisez le bouton « Discuter de votre projet ». 🚀" },
  ],
  fallback:
    "Je suis une démo : mes réponses sont scriptées. Choisissez un secteur (collectivité, restaurant, hôtel) pour voir l'assistant contextualisé.",
};

const SCRIPTS: Record<VerticalId, AssistantScript> = {
  collectivite: {
    greeting:
      "Bonjour, je suis l'assistant citoyen de la Ville de Néauville 👋 Signalement, démarche, réservation… que puis-je faire ?",
    suggestions: ["Comment signaler un problème ?", "Réserver une salle", "Suivre ma démarche", "Horaires de la mairie"],
    rules: [
      { keywords: ["signal", "voirie", "problème", "probleme", "nid"], answer: "Pour signaler : onglet « Signaler » de l'app → photo + catégorie + localisation. Votre signalement arrive aussitôt dans la console de la mairie, qui suit son avancement jusqu'à résolution. 📍" },
      { keywords: ["réserv", "reserv", "salle", "gymnase", "atelier"], answer: "Rendez-vous dans « Réserver » : salle des fêtes, gymnase, atelier médiathèque… Choisissez un créneau ; la mairie valide la demande et vous êtes notifié·e. 🎉" },
      { keywords: ["démarche", "demarche", "dossier", "urbanisme", "état civil", "etat civil"], answer: "Vos démarches (état civil, urbanisme, inscriptions) sont suivies dans « Mes démarches » avec un statut clair : déposé, en instruction, complément demandé, validé." },
      { keywords: ["horaire", "ouvert", "mairie"], answer: "Mairie ouverte du lundi au vendredi, 8h30–12h et 13h30–17h, samedi matin sur rendez-vous (démo)." },
      { keywords: ["accessib", "rgaa", "rgpd"], answer: "Le site et l'app visent la conformité RGAA (accessibilité) et RGPD. Le back-office expose un tableau de conformité — un vrai différenciateur secteur public. ♿" },
    ],
    fallback: "Je suis l'assistant démo de la mairie. Essayez : « signaler un problème », « réserver une salle » ou « suivre ma démarche ».",
  },
  restaurant: {
    greeting: "Bonjour et bienvenue à La Table d'Henri 🍽️ Une commande à emporter, une réservation, la carte ?",
    suggestions: ["Commander à emporter", "Voir la carte du jour", "Réserver une table", "Programme de fidélité"],
    rules: [
      { keywords: ["command", "emporter", "collect", "retrait"], answer: "Commande en click & collect : choisissez vos plats, payez (paiement simulé) et recevez un **code à 4 chiffres**. La cuisine vous suit en temps réel : reçue → en préparation → prête. 🛍️" },
      { keywords: ["carte", "menu", "plat", "manger"], answer: "La carte du jour est dans l'onglet « Commander ». Pensez au plat **anti-gaspillage** à prix réduit en fin de service — bon pour la planète et l'addition. 🌱" },
      { keywords: ["réserv", "reserv", "table", "couvert"], answer: "Pour réserver une table : date, heure, nombre de couverts. Le restaurant confirme depuis son back-office et vous recevez la confirmation." },
      { keywords: ["fidél", "fidel", "point", "récompense", "recompense"], answer: "Chaque commande cumule des points. Paliers et récompenses sont visibles dans l'onglet « Fidélité ». ⭐" },
      { keywords: ["commission", "uber", "deliveroo", "plateforme", "30"], answer: "En commandant en direct, le restaurant évite les ~30 % de commission des plateformes. Le back-office affiche même les économies réalisées. 💸" },
    ],
    fallback: "Assistant démo du restaurant. Essayez : « commander à emporter », « voir la carte » ou « réserver une table ».",
  },
  hotel: {
    greeting: "Bonjour, bienvenue à l'Hôtel Lumen 🏨 Réservation, check-in, room service… je vous écoute.",
    suggestions: ["Faire mon check-in", "Commander un room service", "Late check-out", "Recommandations locales"],
    rules: [
      { keywords: ["check-in", "checkin", "arriv", "clé", "cle"], answer: "Le check-in en ligne se fait dans « Mon séjour » : il prévient la réception et débloque la **clé digitale** (mock). Plus de file à l'arrivée. 🔑" },
      { keywords: ["room service", "service", "petit-déj", "manger", "commande"], answer: "Dans « Services », envoyez une demande (room service, ménage, taxi…). Elle tombe dans la console réception qui confirme — vous suivez l'avancement en direct. 🛎️" },
      { keywords: ["late", "tardif", "départ", "depart", "check-out", "checkout"], answer: "Demande de late check-out en un tap depuis « Services ». La réception valide selon disponibilité et vous notifie." },
      { keywords: ["réserv", "reserv", "chambre", "nuit", "dispo"], answer: "Réservez dans « Réserver » : dates, type de chambre, paiement simulé, confirmation immédiate. 🛏️" },
      { keywords: ["recommand", "découvrir", "decouvrir", "restaurant", "autour", "visiter"], answer: "L'onglet « Découvrir » propose des adresses locales — dont des restaurants partenaires (clin d'œil cross-secteur de la démo). 🍷" },
    ],
    fallback: "Assistant démo de l'hôtel. Essayez : « faire mon check-in », « room service » ou « late check-out ».",
  },
};

export function getScript(vertical: VerticalId | null): AssistantScript {
  return vertical ? SCRIPTS[vertical] : GENERAL;
}

export function answerFor(vertical: VerticalId | null, input: string): string {
  const script = getScript(vertical);
  const q = input.toLowerCase();
  for (const rule of script.rules) {
    if (rule.keywords.some((k) => q.includes(k))) return rule.answer;
  }
  return script.fallback;
}
