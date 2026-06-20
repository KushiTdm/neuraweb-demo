"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { isoFromNow, uid } from "./utils";
import { makeSeed, procedureDocuments, procedureRef, type DemoSeed } from "./mocks";
import { SERVICE_KIND_LABEL } from "./verticals";
import type {
  Audience,
  AppNotification,
  OrderItem,
  OrderStatus,
  ProcedureStatus,
  ReportCategory,
  ReportStatus,
  ReservationStatus,
  RoomStatus,
  ServiceKind,
  ServiceStatus,
  VerticalId,
} from "./types";
import { ORDER_STATUS_LABEL } from "./verticals";

interface PresentationState {
  running: boolean;
  vertical: VerticalId | null;
  step: number;
  total: number;
  caption: string;
}

interface DemoState extends DemoSeed {
  _hydrated: boolean;
  presentation: PresentationState;

  /* internes */
  _emit: (n: Omit<AppNotification, "id" | "ts" | "read">) => void;
  _log: (vertical: VerticalId, side: Audience, label: string) => void;

  /* Collectivité */
  createReport: (input: { title: string; category: ReportCategory; address: string; citizen?: string }) => string;
  setReportStatus: (id: string, status: ReportStatus) => void;
  assignReport: (id: string, team: string) => void;
  setRoomBookingStatus: (id: string, status: ReservationStatus) => void;
  createRoomBooking: (input: { resource: string; date: string; slot: string; applicant: string; people: number }) => void;
  updateRoomBooking: (id: string, patch: Partial<{ resource: string; date: string; slot: string; people: number }>) => void;
  cancelRoomBooking: (id: string) => void;
  createProcedure: (input: { type: string; citizen?: string }) => string;
  setProcedureStatus: (id: string, status: ProcedureStatus) => void;
  requestProcedureComplement: (id: string, message: string, missingDoc?: string) => void;
  uploadProcedureDocument: (id: string, docId: string) => void;
  submitProcedureComplement: (id: string) => void;

  /* Restaurant */
  createOrder: (input: { items: OrderItem[]; customer?: string }) => { id: string; code: string };
  setOrderStatus: (id: string, status: OrderStatus) => void;
  toggleAntiGaspi: (menuId: string) => void;
  setMenuPrice: (menuId: string, price: number) => void;
  createTableBooking: (input: { name: string; date: string; slot: string; covers: number }) => void;
  setTableBookingStatus: (id: string, status: ReservationStatus) => void;

  /* Hôtel */
  createServiceRequest: (input: { room: string; kind: ServiceKind; note: string; guest?: string }) => string;
  setServiceStatus: (id: string, status: ServiceStatus) => void;
  setRoomStatus: (id: string, status: RoomStatus) => void;
  checkInOnline: (reservationId: string) => void;
  checkOut: (reservationId: string) => void;
  createReservation: (input: { guest: string; room: string; checkIn: string; checkOut: string }) => string;
  setReservationStatus: (id: string, status: "confirmee" | "refusee") => void;

  /* Cross */
  markAllRead: (vertical: VerticalId, audience: Audience) => void;
  resetDemo: () => void;

  /* Présentation */
  startPresentation: (vertical: VerticalId) => void;
  stopPresentation: () => void;
}

let presentationTimers: ReturnType<typeof setTimeout>[] = [];
function clearPresentationTimers() {
  presentationTimers.forEach(clearTimeout);
  presentationTimers = [];
}

export const useDemoStore = create<DemoState>()(
  persist(
    (set, get) => ({
      ...makeSeed(),
      _hydrated: false,
      presentation: { running: false, vertical: null, step: 0, total: 0, caption: "" },

      _emit: (n) =>
        set((s) => ({
          notifications: [
            { ...n, id: uid("not"), ts: new Date().toISOString(), read: false },
            ...s.notifications,
          ].slice(0, 40),
        })),

      _log: (vertical, side, label) =>
        set((s) => ({
          activity: [
            { id: uid("act"), vertical, side, label, ts: new Date().toISOString() },
            ...s.activity,
          ].slice(0, 60),
        })),

      /* ── Collectivité ────────────────────────────────────────────────── */
      createReport: (input) => {
        const id = uid("rep");
        const ref = `SIG-${2048 + Math.floor(Math.random() * 900)}`;
        set((s) => ({
          reports: [
            {
              id,
              ref,
              title: input.title,
              category: input.category,
              address: input.address,
              status: "nouveau",
              priority: "moyenne",
              citizen: input.citizen ?? "Citoyen·ne",
              createdAt: new Date().toISOString(),
              hasPhoto: true,
              x: 20 + Math.random() * 60,
              y: 20 + Math.random() * 55,
            },
            ...s.reports,
          ],
        }));
        get()._emit({ vertical: "collectivite", audience: "admin", title: "Nouveau signalement", body: `${input.title} — ${input.address}`, tone: "warn" });
        get()._log("collectivite", "app", `Signalement « ${input.title} » créé`);
        return id;
      },
      setReportStatus: (id, status) => {
        set((s) => ({ reports: s.reports.map((r) => (r.id === id ? { ...r, status } : r)) }));
        const r = get().reports.find((x) => x.id === id);
        if (!r) return;
        const labels: Record<ReportStatus, string> = { nouveau: "Nouveau", recu: "Reçu", en_cours: "En cours", resolu: "Résolu" };
        get()._log("collectivite", "admin", `${r.ref} → ${labels[status]}`);
        if (status === "en_cours" || status === "resolu") {
          get()._emit({
            vertical: "collectivite",
            audience: "app",
            title: status === "resolu" ? "Signalement résolu ✅" : "Signalement pris en charge",
            body: `${r.ref} — ${r.title} : ${labels[status]}.`,
            tone: status === "resolu" ? "success" : "info",
          });
        }
      },
      assignReport: (id, team) => {
        set((s) => ({ reports: s.reports.map((r) => (r.id === id ? { ...r, assignedTo: team, status: r.status === "nouveau" ? "recu" : r.status } : r)) }));
        get()._log("collectivite", "admin", `Signalement assigné à ${team}`);
      },
      setRoomBookingStatus: (id, status) => {
        set((s) => ({ roomBookings: s.roomBookings.map((b) => (b.id === id ? { ...b, status } : b)) }));
        const b = get().roomBookings.find((x) => x.id === id);
        if (!b) return;
        get()._log("collectivite", "admin", `Réservation ${b.ref} ${status === "validee" ? "validée" : "refusée"}`);
        get()._emit({
          vertical: "collectivite",
          audience: "app",
          title: status === "validee" ? "Réservation confirmée 🎉" : "Réservation refusée",
          body: `${b.resource} — ${b.slot}`,
          tone: status === "validee" ? "success" : "warn",
        });
      },
      createRoomBooking: (input) => {
        set((s) => ({
          roomBookings: [
            { id: uid("res"), ref: `SAL-${320 + Math.floor(Math.random() * 80)}`, status: "demande", ...input },
            ...s.roomBookings,
          ],
        }));
        get()._emit({ vertical: "collectivite", audience: "admin", title: "Nouvelle demande de réservation", body: `${input.resource} — ${input.slot}`, tone: "info" });
        get()._log("collectivite", "app", `Demande de réservation : ${input.resource}`);
      },
      updateRoomBooking: (id, patch) => {
        set((s) => ({
          // Une réservation déjà validée repasse en « demande » : elle doit être revalidée par la mairie.
          roomBookings: s.roomBookings.map((b) =>
            b.id === id ? { ...b, ...patch, status: b.status === "validee" ? "demande" : b.status } : b,
          ),
        }));
        const b = get().roomBookings.find((x) => x.id === id);
        if (!b) return;
        get()._emit({ vertical: "collectivite", audience: "admin", title: "Réservation modifiée", body: `${b.ref} — ${b.resource} · ${b.slot} (à revalider)`, tone: "info" });
        get()._log("collectivite", "app", `Réservation ${b.ref} modifiée`);
      },
      cancelRoomBooking: (id) => {
        const b = get().roomBookings.find((x) => x.id === id);
        set((s) => ({ roomBookings: s.roomBookings.map((x) => (x.id === id ? { ...x, status: "annulee" } : x)) }));
        if (!b) return;
        get()._emit({ vertical: "collectivite", audience: "admin", title: "Réservation annulée", body: `${b.ref} — ${b.resource} · ${b.slot}`, tone: "warn" });
        get()._log("collectivite", "app", `Réservation ${b.ref} annulée par l'usager`);
      },
      createProcedure: (input) => {
        const id = uid("dem");
        const ref = procedureRef(input.type);
        const now = new Date().toISOString();
        set((s) => ({
          procedures: [
            {
              id, ref, type: input.type, citizen: input.citizen ?? "Vous (citoyen démo)",
              status: "depose", createdAt: now, updatedAt: now,
              documents: procedureDocuments(input.type, true),
              messages: [{ id: uid("msg"), from: "administration", body: "Dossier déposé. Vous recevrez une notification à chaque étape de l'instruction.", ts: now }],
            },
            ...s.procedures,
          ],
        }));
        get()._emit({ vertical: "collectivite", audience: "admin", title: "Nouvelle démarche déposée", body: `${input.type} — ${ref}`, tone: "info" });
        get()._log("collectivite", "app", `Démarche initiée : ${input.type}`);
        return id;
      },
      setProcedureStatus: (id, status) => {
        const labels: Record<ProcedureStatus, string> = { depose: "Déposé", instruction: "En instruction", complement: "Complément demandé", valide: "Validé" };
        set((s) => ({ procedures: s.procedures.map((p) => (p.id === id ? { ...p, status, updatedAt: new Date().toISOString() } : p)) }));
        const p = get().procedures.find((x) => x.id === id);
        if (!p) return;
        get()._log("collectivite", "admin", `Démarche ${p.ref} → ${labels[status]}`);
        if (status === "instruction" || status === "valide") {
          get()._emit({
            vertical: "collectivite", audience: "app",
            title: status === "valide" ? "Démarche validée ✅" : "Démarche en instruction",
            body: `${p.type} — ${p.ref} : ${labels[status]}.`,
            tone: status === "valide" ? "success" : "info",
          });
        }
      },
      requestProcedureComplement: (id, message, missingDoc) => {
        const ts = new Date().toISOString();
        set((s) => ({
          procedures: s.procedures.map((p) => {
            if (p.id !== id) return p;
            const documents = missingDoc
              ? [...p.documents, { id: uid("doc"), name: missingDoc, kind: "upload" as const, uploaded: false }]
              : p.documents.map((d) => (d.kind === "upload" ? { ...d, uploaded: false } : d));
            return { ...p, status: "complement", updatedAt: ts, documents, messages: [...p.messages, { id: uid("msg"), from: "administration", body: message, ts }] };
          }),
        }));
        const p = get().procedures.find((x) => x.id === id);
        if (!p) return;
        get()._log("collectivite", "admin", `Complément demandé — ${p.ref}`);
        get()._emit({ vertical: "collectivite", audience: "app", title: "Complément demandé 📎", body: `${p.type} — ${p.ref} : l'administration attend une pièce.`, tone: "warn" });
      },
      uploadProcedureDocument: (id, docId) => {
        set((s) => ({
          procedures: s.procedures.map((p) =>
            p.id === id
              ? { ...p, updatedAt: new Date().toISOString(), documents: p.documents.map((d) => (d.id === docId ? { ...d, uploaded: true } : d)) }
              : p,
          ),
        }));
        const p = get().procedures.find((x) => x.id === id);
        if (p) get()._log("collectivite", "app", `Pièce téléversée — ${p.ref}`);
      },
      submitProcedureComplement: (id) => {
        const ts = new Date().toISOString();
        set((s) => ({
          procedures: s.procedures.map((p) =>
            p.id === id ? { ...p, status: "instruction", updatedAt: ts, messages: [...p.messages, { id: uid("msg"), from: "citizen", body: "Pièces complémentaires transmises.", ts }] } : p,
          ),
        }));
        const p = get().procedures.find((x) => x.id === id);
        if (!p) return;
        get()._emit({ vertical: "collectivite", audience: "admin", title: "Compléments reçus", body: `${p.type} — ${p.ref}`, tone: "info" });
        get()._log("collectivite", "app", `Compléments transmis — ${p.ref}`);
      },

      /* ── Restaurant ──────────────────────────────────────────────────── */
      createOrder: (input) => {
        const id = uid("ord");
        const code = String(4000 + Math.floor(Math.random() * 5999));
        const total = input.items.reduce((sum, i) => sum + i.price * i.qty, 0);
        set((s) => ({
          orders: [
            { id, code, items: input.items, total, customer: input.customer ?? "Client web", status: "en_attente", createdAt: new Date().toISOString(), pickupAt: isoFromNow(20) },
            ...s.orders,
          ],
        }));
        get()._emit({ vertical: "restaurant", audience: "admin", title: "Nouvelle commande à confirmer", body: `#${code} — ${input.items.reduce((n, i) => n + i.qty, 0)} article(s)`, tone: "warn" });
        get()._log("restaurant", "app", `Commande #${code} passée (click & collect)`);
        return { id, code };
      },
      setOrderStatus: (id, status) => {
        set((s) => ({ orders: s.orders.map((o) => (o.id === id ? { ...o, status } : o)) }));
        const o = get().orders.find((x) => x.id === id);
        if (!o) return;
        get()._log("restaurant", "admin", `Commande #${o.code} → ${ORDER_STATUS_LABEL[status]}`);
        const notif: Partial<Record<OrderStatus, Omit<AppNotification, "id" | "ts" | "read" | "vertical" | "audience">>> = {
          en_preparation: { title: "Commande confirmée 👨‍🍳", body: `#${o.code} acceptée — en préparation.`, tone: "success" },
          prete: { title: `Commande prête 🛍️ Code ${o.code}`, body: `Présentez le code ${o.code} au comptoir.`, tone: "success" },
          refusee: { title: "Commande refusée", body: `Désolé, #${o.code} n'a pas pu être acceptée. Vous n'avez pas été débité (démo).`, tone: "warn" },
        };
        if (notif[status]) get()._emit({ vertical: "restaurant", audience: "app", ...notif[status]! });
      },
      toggleAntiGaspi: (menuId) =>
        set((s) => ({ menu: s.menu.map((m) => (m.id === menuId ? { ...m, antiGaspi: !m.antiGaspi } : m)) })),
      setMenuPrice: (menuId, price) =>
        set((s) => ({ menu: s.menu.map((m) => (m.id === menuId ? { ...m, price: Math.max(0, Math.round(price * 100) / 100) } : m)) })),
      createTableBooking: (input) => {
        set((s) => ({
          tableBookings: [{ id: uid("tab"), ref: `TBL-${80 + Math.floor(Math.random() * 90)}`, status: "demande", ...input }, ...s.tableBookings],
        }));
        get()._emit({ vertical: "restaurant", audience: "admin", title: "Réservation de table à valider", body: `${input.name} — ${input.covers} couverts · ${input.slot}`, tone: "warn" });
        get()._log("restaurant", "app", `Réservation de table : ${input.name} (${input.covers} couv.)`);
      },
      setTableBookingStatus: (id, status) => {
        set((s) => ({ tableBookings: s.tableBookings.map((b) => (b.id === id ? { ...b, status } : b)) }));
        const b = get().tableBookings.find((x) => x.id === id);
        if (!b) return;
        get()._log("restaurant", "admin", `Table ${b.ref} ${status === "validee" ? "validée" : "refusée"}`);
        get()._emit({
          vertical: "restaurant",
          audience: "app",
          title: status === "validee" ? "Table confirmée 🎉" : "Réservation refusée",
          body: `${b.name} — ${b.covers} couverts · ${b.slot}`,
          tone: status === "validee" ? "success" : "warn",
        });
      },

      /* ── Hôtel ───────────────────────────────────────────────────────── */
      createServiceRequest: (input) => {
        const id = uid("svc");
        set((s) => ({
          serviceRequests: [
            { id, ref: `SVC-${514 + Math.floor(Math.random() * 400)}`, room: input.room, kind: input.kind, note: input.note, guest: input.guest ?? "Voyageur", status: "nouvelle", createdAt: new Date().toISOString() },
            ...s.serviceRequests,
          ],
        }));
        get()._emit({ vertical: "hotel", audience: "admin", title: "Demande voyageur", body: `Ch. ${input.room} — ${SERVICE_KIND_LABEL[input.kind]}`, tone: "info" });
        get()._log("hotel", "app", `Demande ${SERVICE_KIND_LABEL[input.kind]} — chambre ${input.room}`);
        return id;
      },
      setServiceStatus: (id, status) => {
        set((s) => ({ serviceRequests: s.serviceRequests.map((r) => (r.id === id ? { ...r, status } : r)) }));
        const r = get().serviceRequests.find((x) => x.id === id);
        if (!r) return;
        const labels: Record<ServiceStatus, string> = { nouvelle: "Nouvelle", en_cours: "En cours", traitee: "Traitée" };
        get()._log("hotel", "admin", `${r.ref} → ${labels[status]}`);
        if (status === "en_cours" || status === "traitee") {
          get()._emit({
            vertical: "hotel",
            audience: "app",
            title: status === "traitee" ? "Votre demande est traitée ✅" : "Demande prise en charge",
            body: `${SERVICE_KIND_LABEL[r.kind]} — chambre ${r.room}`,
            tone: status === "traitee" ? "success" : "info",
          });
        }
      },
      setRoomStatus: (id, status) =>
        set((s) => ({ rooms: s.rooms.map((r) => (r.id === id ? { ...r, status, guest: status === "occupee" ? r.guest : undefined } : r)) })),
      checkInOnline: (reservationId) => {
        set((s) => ({ reservations: s.reservations.map((r) => (r.id === reservationId ? { ...r, checkedInOnline: true, status: "arrivee" } : r)) }));
        const r = get().reservations.find((x) => x.id === reservationId);
        if (r) {
          get()._emit({ vertical: "hotel", audience: "admin", title: "Check-in en ligne", body: `${r.guest} — chambre ${r.room}`, tone: "success" });
          get()._log("hotel", "app", `Check-in en ligne effectué — ${r.guest}`);
        }
      },
      checkOut: (reservationId) => {
        const r = get().reservations.find((x) => x.id === reservationId);
        set((s) => ({
          reservations: s.reservations.map((x) => (x.id === reservationId ? { ...x, status: "partie" } : x)),
          rooms: r ? s.rooms.map((rm) => (rm.number === r.room ? { ...rm, status: "menage", guest: undefined } : rm)) : s.rooms,
        }));
        if (r) get()._log("hotel", "admin", `Check-out ${r.ref} — chambre ${r.room} à nettoyer`);
      },
      createReservation: (input) => {
        const id = uid("rsv");
        set((s) => ({
          reservations: [{ id, ref: `BKG-${9046 + Math.floor(Math.random() * 900)}`, status: "demande", ...input }, ...s.reservations],
        }));
        get()._emit({ vertical: "hotel", audience: "admin", title: "Réservation à valider", body: `${input.guest} — chambre ${input.room}`, tone: "warn" });
        get()._log("hotel", "app", `Demande de réservation chambre ${input.room} — ${input.guest}`);
        return id;
      },
      setReservationStatus: (id, status) => {
        set((s) => ({ reservations: s.reservations.map((r) => (r.id === id ? { ...r, status } : r)) }));
        const r = get().reservations.find((x) => x.id === id);
        if (!r) return;
        get()._log("hotel", "admin", `Réservation ${r.ref} ${status === "confirmee" ? "validée" : "refusée"}`);
        get()._emit({
          vertical: "hotel",
          audience: "app",
          title: status === "confirmee" ? "Réservation confirmée 🎉" : "Réservation refusée",
          body: `${r.ref} — chambre ${r.room}. ${status === "confirmee" ? "Check-in en ligne disponible." : "Vous n'avez pas été débité (démo)."}`,
          tone: status === "confirmee" ? "success" : "warn",
        });
      },

      /* ── Cross ───────────────────────────────────────────────────────── */
      markAllRead: (vertical, audience) =>
        set((s) => ({ notifications: s.notifications.map((n) => (n.vertical === vertical && n.audience === audience ? { ...n, read: true } : n)) })),

      resetDemo: () => {
        clearPresentationTimers();
        set({ ...makeSeed(), presentation: { running: false, vertical: null, step: 0, total: 0, caption: "" } });
      },

      /* ── Présentation mains-libres ───────────────────────────────────── */
      startPresentation: (vertical) => {
        clearPresentationTimers();
        const { _emit, _log } = get();
        type Step = { caption: string; run: () => void };
        let steps: Step[] = [];

        if (vertical === "collectivite") {
          let id = "";
          steps = [
            { caption: "📱 Un citoyen signale un trottoir dégradé depuis l'app…", run: () => { id = get().createReport({ title: "Trottoir dégradé signalé en direct", category: "voirie", address: "Rue de la Démo", citizen: "Citoyen démo" }); } },
            { caption: "🖥️ La mairie réceptionne et assigne aux services techniques", run: () => get().assignReport(id, "Services techniques") },
            { caption: "🔧 Intervention en cours côté back-office", run: () => get().setReportStatus(id, "en_cours") },
            { caption: "✅ Problème résolu — le citoyen est notifié sur son téléphone", run: () => get().setReportStatus(id, "resolu") },
          ];
        } else if (vertical === "restaurant") {
          let id = "";
          steps = [
            { caption: "🌐 Un client commande sur le site web (click & collect)…", run: () => { id = get().createOrder({ items: [{ name: "Burger maison & frites", qty: 1, price: 16 }, { name: "Fondant au chocolat", qty: 1, price: 8 }], customer: "Client démo" }).id; } },
            { caption: "🖥️ Le restaurant accepte la commande", run: () => get().setOrderStatus(id, "en_preparation") },
            { caption: "🛍️ Plat prêt — le client reçoit son code de retrait", run: () => get().setOrderStatus(id, "prete") },
          ];
        } else {
          let id = "";
          steps = [
            { caption: "🌐 Un voyageur réserve une chambre sur le site web…", run: () => { id = get().createReservation({ guest: "Voyageur démo", room: "202", checkIn: isoFromNow(180), checkOut: isoFromNow(2880) }); } },
            { caption: "🖥️ La réception valide la réservation", run: () => get().setReservationStatus(id, "confirmee") },
            { caption: "🔑 Le voyageur fait son check-in en ligne — clé débloquée", run: () => get().checkInOnline(id) },
          ];
        }

        set({ presentation: { running: true, vertical, step: 0, total: steps.length, caption: "Préparation du scénario…" } });

        steps.forEach((stp, i) => {
          presentationTimers.push(
            setTimeout(() => {
              stp.run();
              set({ presentation: { running: true, vertical, step: i + 1, total: steps.length, caption: stp.caption } });
              if (i === steps.length - 1) {
                presentationTimers.push(
                  setTimeout(() => {
                    set((s) => ({ presentation: { ...s.presentation, running: false, caption: "Scénario terminé — rejouez quand vous voulez." } }));
                  }, 2400),
                );
              }
            }, 600 + i * 2600),
          );
        });
        void _emit;
        void _log;
      },
      stopPresentation: () => {
        clearPresentationTimers();
        set((s) => ({ presentation: { ...s.presentation, running: false } }));
      },
    }),
    {
      name: "neuraweb-connected-suite",
      // v2 : le modèle Procedure gagne documents/messages/createdAt + statut réservation « annulee ».
      // On repart d'un seed frais pour les états persistés antérieurs (démo, donnée non critique).
      version: 2,
      migrate: () => makeSeed() as unknown as DemoState,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s) => ({
        reports: s.reports,
        roomBookings: s.roomBookings,
        procedures: s.procedures,
        orders: s.orders,
        menu: s.menu,
        tableBookings: s.tableBookings,
        rooms: s.rooms,
        serviceRequests: s.serviceRequests,
        reservations: s.reservations,
        notifications: s.notifications,
        activity: s.activity,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) state._hydrated = true;
      },
    },
  ),
);

/* Sélecteurs utilitaires (mémoïsables) */
export const selectUnread = (vertical: VerticalId, audience: Audience) => (s: DemoState) =>
  s.notifications.filter((n) => n.vertical === vertical && n.audience === audience && !n.read).length;
