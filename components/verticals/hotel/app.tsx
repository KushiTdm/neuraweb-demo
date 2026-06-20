"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  BedDouble,
  KeyRound,
  BellRing,
  Compass,
  Wifi,
  CheckCircle2,
  XCircle,
  CreditCard,
  Loader2,
  Coffee,
  Clock3,
  Car,
  Sparkles,
  X,
  Send,
  Lock,
  Hourglass,
  MapPin,
  Bot,
} from "lucide-react";
import { SiteShell, type SiteTab } from "@/components/site-shell";
import { AppSection, AppCard } from "@/components/app-shell";
import { Thumb } from "@/components/asset-image";
import { LightSheet } from "@/components/light-sheet";
import { useDemoStore } from "@/lib/store";
import { toast } from "@/lib/ui-store";
import { SERVICE_KIND_LABEL, SERVICE_STATUS_LABEL } from "@/lib/verticals";
import type { ServiceKind } from "@/lib/types";
import { cn, sleep, shortDate } from "@/lib/utils";

const TABS: SiteTab[] = [
  { key: "reserver", label: "Réserver", icon: BedDouble },
  { key: "sejour", label: "Mon séjour", icon: KeyRound },
  { key: "services", label: "Services", icon: BellRing },
  { key: "decouvrir", label: "Découvrir", icon: Compass },
];

const ROOM_TYPES = [
  { type: "Classique", price: 89, emoji: "🛏️", room: "103", image: "chambre-classique" },
  { type: "Supérieure", price: 129, emoji: "🌆", room: "201", image: "chambre-superieure" },
  { type: "Suite Lumen", price: 189, emoji: "✨", room: "202", image: "suite-lumen" },
  { type: "Suite Panorama", price: 259, emoji: "🌅", room: "302", image: "suite-panorama" },
];

const SERVICE_KINDS: { kind: ServiceKind; icon: typeof Coffee; label: string }[] = [
  { kind: "room_service", icon: Coffee, label: "Room service" },
  { kind: "late_checkout", icon: Clock3, label: "Late check-out" },
  { kind: "taxi", icon: Car, label: "Taxi / navette" },
  { kind: "menage", icon: Sparkles, label: "Ménage" },
  { kind: "spa", icon: Sparkles, label: "Spa & bien-être" },
];

export function HotelSite() {
  const [tab, setTab] = useState("sejour");
  return (
    <SiteShell vertical="hotel" tabs={TABS} active={tab} onSelect={setTab}>
      {tab === "reserver" && <Reserver onBooked={() => setTab("sejour")} />}
      {tab === "sejour" && <Sejour onServices={() => setTab("services")} />}
      {tab === "services" && <Services />}
      {tab === "decouvrir" && <Decouvrir />}
    </SiteShell>
  );
}

/* ── Réserver (connecté : demande à valider) ────────────────────────────── */
function Reserver({ onBooked }: { onBooked: () => void }) {
  const createReservation = useDemoStore((s) => s.createReservation);
  const [nights, setNights] = useState(2);
  const [room, setRoom] = useState(ROOM_TYPES[2]);
  const [paying, setPaying] = useState(false);
  const [done, setDone] = useState(false);

  const book = async () => {
    setPaying(true);
    await sleep(1200);
    const checkIn = new Date().toISOString();
    const checkOut = new Date(Date.now() + nights * 86400000).toISOString();
    createReservation({ guest: "Vous (voyageur démo)", room: room.room, checkIn, checkOut });
    setPaying(false);
    setDone(true);
  };

  if (done) {
    return (
      <div className="flex flex-col items-center px-4 py-10 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600"><Hourglass className="h-8 w-8" /></span>
        <h2 className="mt-3 font-display text-lg font-bold text-navy-900">Demande envoyée</h2>
        <p className="mt-1 text-sm text-navy-500">{room.type} · {nights} nuit{nights > 1 ? "s" : ""}. La réception valide votre réservation — suivez l'état dans « Mon séjour ».</p>
        <button onClick={onBooked} className="mt-5 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-medium text-white">Voir mon séjour</button>
      </div>
    );
  }

  return (
    <div className="px-4 py-4">
      <h2 className="font-display text-lg font-bold text-navy-900">Réserver une chambre</h2>

      <div className="mt-4 flex items-center justify-between rounded-2xl border border-navy-900/8 bg-white p-3">
        <span className="text-sm font-medium text-navy-700">Nombre de nuits</span>
        <div className="flex items-center gap-3">
          <button onClick={() => setNights((n) => Math.max(1, n - 1))} className="h-8 w-8 rounded-full bg-navy-100 text-navy-700">−</button>
          <span className="w-6 text-center font-semibold text-navy-900">{nights}</span>
          <button onClick={() => setNights((n) => n + 1)} className="h-8 w-8 rounded-full bg-navy-100 text-navy-700">+</button>
        </div>
      </div>

      <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-navy-400">Type de chambre</p>
      <div className="space-y-2">
        {ROOM_TYPES.map((r) => (
          <button key={r.type} onClick={() => setRoom(r)} className={cn("flex w-full items-center gap-3 rounded-2xl border p-2.5 text-left transition", room.type === r.type ? "border-teal-500 bg-teal-50" : "border-navy-900/10 bg-white")}>
            <Thumb name={r.image} emoji={r.emoji} alt={`Chambre ${r.type}`} className="h-14 w-20 shrink-0 rounded-xl" sizes="80px" />
            <div className="min-w-0 flex-1"><p className="text-sm font-semibold text-navy-900">{r.type}</p><p className="text-xs text-navy-500">{r.price} € / nuit</p></div>
            {room.type === r.type && <CheckCircle2 className="h-5 w-5 shrink-0 text-teal-600" />}
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-2xl bg-navy-900 px-4 py-3 text-white">
        <span className="text-sm text-white/70">Total ({nights} nuit{nights > 1 ? "s" : ""})</span>
        <span className="font-display text-xl font-bold">{room.price * nights} €</span>
      </div>

      <button onClick={book} disabled={paying} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-500 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-500/25 disabled:opacity-60">
        {paying ? <><Loader2 className="h-4 w-4 animate-spin" /> Paiement…</> : <><CreditCard className="h-4 w-4" /> Réserver (paiement simulé)</>}
      </button>
    </div>
  );
}

/* ── Mon séjour (connecté : statut + check-in) ──────────────────────────── */
function Sejour({ onServices }: { onServices: () => void }) {
  const reservations = useDemoStore((s) => s.reservations);
  const checkIn = useDemoStore((s) => s.checkInOnline);
  // Confidentialité : uniquement la réservation de l'usager démo.
  const stay =
    reservations.find((r) => r.guest.includes("démo")) ??
    reservations.find((r) => r.status === "confirmee") ??
    reservations[0];

  if (!stay) {
    return (
      <div className="flex flex-col items-center px-6 py-12 text-center">
        <BedDouble className="h-10 w-10 text-navy-300" />
        <p className="mt-3 text-sm font-medium text-navy-600">Aucune réservation</p>
        <p className="mt-1 text-xs text-navy-400">Réservez une chambre pour gérer votre séjour ici.</p>
      </div>
    );
  }

  const pending = stay.status === "demande";
  const refused = stay.status === "refusee";
  const confirmed = stay.status === "confirmee";
  const arrived = stay.status === "arrivee" || stay.checkedInOnline;

  return (
    <div className="px-4 py-4">
      <div className="relative overflow-hidden rounded-3xl text-white shadow-lg">
        <Thumb name="hero-hotel" alt="Hôtel Lumen" className="absolute inset-0" sizes="440px" priority />
        <div className="absolute inset-0 bg-gradient-to-br from-teal-700/90 to-cyan-600/80" />
        <div className="relative p-5">
          <p className="text-sm text-white/85">Votre séjour · Hôtel Lumen</p>
          <p className="font-display text-2xl font-bold">Chambre {stay.room}</p>
          <p className="mt-0.5 text-sm text-white/85">{shortDate(stay.checkIn)} → {shortDate(stay.checkOut)} · {stay.ref}</p>
        </div>
        <div className="relative flex items-center justify-between bg-black/20 px-5 py-3">
          <span className="flex items-center gap-2 text-sm">
            {arrived ? <><KeyRound className="h-4 w-4" /> Clé digitale active</> : pending ? <><Hourglass className="h-4 w-4" /> En attente de validation</> : refused ? <><XCircle className="h-4 w-4" /> Réservation refusée</> : <><Lock className="h-4 w-4" /> Clé verrouillée</>}
          </span>
          <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-semibold", arrived ? "bg-lime/30 text-white" : pending ? "bg-amber-300/30 text-white" : refused ? "bg-coral/40 text-white" : "bg-white/25 text-white")}>
            {arrived ? "Check-in fait" : pending ? "Demande envoyée" : refused ? "Refusée" : "Confirmée"}
          </span>
        </div>
      </div>

      {pending && (
        <AppCard className="mt-4 border-amber-200 bg-amber-50">
          <p className="text-sm text-amber-900"><span className="font-semibold">En attente :</span> la réception examine votre demande. Vous serez notifié·e dès qu'elle est confirmée.</p>
        </AppCard>
      )}
      {refused && (
        <AppCard className="mt-4 border-coral/30 bg-coral/5">
          <p className="text-sm text-navy-700">Votre demande n'a pas pu être confirmée (complet). Vous n'avez pas été débité (démo). Essayez d'autres dates.</p>
        </AppCard>
      )}

      {confirmed && (
        <>
          <button onClick={() => checkIn(stay.id)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-500 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-500/25">
            <KeyRound className="h-4 w-4" /> Faire mon check-in en ligne
          </button>
          <p className="mt-2 text-center text-xs text-navy-400">💡 Le check-in prévient la réception et débloque la clé — visible côté back-office.</p>
        </>
      )}

      {arrived && (
        <AppCard className="mt-4 flex items-center gap-3 border-teal-200 bg-teal-50">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-teal-600 shadow-sm"><KeyRound className="h-6 w-6" /></span>
          <div className="min-w-0 flex-1"><p className="text-sm font-semibold text-navy-900">Clé digitale</p><p className="text-xs text-navy-500">Approchez votre téléphone de la porte (mock).</p></div>
          <button onClick={() => toast("🔓 Porte déverrouillée — bon séjour !", "success")} className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white">Ouvrir</button>
        </AppCard>
      )}

      <AppSection title="Informations pratiques">
        <div className="grid grid-cols-2 gap-2.5">
          <AppCard><div className="flex items-center gap-2"><Wifi className="h-4 w-4 text-teal-600" /><div><p className="text-xs font-semibold text-navy-900">Wi-Fi</p><p className="text-xs text-navy-500">Lumen_Guest</p></div></div></AppCard>
          <AppCard onClick={onServices}><div className="flex items-center gap-2"><BellRing className="h-4 w-4 text-teal-600" /><div><p className="text-xs font-semibold text-navy-900">Services</p><p className="text-xs text-navy-500">Room service…</p></div></div></AppCard>
        </div>
      </AppSection>
    </div>
  );
}

/* ── Services (connecté) ────────────────────────────────────────────────── */
function Services() {
  const reservations = useDemoStore((s) => s.reservations);
  const services = useDemoStore((s) => s.serviceRequests);
  const createService = useDemoStore((s) => s.createServiceRequest);
  const stay = reservations.find((r) => r.guest.includes("démo")) ?? reservations.find((r) => r.checkedInOnline) ?? reservations[0];
  const myRoom = stay?.room ?? "202";

  const [sheet, setSheet] = useState<ServiceKind | null>(null);
  const [note, setNote] = useState("");

  const mine = services.filter((s) => s.guest.includes("démo") || s.room === myRoom);

  const send = () => {
    if (!sheet) return;
    createService({ room: myRoom, kind: sheet, note: note.trim() || SERVICE_KIND_LABEL[sheet], guest: "Vous (voyageur démo)" });
    setSheet(null);
    setNote("");
  };

  return (
    <div className="relative">
      <AppSection title="Demander un service">
        <div className="grid grid-cols-3 gap-2">
          {SERVICE_KINDS.map((s) => (
            <button key={s.kind} onClick={() => setSheet(s.kind)} className="flex flex-col items-center gap-1.5 rounded-2xl border border-navy-900/8 bg-white p-3 shadow-sm transition active:scale-95">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600"><s.icon className="h-5 w-5" /></span>
              <span className="text-center text-[11px] font-medium text-navy-700">{s.label}</span>
            </button>
          ))}
        </div>
      </AppSection>

      <AppSection title="Mes demandes">
        {mine.length === 0 ? (
          <AppCard><p className="text-sm text-navy-500">Aucune demande. Choisissez un service ci-dessus.</p></AppCard>
        ) : (
          <div className="space-y-2.5">
            {mine.map((sv) => (
              <AppCard key={sv.id}>
                <div className="flex items-center gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-navy-900">{SERVICE_KIND_LABEL[sv.kind]}</p>
                    <p className="truncate text-xs text-navy-500">{sv.note}</p>
                  </div>
                  <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-semibold", sv.status === "traitee" ? "bg-teal-50 text-teal-700" : sv.status === "en_cours" ? "bg-amber-50 text-amber-700" : "bg-navy-100 text-navy-600")}>
                    {SERVICE_STATUS_LABEL[sv.status]}
                  </span>
                </div>
              </AppCard>
            ))}
          </div>
        )}
        <p className="mt-2 text-center text-xs text-navy-400">💡 La réception fait avancer le statut → vous êtes notifié·e ici.</p>
      </AppSection>

      {/* sheet */}
      <AnimatePresence>
        {sheet && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-40 flex flex-col justify-end bg-navy-950/40">
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="rounded-t-3xl bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-display text-lg font-bold text-navy-900">{SERVICE_KIND_LABEL[sheet]}</h3>
                <button onClick={() => setSheet(null)} className="rounded-full bg-navy-100 p-1.5 text-navy-600"><X className="h-4 w-4" /></button>
              </div>
              <p className="text-xs text-navy-500">Chambre {myRoom}</p>
              <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Précisez votre demande (optionnel)" className="mt-2 w-full resize-none rounded-xl border border-navy-900/12 bg-white px-3 py-2 text-sm text-navy-900 placeholder:text-navy-300 focus:border-teal-400 focus:outline-none" />
              <button onClick={send} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-500 py-3 text-sm font-semibold text-white"><Send className="h-4 w-4" /> Envoyer à la réception</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Découvrir ──────────────────────────────────────────────────────────── */
const RECOS = [
  { e: "🍽️", n: "La Table d'Henri", d: "Restaurant partenaire · -10% clients Lumen", partner: true, image: "reco-table", desc: "Cuisine de saison à 6 min à pied. Réservez en ligne et profitez de -10 % sur présentation de votre confirmation de séjour Lumen.", info: "Mar–Sam · 12h–14h / 19h–22h · 14 rue du Beffroi" },
  { e: "🏛️", n: "Palais des Beaux-Arts", d: "À 8 min à pied", partner: false, image: "reco-beaux-arts", desc: "L'un des plus grands musées de France hors Paris : peintures flamandes, sculptures et plans-reliefs.", info: "Mer–Lun · 10h–18h · Place de la République" },
  { e: "☕", n: "Café Méert", d: "Pâtisserie emblématique", partner: false, image: "reco-meert", desc: "Maison historique réputée pour ses gaufres fourrées à la vanille de Madagascar.", info: "Tous les jours · 9h–19h · 27 rue Esquermoise" },
  { e: "🚲", n: "Balade à vélo", d: "Location à la réception", partner: false, image: "reco-velo", desc: "Vélos électriques disponibles à la réception. Itinéraires fléchés le long de la Deûle.", info: "Sur réservation · 12 €/jour" },
];

function Decouvrir() {
  const [reco, setReco] = useState<(typeof RECOS)[number] | null>(null);
  return (
    <div className="relative">
      <AppSection title="Conciergerie IA">
        <AppCard className="border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-teal-600 shadow-sm"><Bot className="h-5 w-5" /></span>
            <div>
              <p className="text-sm font-semibold text-navy-900">Posez-moi vos questions</p>
              <p className="text-xs text-navy-500">Horaires, restaurants, activités… L'assistant (en bas à droite) vous répond. Mention « démo » — IA simulée.</p>
            </div>
          </div>
        </AppCard>
      </AppSection>

      <AppSection title="Autour de l'hôtel">
        <div className="space-y-2.5">
          {RECOS.map((r) => (
            <AppCard key={r.n} onClick={() => setReco(r)} className="!p-2.5">
              <div className="flex items-center gap-3">
                <Thumb name={r.image} emoji={r.e} alt={r.n} className="h-14 w-14 shrink-0 rounded-xl" sizes="56px" />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 truncate text-sm font-semibold text-navy-900">{r.n}{r.partner && <span className="rounded-full bg-teal-100 px-1.5 py-0.5 text-[10px] font-semibold text-teal-700">Partenaire</span>}</p>
                  <p className="truncate text-xs text-navy-500">{r.d}</p>
                </div>
                <span className="text-xs font-medium text-teal-600">Voir</span>
              </div>
            </AppCard>
          ))}
        </div>
      </AppSection>

      <AppSection>
        <AppCard><div className="flex items-center gap-2 text-sm text-navy-700"><MapPin className="h-4 w-4 text-teal-600" /> 2 place Rihour, Lille</div></AppCard>
      </AppSection>

      <LightSheet open={!!reco} onClose={() => setReco(null)} title={reco ? `${reco.e} ${reco.n}` : ""}>
        {reco && (
          <div className="space-y-2">
            <Thumb name={reco.image} emoji={reco.e} alt={reco.n} className="h-32 w-full rounded-2xl" sizes="400px" />
            <p className="text-sm text-navy-600">{reco.desc}</p>
            <div className="rounded-xl bg-surface p-3 text-sm text-navy-700">{reco.info}</div>
            <button onClick={() => { toast("Recommandation transmise à la conciergerie 🛎️", "success"); setReco(null); }} className="mt-1 w-full rounded-xl bg-gradient-to-r from-teal-600 to-cyan-500 py-2.5 text-sm font-semibold text-white">
              Demander à la conciergerie
            </button>
          </div>
        )}
      </LightSheet>
    </div>
  );
}
