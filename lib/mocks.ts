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

export interface DemoSeed {
  reports: Report[];
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
