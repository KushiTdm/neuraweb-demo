import type { VerticalId } from "./types";

export interface AssistantScript {
  greeting: string;
  suggestions: string[];
  /** règles déterministes : si l'un des mots-clés est présent, renvoie la réponse */
  rules: { keywords: string[]; answer: string }[];
  fallback: string;
}

// ============================================================
// CONNAISSANCE NEURAWEB — partagée par tous les scripts.
// Réponses scriptées (démo, aucun appel IA). Prix canoniques :
// Starter 1 490 € / Business 3 990 € / Premium 7 990 €.
// ============================================================
const NEURAWEB_RULES: { keywords: string[]; answer: string }[] = [
  {
    keywords: ["prix", "tarif", "coût", "cout", "combien", "budget", "devis"],
    answer:
      "Voici nos packs sites web : **Starter 1 490 €** (vitrine jusqu'à 8 pages, SEO), **Business 3 990 €** (le plus populaire : + admin, blog, analytics) et **Premium 7 990 €** (e-commerce Stripe, intégrations, support 24/7). L'**Automatisation** démarre à 999 €, l'**Intégration IA** à 1 499 €, une **app mobile** à partir de 8 900 €. Pour un chiffrage précis, cliquez sur « Discuter de votre projet ». 💬",
  },
  {
    keywords: ["pack", "offre", "formule", "que proposez", "services", "prestation"],
    answer:
      "NeuraWeb couvre 4 domaines : **sites web** (Starter 1 490 € / Business 3 990 € / Premium 7 990 €), **automatisation** de tâches (n8n, dès 999 €), **intégration IA** (chatbots & agents, dès 1 499 €) et **apps mobiles** (dès 8 900 €). Quel est votre besoin ?",
  },
  {
    keywords: ["site", "vitrine", "web", "internet"],
    answer:
      "Nous créons des sites sur-mesure en Next.js, rapides et optimisés SEO. **Starter 1 490 €** (jusqu'à 8 pages), **Business 3 990 €** (+ blog & admin), **Premium 7 990 €** (e-commerce). Envie d'un devis ? Cliquez sur « Discuter de votre projet ».",
  },
  {
    keywords: ["ecommerce", "e-commerce", "boutique", "vendre", "paiement", "stripe"],
    answer:
      "Pour vendre en ligne, le **Pack Premium (7 990 €)** inclut une boutique e-commerce avec paiement Stripe (~1,4 % vs 20-30 % sur les plateformes), intégrations API et support 24/7. 🛒",
  },
  {
    keywords: ["automat", "n8n", "workflow", "zapier", "make", "tâche", "tache", "répétit"],
    answer:
      "Le **Pack Automatisation** (dès 999 € + 29 €/mois) connecte vos outils et supprime les tâches répétitives (formulaire→CRM, relances, reporting) via des workflows n8n sur-mesure. ⚡",
  },
  {
    keywords: ["ia", "intelligence", "chatbot", "agent", "gpt", "llm"],
    answer:
      "Le **Pack Intégration IA** (dès 1 499 € + 39 €/mois) déploie un chatbot ou un agent IA sur-mesure : assistant conversationnel, qualification de leads, génération de contenu. 🧠",
  },
  {
    keywords: ["mobile", "application mobile", "app store", "ios", "android", "flutter"],
    answer:
      "Le **Pack Mobile** (dès 8 900 €) livre une app iOS/Android : MVP, app standard ou premium (temps réel, IA). 📱",
  },
  {
    keywords: ["seo", "référencement", "referencement", "google", "visib"],
    answer:
      "Le SEO est inclus dans tous nos packs sites (structure, performance, métadonnées, sitemap). Le Business et le Premium ajoutent blog et analytics pour progresser durablement sur Google. 📈",
  },
  {
    keywords: ["délai", "delai", "durée", "duree", "combien de temps", "quand"],
    answer:
      "Délais indicatifs : Starter 2-3 semaines, Business 4-6 semaines, Premium 6-8 semaines. Automatisation et IA de 1 à 12 semaines selon le périmètre. ⏱️",
  },
  {
    keywords: ["équipe", "equipe", "qui êtes", "qui etes", "qui est", "fondateur", "nacer", "sandra", "arthur"],
    answer:
      "NeuraWeb, c'est une équipe resserrée basée à Lille (partout en France en remote) : **Nacer** (fondateur & lead developer), **Sandra** (communication & marketing) et **Arthur** (IA & automatisation).",
  },
  {
    keywords: ["où", "ou etes", "lille", "france", "localis", "adresse", "ville"],
    answer:
      "NeuraWeb est basée à **Lille** (Hauts-de-France) et intervient partout en France en remote (Paris, Lyon, Marseille, Bordeaux, Toulouse…).",
  },
  {
    keywords: [
      "contact", "parler", "humain", "conseiller", "expert", "rendez-vous", "rendez vous",
      "rdv", "rappel", "rappeler", "téléphone", "telephone", "email", "mail", "joindre", "devis",
    ],
    answer:
      "Avec plaisir ! Cliquez sur **« Discuter de votre projet »** juste au-dessus : votre demande est transmise directement à l'équipe NeuraWeb, qui vous recontacte sous 24 h. Vous pouvez aussi écrire à contact@neuraweb.fr ou appeler le +33 7 49 77 56 54. 🚀",
  },
];

// Message de repli commun : jamais un « échec », toujours une porte de sortie utile.
const COMMON_FALLBACK =
  "Je suis l'assistant de **démonstration** : mes réponses sont pré-écrites et couvrent NeuraWeb (offres, prix, équipe) et cette maquette. Pour une question précise ou un vrai projet, cliquez sur **« Discuter de votre projet »** — un expert vous répond sous 24 h. 😊";

const GENERAL: AssistantScript = {
  greeting:
    "Bonjour 👋 Je suis l'assistant de **démonstration** de la NeuraWeb Connected Suite. Je peux vous parler de NeuraWeb (offres, prix, équipe) et vous guider dans cette démo : collectivité, restaurant ou hôtel ? Pour un vrai projet, le bouton « Discuter de votre projet » transmet votre demande à l'équipe.",
  suggestions: ["Quels sont vos tarifs ?", "Qu'est-ce que cette démo ?", "Comment ça marche ?", "Qui est NeuraWeb ?"],
  rules: [
    {
      keywords: ["démo", "demo", "quoi", "c'est quoi", "cette maquette", "à quoi"],
      answer:
        "Cette suite est une **démonstration** du savoir-faire NeuraWeb : pour 3 métiers (collectivité, restaurant, hôtel), un back-office web et une app/site client **connectés en temps réel**. Tout est simulé, les données sont fictives. Lancez le « Mode présentation » pour voir la synchro toute seule.",
    },
    {
      keywords: ["synchro", "temps réel", "temps reel", "connecté", "connect", "comment ça marche", "comment ca marche"],
      answer:
        "Web et mobile partagent le même état. Une action côté client — un signalement, une commande, une demande — apparaît **instantanément** côté back-office, et inversement. C'est le cœur de la démo : montrer la connexion en direct.",
    },
    ...NEURAWEB_RULES,
  ],
  fallback: COMMON_FALLBACK,
};

const SCRIPTS: Record<VerticalId, AssistantScript> = {
  collectivite: {
    greeting:
      "Bonjour 👋 Assistant de **démonstration** — Ville de Néauville. Cette maquette illustre une mairie connectée (signalement, démarche, réservation). Posez-moi vos questions, et pour un vrai projet utilisez « Discuter de votre projet ».",
    suggestions: ["Comment signaler un problème ?", "Réserver une salle", "Vos tarifs ?", "Qu'est-ce que cette démo ?"],
    rules: [
      { keywords: ["signal", "voirie", "problème", "probleme", "nid"], answer: "Pour signaler (démo) : onglet « Signaler » de l'app → photo + catégorie + localisation. Votre signalement arrive aussitôt dans la console de la mairie, qui suit son avancement jusqu'à résolution. 📍" },
      { keywords: ["réserv", "reserv", "salle", "gymnase", "atelier"], answer: "Dans « Réserver » : salle des fêtes, gymnase, atelier médiathèque… Choisissez un créneau ; la mairie valide et vous êtes notifié·e (démo). 🎉" },
      { keywords: ["démarche", "demarche", "dossier", "urbanisme", "état civil", "etat civil"], answer: "Vos démarches (état civil, urbanisme, inscriptions) sont suivies dans « Mes démarches » avec un statut clair : déposé, en instruction, complément demandé, validé." },
      { keywords: ["horaire", "ouvert", "mairie"], answer: "Mairie ouverte du lundi au vendredi, 8h30–12h et 13h30–17h, samedi matin sur rendez-vous (données de démonstration)." },
      { keywords: ["accessib", "rgaa", "rgpd"], answer: "Le site et l'app visent la conformité RGAA (accessibilité) et RGPD — un vrai différenciateur secteur public que NeuraWeb intègre par défaut. ♿" },
      ...NEURAWEB_RULES,
    ],
    fallback: COMMON_FALLBACK,
  },
  restaurant: {
    greeting:
      "Bonjour et bienvenue à La Table d'Henri 🍽️ Assistant de **démonstration**. Cette maquette montre un restaurant connecté (commande, réservation, fidélité). Questions bienvenues — et « Discuter de votre projet » pour un vrai devis.",
    suggestions: ["Commander à emporter", "Voir la carte", "Combien coûte un site resto ?", "Qu'est-ce que cette démo ?"],
    rules: [
      { keywords: ["command", "emporter", "collect", "retrait"], answer: "Commande en click & collect (démo) : choisissez vos plats, payez (paiement simulé) et recevez un **code à 4 chiffres**. La cuisine suit en temps réel : reçue → en préparation → prête. 🛍️" },
      { keywords: ["carte", "menu", "plat", "manger"], answer: "La carte du jour est dans l'onglet « Commander ». Pensez au plat **anti-gaspillage** à prix réduit en fin de service. 🌱" },
      { keywords: ["réserv", "reserv", "table", "couvert"], answer: "Pour réserver une table : date, heure, nombre de couverts. Le restaurant confirme depuis son back-office et vous recevez la confirmation (démo)." },
      { keywords: ["fidél", "fidel", "point", "récompense", "recompense"], answer: "Chaque commande cumule des points. Paliers et récompenses sont visibles dans l'onglet « Fidélité ». ⭐" },
      { keywords: ["commission", "uber", "deliveroo", "plateforme", "30"], answer: "En commandant en direct, le restaurant évite les ~30 % de commission des plateformes (Stripe ~1,4 %). Sur 5 000 €/mois de ventes, c'est ~1 400 €/mois récupérés. 💸" },
      ...NEURAWEB_RULES,
    ],
    fallback: COMMON_FALLBACK,
  },
  hotel: {
    greeting:
      "Bonjour, bienvenue à l'Hôtel Lumen 🏨 Assistant de **démonstration**. Cette maquette illustre un hôtel connecté (check-in, room service, réservation). Posez vos questions — et « Discuter de votre projet » pour parler à l'équipe NeuraWeb.",
    suggestions: ["Faire mon check-in", "Commander un room service", "Vos tarifs ?", "Qu'est-ce que cette démo ?"],
    rules: [
      { keywords: ["check-in", "checkin", "arriv", "clé", "cle"], answer: "Le check-in en ligne (démo) se fait dans « Mon séjour » : il prévient la réception et débloque la **clé digitale** (simulée). Plus de file à l'arrivée. 🔑" },
      { keywords: ["room service", "service", "petit-déj", "manger", "commande"], answer: "Dans « Services », envoyez une demande (room service, ménage, taxi…). Elle tombe dans la console réception qui confirme — vous suivez l'avancement en direct. 🛎️" },
      { keywords: ["late", "tardif", "départ", "depart", "check-out", "checkout"], answer: "Demande de late check-out en un tap depuis « Services ». La réception valide selon disponibilité et vous notifie (démo)." },
      { keywords: ["réserv", "reserv", "chambre", "nuit", "dispo"], answer: "Réservez dans « Réserver » : dates, type de chambre, paiement simulé, confirmation immédiate. 🛏️" },
      { keywords: ["recommand", "découvrir", "decouvrir", "restaurant", "autour", "visiter"], answer: "L'onglet « Découvrir » propose des adresses locales — dont des restaurants partenaires (clin d'œil cross-secteur de la démo). 🍷" },
      ...NEURAWEB_RULES,
    ],
    fallback: COMMON_FALLBACK,
  },
};

export function getScript(vertical: VerticalId | null): AssistantScript {
  return vertical ? SCRIPTS[vertical] : GENERAL;
}

const DIACRITICS = new RegExp("[\\u0300-\\u036f]", "g");
function normalize(str: string): string {
  return str.toLowerCase().normalize("NFD").replace(DIACRITICS, "");
}

export function answerFor(vertical: VerticalId | null, input: string): string {
  const script = getScript(vertical);
  const q = normalize(input);
  for (const rule of script.rules) {
    if (rule.keywords.some((k) => q.includes(normalize(k)))) return rule.answer;
  }
  return script.fallback;
}

/** Intention « parler à un humain / demander un devis » → le widget met en avant le contact. */
const HUMAN_INTENT = [
  "parler", "humain", "conseiller", "expert", "devis", "contact", "contacter",
  "rendez-vous", "rendez vous", "rdv", "rappel", "rappeler", "joindre", "commercial",
];
export function wantsHuman(input: string): boolean {
  const q = normalize(input);
  return HUMAN_INTENT.some((k) => q.includes(normalize(k)));
}
