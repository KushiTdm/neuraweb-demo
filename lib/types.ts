/* ──────────────────────────────────────────────────────────────────────────
   Modèle de données mocké — NeuraWeb Connected Suite
   Aucune donnée réelle. Tout est factice et local.
   ────────────────────────────────────────────────────────────────────────── */

export type VerticalId = "collectivite" | "restaurant" | "hotel";
export type Audience = "admin" | "app";

/* ── Cross-cutting ───────────────────────────────────────────────────────── */
export interface AppNotification {
  id: string;
  vertical: VerticalId;
  audience: Audience; // destinataire : back-office ou app mobile
  title: string;
  body: string;
  ts: string; // ISO
  read: boolean;
  tone?: "info" | "success" | "warn";
}

export interface ActivityEvent {
  id: string;
  vertical: VerticalId;
  ts: string;
  label: string;
  side: Audience; // origine de l'événement
}

/* ── Collectivité ────────────────────────────────────────────────────────── */
export type ReportCategory = "voirie" | "eclairage" | "proprete" | "espaces_verts";
export type ReportStatus = "nouveau" | "recu" | "en_cours" | "resolu";

export interface Report {
  id: string;
  ref: string;
  title: string;
  category: ReportCategory;
  address: string;
  status: ReportStatus;
  priority: "basse" | "moyenne" | "haute";
  citizen: string;
  createdAt: string;
  assignedTo?: string;
  hasPhoto?: boolean;
  /** position relative sur la mini-carte (0–100 %) */
  x: number;
  y: number;
}

export type ReservationStatus = "demande" | "validee" | "refusee" | "annulee";
export interface RoomBooking {
  id: string;
  ref: string;
  resource: string;
  date: string; // ISO (jour)
  slot: string; // "18:00 – 20:00"
  applicant: string;
  people: number;
  status: ReservationStatus;
}

export type ProcedureStatus = "depose" | "instruction" | "complement" | "valide";

/** Pièce d'un dossier de démarche.
 *  - `form`   : modèle / Cerfa que l'usager télécharge
 *  - `upload` : justificatif que l'usager doit fournir (téléverser) */
export interface ProcedureDocument {
  id: string;
  name: string;
  kind: "form" | "upload";
  uploaded?: boolean; // pour kind "upload"
}

export interface ProcedureMessage {
  id: string;
  from: "administration" | "citizen";
  body: string;
  ts: string;
}

export interface Procedure {
  id: string;
  ref: string;
  type: string;
  citizen: string;
  status: ProcedureStatus;
  /** date de dépôt du dossier (ISO) */
  createdAt: string;
  /** dernière mise à jour (ISO) */
  updatedAt: string;
  documents: ProcedureDocument[];
  messages: ProcedureMessage[];
}

/* ── Restaurant ──────────────────────────────────────────────────────────── */
// en_attente : reçue, en attente de validation par le restaurant
export type OrderStatus = "en_attente" | "en_preparation" | "prete" | "recuperee" | "refusee";
export interface OrderItem {
  name: string;
  qty: number;
  price: number;
}
export interface Order {
  id: string;
  code: string; // code de retrait à 4 chiffres
  items: OrderItem[];
  total: number;
  customer: string;
  status: OrderStatus;
  createdAt: string;
  pickupAt: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "entrees" | "plats" | "desserts" | "boissons";
  antiGaspi?: boolean;
  emoji: string;
  /** nom de fichier WebP dans /public/assets (sans extension) */
  image?: string;
}

export interface TableBooking {
  id: string;
  ref: string;
  name: string;
  date: string;
  slot: string;
  covers: number;
  status: ReservationStatus;
}

/* ── Hôtel ───────────────────────────────────────────────────────────────── */
export type RoomStatus = "libre" | "occupee" | "menage";
export interface HotelRoom {
  id: string;
  number: string;
  type: string;
  status: RoomStatus;
  guest?: string;
}

export type ServiceStatus = "nouvelle" | "en_cours" | "traitee";
export type ServiceKind = "room_service" | "late_checkout" | "taxi" | "menage" | "spa";
export interface ServiceRequest {
  id: string;
  ref: string;
  room: string;
  kind: ServiceKind;
  note: string;
  guest: string;
  status: ServiceStatus;
  createdAt: string;
}

// demande : réservation reçue, en attente de validation par la réception
export type HotelReservationStatus = "demande" | "confirmee" | "refusee" | "arrivee" | "partie";
export interface HotelReservation {
  id: string;
  ref: string;
  guest: string;
  room: string;
  checkIn: string;
  checkOut: string;
  status: HotelReservationStatus;
  checkedInOnline?: boolean;
}
