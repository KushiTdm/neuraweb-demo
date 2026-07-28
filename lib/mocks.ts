import { isoFromNow, uid } from "./utils";
import type {
  ActivityEvent,
  AppNotification,
  HotelReservation,
  HotelRoom,
  MenuItem,
  Order,
  Procedure,
  ProcedureDocument,
  Report,
  RoomBooking,
  ServiceRequest,
  TableBooking,
  WasteKind,
  WasteReport,
} from "./types";

/* ── Démarches : modèles à télécharger & justificatifs à fournir par type ──── */
const PROCEDURE_FORM: Record<string, string> = {
  "Acte de naissance": "Formulaire de demande d'acte (Cerfa n°12543)",
  "Acte de mariage": "Formulaire de demande d'acte (Cerfa n°12543)",
  "Inscription scolaire": "Dossier d'inscription scolaire 2026-2027",
  "Déclaration de travaux": "Déclaration préalable (Cerfa n°13703)",
  "Recensement citoyen": "Formulaire de recensement citoyen",
};
const PROCEDURE_UPLOADS: Record<string, string[]> = {
  "Acte de naissance": ["Pièce d'identité", "Justificatif de domicile"],
  "Acte de mariage": ["Pièce d'identité", "Livret de famille"],
  "Inscription scolaire": ["Justificatif de domicile", "Livret de famille", "Carnet de vaccination"],
  "Déclaration de travaux": ["Plan de situation du terrain", "Plan de masse", "Photographies du terrain"],
  "Recensement citoyen": ["Pièce d'identité", "Livret de famille"],
};

/** Construit la liste de pièces d'un dossier : 1 modèle à télécharger + justificatifs à fournir. */
export function procedureDocuments(type: string, allUploaded = false): ProcedureDocument[] {
  const form = PROCEDURE_FORM[type] ?? "Formulaire de demande";
  const uploads = PROCEDURE_UPLOADS[type] ?? ["Pièce d'identité", "Justificatif de domicile"];
  return [
    { id: uid("doc"), name: form, kind: "form" },
    ...uploads.map((name) => ({ id: uid("doc"), name, kind: "upload" as const, uploaded: allUploaded })),
  ];
}

/** Référence métier selon le type de démarche. */
export function procedureRef(type: string): string {
  const prefix = /scolaire/i.test(type) ? "SCO" : /travaux|construire/i.test(type) ? "URB" : /recensement/i.test(type) ? "REC" : "EC";
  return `${prefix}-${100 + Math.floor(Math.random() * 9000)}`;
}

/* ── Propreté & déchets : matériel conseillé et points noirs (comptage) ───── */
/** Checklist matériel pré-cochée selon le type — l'agent reste libre de l'ajuster. */
export const EQUIPMENT_BY_KIND: Record<WasteKind, string[]> = {
  poubelle_pleine: ["Gants", "Sacs de collecte", "Pince de préhension"],
  depot_sauvage: ["Gants renforcés", "Pelle", "Benne mobile", "Sangles"],
  bris_verre: ["Gants anti-coupure", "Pelle & balayette", "Bac à verre", "Panneau de signalisation"],
  encombrants: ["Gants", "Diable", "Camion plateau", "Sangles"],
  autre_proprete: ["Gants", "Sacs de collecte", "Balayeuse"],
};

/** Points noirs identifiés par simple comptage (≥ 3 signalements au même endroit). */
export interface WasteBlackspot {
  place: string;
  count90d: number;
  mainKind: WasteKind;
  suggestion: string;
  context?: string;
  x: number;
  y: number;
}
export const WASTE_BLACKSPOTS: WasteBlackspot[] = [
  { place: "Square Voltaire", count90d: 14, mainKind: "bris_verre", suggestion: "Installer une benne à verre", context: "Rassemblements le week-end", x: 44, y: 72 },
  { place: "Chemin du Parc", count90d: 9, mainKind: "depot_sauvage", suggestion: "Panneau pédagogique + passage hebdomadaire", context: "Zone peu passante", x: 70, y: 62 },
  { place: "Place du Marché", count90d: 7, mainKind: "poubelle_pleine", suggestion: "Tournée supplémentaire le samedi", context: "Jour de marché", x: 58, y: 30 },
];

/** Signalements propreté par semaine (8 dernières semaines) — lecture humaine, pas de ML. */
export const WASTE_WEEKLY_TREND = [12, 9, 14, 11, 8, 10, 7, 6];

export interface DemoSeed {
  reports: Report[];
  wasteReports: WasteReport[];
  roomBookings: RoomBooking[];
  procedures: Procedure[];
  orders: Order[];
  menu: MenuItem[];
  tableBookings: TableBooking[];
  rooms: HotelRoom[];
  serviceRequests: ServiceRequest[];
  reservations: HotelReservation[];
  notifications: AppNotification[];
  activity: ActivityEvent[];
}

/** Génère un jeu de données frais (horodatages relatifs à maintenant). */
export function makeSeed(): DemoSeed {
  return {
    /* ── Collectivité ──────────────────────────────────────────────────── */
    reports: [
      { id: uid("rep"), ref: "SIG-2041", title: "Nid-de-poule rue des Lilas", category: "voirie", address: "12 rue des Lilas", status: "en_cours", priority: "haute", citizen: "Camille Renard", createdAt: isoFromNow(-95), assignedTo: "Services techniques", hasPhoto: true, x: 32, y: 44 },
      { id: uid("rep"), ref: "SIG-2042", title: "Lampadaire en panne", category: "eclairage", address: "Place du Marché", status: "recu", priority: "moyenne", citizen: "Yanis Berthier", createdAt: isoFromNow(-180), hasPhoto: true, x: 58, y: 30 },
      { id: uid("rep"), ref: "SIG-2043", title: "Dépôt sauvage de déchets", category: "proprete", address: "Chemin du Parc", status: "nouveau", priority: "haute", citizen: "Sophie Lambert", createdAt: isoFromNow(-22), hasPhoto: true, x: 70, y: 62 },
      { id: uid("rep"), ref: "SIG-2044", title: "Banc public dégradé", category: "espaces_verts", address: "Square Voltaire", status: "resolu", priority: "basse", citizen: "Marc Dubois", createdAt: isoFromNow(-1450), assignedTo: "Espaces verts", x: 44, y: 72 },
      { id: uid("rep"), ref: "SIG-2045", title: "Trottoir affaissé", category: "voirie", address: "8 avenue de la Gare", status: "recu", priority: "moyenne", citizen: "Léa Marchand", createdAt: isoFromNow(-330), x: 22, y: 24 },
      { id: uid("rep"), ref: "SIG-2046", title: "Tags sur mur municipal", category: "proprete", address: "Gymnase Jean Moulin", status: "en_cours", priority: "basse", citizen: "Hugo Faure", createdAt: isoFromNow(-540), assignedTo: "Propreté urbaine", x: 80, y: 40 },
      { id: uid("rep"), ref: "SIG-2047", title: "Arbre menaçant de tomber", category: "espaces_verts", address: "Allée des Tilleuls", status: "nouveau", priority: "haute", citizen: "Nadia Cherif", createdAt: isoFromNow(-8), hasPhoto: true, x: 50, y: 52 },
    ],
    wasteReports: [
      // À qualifier par un agent (l'œil humain fixe la priorité — pas d'IA)
      { id: uid("was"), ref: "PRO-1204", kind: "bris_verre", title: "Verre brisé sur la piste cyclable", address: "Avenue de la Gare", status: "nouveau", anonymous: false, citizen: "Léa Marchand", confirmations: 2, equipment: [], hasPhoto: true, moderation: "validee", distanceM: 210, x: 24, y: 26, createdAt: isoFromNow(-25) },
      { id: uid("was"), ref: "PRO-1203", kind: "poubelle_pleine", title: "Poubelle qui déborde côté jeux", address: "Square Voltaire", status: "nouveau", anonymous: true, confirmations: 3, equipment: [], hasPhoto: true, moderation: "validee", distanceM: 450, x: 45, y: 70, createdAt: isoFromNow(-70) },
      // Qualifiés / planifiés / en cours
      { id: uid("was"), ref: "PRO-1201", kind: "depot_sauvage", title: "Matelas et gravats abandonnés", address: "Chemin du Parc", status: "qualifie", priority: "moyenne", anonymous: true, confirmations: 4, equipment: EQUIPMENT_BY_KIND.depot_sauvage, hasPhoto: true, moderation: "validee", distanceM: 800, x: 70, y: 60, createdAt: isoFromNow(-200) },
      { id: uid("was"), ref: "PRO-1199", kind: "encombrants", title: "Canapé laissé sur le trottoir", address: "12 rue des Lilas", status: "qualifie", priority: "faible", anonymous: false, citizen: "Marc Dubois", confirmations: 0, equipment: EQUIPMENT_BY_KIND.encombrants, filiere: "ressourcerie", hasPhoto: true, moderation: "validee", distanceM: 350, x: 33, y: 45, createdAt: isoFromNow(-460) },
      { id: uid("was"), ref: "PRO-1198", kind: "depot_sauvage", title: "Sacs éventrés près des conteneurs", address: "Gymnase Jean Moulin", status: "en_cours", priority: "moyenne", anonymous: false, citizen: "Hugo Faure", confirmations: 1, assignedTo: "Tournée propreté A", tourOrder: 1, equipment: EQUIPMENT_BY_KIND.depot_sauvage, hasPhoto: true, moderation: "validee", distanceM: 1200, x: 79, y: 42, createdAt: isoFromNow(-540) },
      { id: uid("was"), ref: "PRO-1197", kind: "poubelle_pleine", title: "Corbeille pleine arrêt Mairie", address: "Place du Beffroi", status: "planifie", priority: "faible", anonymous: true, confirmations: 1, assignedTo: "Tournée propreté A", tourOrder: 2, equipment: EQUIPMENT_BY_KIND.poubelle_pleine, hasPhoto: true, moderation: "validee", distanceM: 600, x: 52, y: 38, createdAt: isoFromNow(-720) },
      // Résolu avec photo « après » (preuve du lieu propre)
      { id: uid("was"), ref: "PRO-1190", kind: "bris_verre", title: "Bouteilles cassées à l'arrêt de bus", address: "Place du Marché", status: "resolu", priority: "urgente", anonymous: false, citizen: "Sophie Lambert", confirmations: 2, assignedTo: "Régie propreté", equipment: EQUIPMENT_BY_KIND.bris_verre, hasPhoto: true, photoAfter: true, moderation: "validee", distanceM: 500, x: 58, y: 31, createdAt: isoFromNow(-2800), resolvedAt: isoFromNow(-2650) },
      // File de modération humaine (photos à vérifier avant publication)
      { id: uid("was"), ref: "PRO-1205", kind: "autre_proprete", title: "Déjections canines allée centrale", address: "Allée des Tilleuls", status: "nouveau", anonymous: true, confirmations: 0, equipment: [], hasPhoto: true, moderation: "en_attente", distanceM: 300, x: 49, y: 54, createdAt: isoFromNow(-15) },
      { id: uid("was"), ref: "PRO-1206", kind: "depot_sauvage", title: "Photo floue — contenu à vérifier", address: "Rue de la Filature", status: "nouveau", anonymous: true, confirmations: 0, equipment: [], hasPhoto: true, moderation: "en_attente", distanceM: 900, x: 18, y: 60, createdAt: isoFromNow(-8) },
      // Exemples rejetés (pédagogie RGPD) : hors-sujet et anti-délation
      { id: uid("was"), ref: "PRO-1192", kind: "autre_proprete", title: "Photo d'un chat sur un muret", address: "Rue des Lilas", status: "nouveau", anonymous: true, confirmations: 0, equipment: [], hasPhoto: true, moderation: "rejetee_hors_sujet", x: 30, y: 50, createdAt: isoFromNow(-1300) },
      { id: uid("was"), ref: "PRO-1191", kind: "depot_sauvage", title: "« Mon voisin sort ses sacs le mardi »", address: "7 impasse des Rosiers", status: "nouveau", anonymous: false, citizen: "Anonyme refusé", confirmations: 0, equipment: [], hasPhoto: true, moderation: "rejetee_delation", x: 62, y: 48, createdAt: isoFromNow(-1500) },
    ],
    roomBookings: [
      // Réservations de l'usager démo (gérables depuis l'app : modifier / annuler)
      { id: uid("res"), ref: "SAL-322", resource: "Salle des fêtes", date: isoFromNow(7200), slot: "18:00 – 23:00", applicant: "Vous (citoyen démo)", people: 40, status: "validee" },
      { id: uid("res"), ref: "SAL-323", resource: "Salle de réunion B", date: isoFromNow(2160), slot: "18:00 – 20:00", applicant: "Vous (citoyen démo)", people: 15, status: "demande" },
      { id: uid("res"), ref: "SAL-318", resource: "Salle des fêtes", date: isoFromNow(2880), slot: "18:00 – 23:00", applicant: "Association Les Cigales", people: 80, status: "demande" },
      { id: uid("res"), ref: "SAL-319", resource: "Gymnase municipal", date: isoFromNow(1440), slot: "10:00 – 12:00", applicant: "Club de basket", people: 24, status: "validee" },
      { id: uid("res"), ref: "SAL-320", resource: "Atelier théâtre — médiathèque", date: isoFromNow(4320), slot: "14:00 – 16:00", applicant: "Compagnie Éclats", people: 15, status: "demande" },
      { id: uid("res"), ref: "SAL-321", resource: "Salle de réunion B", date: isoFromNow(720), slot: "09:00 – 11:00", applicant: "Conseil de quartier", people: 12, status: "validee" },
    ],
    procedures: [
      // Démarches de l'usager démo (visibles dans l'app citoyenne — confidentialité)
      {
        id: uid("dem"), ref: "EC-0451", type: "Acte de naissance", citizen: "Vous (citoyen démo)",
        status: "instruction", createdAt: isoFromNow(-2880), updatedAt: isoFromNow(-140),
        documents: procedureDocuments("Acte de naissance", true),
        messages: [
          { id: uid("msg"), from: "administration", body: "Dossier reçu et complet. Demande transmise au service de l'état civil pour instruction.", ts: isoFromNow(-2870) },
        ],
      },
      {
        id: uid("dem"), ref: "SCO-0945", type: "Inscription scolaire", citizen: "Vous (citoyen démo)",
        status: "complement", createdAt: isoFromNow(-1440), updatedAt: isoFromNow(-60),
        documents: procedureDocuments("Inscription scolaire").map((d) =>
          d.kind === "upload" && d.name !== "Carnet de vaccination" ? { ...d, uploaded: true } : d,
        ),
        messages: [
          { id: uid("msg"), from: "administration", body: "Dossier déposé, en cours d'instruction par le service des affaires scolaires.", ts: isoFromNow(-1430) },
          { id: uid("msg"), from: "administration", body: "Complément requis : merci de téléverser le carnet de vaccination à jour de votre enfant pour finaliser l'inscription.", ts: isoFromNow(-60) },
        ],
      },
      // Démarches d'autres citoyens (visibles uniquement côté back-office mairie)
      {
        id: uid("dem"), ref: "URB-1187", type: "Déclaration de travaux", citizen: "Camille Renard",
        status: "instruction", createdAt: isoFromNow(-3000), updatedAt: isoFromNow(-220),
        documents: procedureDocuments("Déclaration de travaux", true), messages: [],
      },
      {
        id: uid("dem"), ref: "EC-0442", type: "Acte de naissance", citizen: "Yanis Berthier",
        status: "valide", createdAt: isoFromNow(-4320), updatedAt: isoFromNow(-720),
        documents: procedureDocuments("Acte de naissance", true), messages: [],
      },
      {
        id: uid("dem"), ref: "SCO-0931", type: "Inscription scolaire", citizen: "Sophie Lambert",
        status: "complement", createdAt: isoFromNow(-2000), updatedAt: isoFromNow(-95),
        documents: procedureDocuments("Inscription scolaire"), messages: [
          { id: uid("msg"), from: "administration", body: "Complément requis : justificatif de domicile de moins de 3 mois.", ts: isoFromNow(-95) },
        ],
      },
      {
        id: uid("dem"), ref: "URB-1188", type: "Déclaration de travaux", citizen: "Marc Dubois",
        status: "depose", createdAt: isoFromNow(-30), updatedAt: isoFromNow(-30),
        documents: procedureDocuments("Déclaration de travaux", true), messages: [],
      },
    ],

    /* ── Restaurant ────────────────────────────────────────────────────── */
    menu: [
      { id: uid("menu"), name: "Velouté de potimarron", description: "Crème, graines torréfiées", price: 7, category: "entrees", emoji: "🥣", image: "plat-veloute" },
      { id: uid("menu"), name: "Burrata & tomates anciennes", description: "Huile de basilic", price: 11, category: "entrees", emoji: "🧀", image: "plat-burrata" },
      { id: uid("menu"), name: "Burger maison & frites", description: "Bœuf charolais, cheddar affiné", price: 16, category: "plats", emoji: "🍔", image: "plat-burger" },
      { id: uid("menu"), name: "Risotto aux cèpes", description: "Parmesan 24 mois", price: 18, category: "plats", emoji: "🍚", image: "plat-risotto" },
      { id: uid("menu"), name: "Filet de bar, beurre blanc", description: "Légumes de saison", price: 22, category: "plats", emoji: "🐟", image: "plat-bar" },
      { id: uid("menu"), name: "Tarte du jour anti-gaspi", description: "Selon arrivage — fin de service", price: 5, category: "desserts", antiGaspi: true, emoji: "🥧", image: "plat-tarte" },
      { id: uid("menu"), name: "Fondant au chocolat", description: "Cœur coulant, glace vanille", price: 8, category: "desserts", emoji: "🍫", image: "plat-fondant" },
      { id: uid("menu"), name: "Limonade artisanale", description: "Citron de Menton", price: 4, category: "boissons", emoji: "🥤", image: "plat-limonade" },
    ],
    orders: [
      { id: uid("ord"), code: "4821", items: [{ name: "Burger maison & frites", qty: 2, price: 16 }, { name: "Limonade artisanale", qty: 2, price: 4 }], total: 40, customer: "Julie P.", status: "en_preparation", createdAt: isoFromNow(-9), pickupAt: isoFromNow(11) },
      { id: uid("ord"), code: "4822", items: [{ name: "Risotto aux cèpes", qty: 1, price: 18 }, { name: "Fondant au chocolat", qty: 1, price: 8 }], total: 26, customer: "Karim B.", status: "en_attente", createdAt: isoFromNow(-3), pickupAt: isoFromNow(22) },
      { id: uid("ord"), code: "4820", items: [{ name: "Filet de bar, beurre blanc", qty: 1, price: 22 }], total: 22, customer: "Élodie M.", status: "prete", createdAt: isoFromNow(-18), pickupAt: isoFromNow(2) },
      { id: uid("ord"), code: "4819", items: [{ name: "Burrata & tomates anciennes", qty: 1, price: 11 }, { name: "Velouté de potimarron", qty: 1, price: 7 }], total: 18, customer: "Thomas R.", status: "recuperee", createdAt: isoFromNow(-46), pickupAt: isoFromNow(-20) },
    ],
    tableBookings: [
      { id: uid("tab"), ref: "TBL-77", name: "Famille Morel", date: isoFromNow(300), slot: "20:00", covers: 4, status: "validee" },
      { id: uid("tab"), ref: "TBL-78", name: "A. Petit", date: isoFromNow(360), slot: "21:00", covers: 2, status: "demande" },
      { id: uid("tab"), ref: "TBL-79", name: "Dîner entreprise Volta", date: isoFromNow(1500), slot: "19:30", covers: 8, status: "demande" },
    ],

    /* ── Hôtel ─────────────────────────────────────────────────────────── */
    rooms: [
      { id: uid("room"), number: "101", type: "Classique", status: "occupee", guest: "M. & Mme Lefèvre" },
      { id: uid("room"), number: "102", type: "Classique", status: "menage" },
      { id: uid("room"), number: "103", type: "Supérieure", status: "libre" },
      { id: uid("room"), number: "201", type: "Supérieure", status: "occupee", guest: "Mr. Johnson" },
      { id: uid("room"), number: "202", type: "Suite Lumen", status: "libre" },
      { id: uid("room"), number: "203", type: "Suite Lumen", status: "occupee", guest: "Mme Da Silva" },
      { id: uid("room"), number: "301", type: "Suite Panorama", status: "menage" },
      { id: uid("room"), number: "302", type: "Suite Panorama", status: "libre" },
    ],
    serviceRequests: [
      { id: uid("svc"), ref: "SVC-512", room: "201", kind: "room_service", note: "Plateau petit-déjeuner pour 2 — 8h00", guest: "Mr. Johnson", status: "en_cours", createdAt: isoFromNow(-14) },
      { id: uid("svc"), ref: "SVC-513", room: "103", kind: "late_checkout", note: "Départ souhaité à 14h", guest: "Mme Aubert", status: "nouvelle", createdAt: isoFromNow(-5) },
      { id: uid("svc"), ref: "SVC-511", room: "203", kind: "taxi", note: "Navette aéroport — 17h30", guest: "Mme Da Silva", status: "traitee", createdAt: isoFromNow(-120) },
    ],
    reservations: [
      // Réservation de l'usager démo (pilote « Mon séjour » côté site web)
      { id: uid("rsv"), ref: "BKG-9050", guest: "Vous (voyageur démo)", room: "202", checkIn: isoFromNow(120), checkOut: isoFromNow(2880), status: "confirmee" },
      { id: uid("rsv"), ref: "BKG-9043", guest: "Claire Fontaine", room: "203", checkIn: isoFromNow(180), checkOut: isoFromNow(2880), status: "confirmee", checkedInOnline: true },
      { id: uid("rsv"), ref: "BKG-9044", guest: "Mr. Johnson", room: "201", checkIn: isoFromNow(-1440), checkOut: isoFromNow(1440), status: "arrivee" },
      { id: uid("rsv"), ref: "BKG-9045", guest: "Famille Nguyen", room: "302", checkIn: isoFromNow(360), checkOut: isoFromNow(4320), status: "demande" },
      { id: uid("rsv"), ref: "BKG-9042", guest: "Mme Da Silva", room: "203", checkIn: isoFromNow(-2880), checkOut: isoFromNow(120), status: "arrivee", checkedInOnline: true },
    ],

    /* ── Cross-cutting ─────────────────────────────────────────────────── */
    notifications: [
      { id: uid("not"), vertical: "collectivite", audience: "admin", title: "Pic de signalements", body: "3 signalements voirie reçus en 1 h dans le secteur Centre.", ts: isoFromNow(-12), read: false, tone: "warn" },
    ],
    activity: [
      { id: uid("act"), vertical: "collectivite", ts: isoFromNow(-8), label: "Nouveau signalement « Arbre menaçant »", side: "app" },
      { id: uid("act"), vertical: "restaurant", ts: isoFromNow(-3), label: "Commande #4822 reçue (click & collect)", side: "app" },
      { id: uid("act"), vertical: "hotel", ts: isoFromNow(-5), label: "Demande late check-out — chambre 103", side: "app" },
    ],
  };
}
