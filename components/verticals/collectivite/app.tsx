"use client";

import { useEffect, useState } from "react";
import {
  Home,
  Camera,
  FileText,
  CalendarPlus,
  Bell,
  Store,
  MapPin,
  Send,
  CheckCircle2,
  ChevronRight,
  Megaphone,
  Sparkles,
  Loader2,
  ArrowLeft,
  Download,
  Upload,
  Check,
  Tag,
  Star,
  Phone,
  Pencil,
  Trash2,
  CalendarClock,
  AlertCircle,
  Clock,
  ThumbsUp,
  ShieldCheck,
  Recycle,
  Leaf,
} from "lucide-react";
import { AppShell, AppSection, AppCard, type AppTab } from "@/components/app-shell";
import { RealMap, NEAUVILLE_CENTER, latLngToXY } from "@/components/real-map";
import { Thumb } from "@/components/asset-image";
import { DemoLink } from "@/components/demo-link";
import { LightSheet } from "@/components/light-sheet";
import { StatusBadge, wasteTone } from "@/components/ui/status-badge";
import { RelativeTime } from "@/components/relative-time";
import { useDemoStore } from "@/lib/store";
import { toast } from "@/lib/ui-store";
import { RESERVATION_STATUS_LABEL, WASTE_KIND_EMOJI, WASTE_KIND_LABEL, WASTE_STATUS_LABEL } from "@/lib/verticals";
import type { Procedure, ProcedureStatus, ReportCategory, ReportStatus, RoomBooking, WasteKind, WasteStatus } from "@/lib/types";
import { cn, shortDate, sleep } from "@/lib/utils";

/* ── Données de démonstration (contenus éditoriaux) ──────────────────────── */
type Activite = { e: string; t: string; d: string; grad: string; desc: string; image?: string };
const ANIMATIONS: Activite[] = [
  { e: "🎶", t: "Fête de la musique", d: "21 juin", grad: "from-violet-500 to-indigo-500", image: "anim-musique", desc: "Concerts gratuits dans toute la ville de 18h à minuit. Scènes place du Marché, parvis de la médiathèque et square Voltaire. Restauration sur place." },
  { e: "🎬", t: "Cinéma plein air", d: "5 juillet", grad: "from-sky-500 to-cyan-500", image: "anim-cinema", desc: "Projection en plein air au parc municipal dès la tombée de la nuit (~22h). Apportez plaid et coussins. Buvette de l'association des parents d'élèves." },
  { e: "🏃", t: "Foulées de la ville", d: "30 juin", grad: "from-coral to-orange-500", image: "anim-foulees", desc: "Course solidaire de 5 et 10 km au profit du CCAS. Départ 9h30 devant l'hôtel de ville. Inscription en ligne ou sur place." },
  { e: "📚", t: "Nuit de la lecture", d: "12 juillet", grad: "from-teal-500 to-emerald-500", image: "anim-lecture", desc: "Lectures, contes et jeux à la médiathèque jusqu'à 23h. Animations pour petits et grands, entrée libre." },
  { e: "🎨", t: "Expo street-art", d: "Tout l'été", grad: "from-amber-500 to-rose-500", image: "anim-streetart", desc: "Parcours d'œuvres murales dans le centre-ville réalisées par des artistes locaux. Plan disponible à l'office de tourisme." },
];

type Commerce = {
  e: string; t: string; cat: string; tagline: string; desc: string;
  hours: string; addr: string; offer?: string; featured?: boolean; image?: string;
};
const COMMERCES: Commerce[] = [
  { e: "🥐", t: "Boulangerie du Beffroi", cat: "Boulangerie", tagline: "Pain & viennoiseries", desc: "Pains au levain, viennoiseries maison et sandwichs le midi. Une institution du centre-ville.", hours: "Mar–Dim · 7h–13h30 / 16h–19h30", addr: "3 place du Beffroi", image: "commerce-boulangerie", offer: "Le 6ᵉ croissant offert ce week-end", featured: true },
  { e: "🍽️", t: "La Table d'Henri", cat: "Restaurant", tagline: "Cuisine de saison", desc: "Cuisine de saison, click & collect et réservation en ligne. Partenaire de la ville.", hours: "Mar–Sam · 12h–14h / 19h–22h", addr: "14 rue du Beffroi", image: "commerce-resto", offer: "Café offert sur présentation de l'app" },
  { e: "💐", t: "Fleurs de Néauville", cat: "Fleuriste", tagline: "Bouquets & compositions", desc: "Bouquets, plantes et compositions sur-mesure. Livraison locale en moins de 2h.", hours: "Lun–Sam · 9h–19h", addr: "18 rue des Lilas", image: "commerce-fleuriste", offer: "−10 % sur les plantes d'intérieur" },
  { e: "🚲", t: "Cycles & Co", cat: "Vélo", tagline: "Vente & réparation", desc: "Vente, réparation express et location de vélos électriques. Atelier participatif le samedi.", hours: "Mar–Sam · 9h30–18h30", addr: "7 avenue de la Gare", image: "commerce-velo", offer: "Diagnostic vélo gratuit" },
  { e: "📚", t: "Librairie des Tilleuls", cat: "Culture", tagline: "Livres & papeterie", desc: "Librairie indépendante : romans, jeunesse, BD et idées cadeaux. Commandes en 24h.", hours: "Mar–Sam · 10h–19h", addr: "5 allée des Tilleuls" },
  { e: "🧀", t: "La Cave & Fromagerie", cat: "Épicerie fine", tagline: "Fromages & vins locaux", desc: "Affineur et caviste : produits du terroir, paniers garnis et conseils d'accord.", hours: "Mer–Dim · 9h–13h / 15h–19h30", addr: "21 place du Marché", offer: "Dégustation offerte le dimanche" },
];

type Actu = { e: string; t: string; d: string; desc: string; image?: string };
const ACTUALITES: Actu[] = [
  { e: "🥕", t: "Marché de producteurs ce samedi", d: "Place du Marché · 8h-13h", image: "actu-marche", desc: "Une trentaine de producteurs locaux vous attendent : fruits et légumes de saison, fromages, miel, pain et fleurs. Animation musicale dès 10h et atelier cuisine pour les enfants." },
  { e: "🎒", t: "Inscriptions périscolaires ouvertes", d: "Jusqu'au 15 juillet en ligne", image: "actu-periscolaire", desc: "Les inscriptions à la cantine, à la garderie et aux activités périscolaires pour l'année 2026-2027 sont ouvertes depuis l'espace citoyen. Pensez à joindre le justificatif de domicile et l'attestation d'assurance." },
  { e: "🏛️", t: "Conseil municipal — séance publique", d: "Lundi 23 juin · 19h", image: "actu-conseil", desc: "La prochaine séance du conseil municipal se tient en mairie, salle du conseil, et est ouverte au public. À l'ordre du jour : budget participatif, rénovation de la médiathèque et plan vélo." },
  { e: "♻️", t: "Nouveau calendrier de collecte des déchets", d: "À partir du 1ᵉʳ juillet", desc: "La collecte des emballages passe au mardi matin. Les encombrants sont désormais sur rendez-vous via l'application. Des composteurs partagés sont installés dans 4 nouveaux quartiers." },
];

/* ── Configuration des onglets ───────────────────────────────────────────── */
const TABS: AppTab[] = [
  { key: "accueil", label: "Accueil", icon: Home },
  { key: "signaler", label: "Signaler", icon: Camera },
  { key: "demarches", label: "Démarches", icon: FileText },
  { key: "reserver", label: "Réserver", icon: CalendarPlus },
  { key: "agenda", label: "Agenda", icon: Bell },
];

const CATEGORIES: { key: ReportCategory; label: string; emoji: string }[] = [
  { key: "voirie", label: "Voirie", emoji: "🛣️" },
  { key: "eclairage", label: "Éclairage", emoji: "💡" },
  { key: "proprete", label: "Propreté", emoji: "🧹" },
  { key: "espaces_verts", label: "Espaces verts", emoji: "🌳" },
];

/* ── Propreté & déchets : types proposés au citoyen (il choisit lui-même) ── */
const WASTE_TYPES = (Object.keys(WASTE_KIND_LABEL) as WasteKind[]).map((key) => ({
  key,
  label: WASTE_KIND_LABEL[key],
  emoji: WASTE_KIND_EMOJI[key],
}));

/** Nudges pédagogiques affichés après l'envoi (sensibilisation douce). */
const ECO_NUDGE: Record<WasteKind, string> = {
  poubelle_pleine: "Une corbeille qui déborde multiplie par 3 les dépôts au sol autour d'elle. Votre signalement casse l'effet boule de neige.",
  depot_sauvage: "Un dépôt sauvage en attire d'autres en moins de 48 h. Le signaler tôt, c'est éviter une décharge improvisée.",
  bris_verre: "Une bouteille en verre met près de 4 000 ans à se dégrader dans la nature — et blesse promeneurs et animaux bien avant.",
  encombrants: "Ce meuble peut avoir une seconde vie : réparé et revendu à petit prix par la ressourcerie, il ne finira pas enfoui.",
  autre_proprete: "Un simple mégot pollue jusqu'à 500 litres d'eau et met 12 ans à disparaître. Chaque geste compte.",
};

type LightStep = { label: string; state: "done" | "current" | "todo" };

function wasteSteps(status: WasteStatus): LightStep[] {
  const order: WasteStatus[] = ["nouveau", "qualifie", "planifie", "en_cours", "resolu"];
  const idx = order.indexOf(status);
  const labels = ["Signalement envoyé", "Qualifié par un agent", "Intervention planifiée", "Équipe sur place", "Résolu (photo à l'appui)"];
  return order.map((_, i) => ({
    label: labels[i],
    state: i < idx ? "done" : i === idx ? (status === "resolu" ? "done" : "current") : "todo",
  }));
}

function reportSteps(status: ReportStatus): LightStep[] {
  const order: ReportStatus[] = ["nouveau", "recu", "en_cours", "resolu"];
  const idx = order.indexOf(status);
  const labels = ["Signalement envoyé", "Reçu par la mairie", "Intervention en cours", "Résolu"];
  return order.map((_, i) => ({
    label: labels[i],
    state: i < idx ? "done" : i === idx ? (status === "resolu" ? "done" : "current") : "todo",
  }));
}

function procedureSteps(status: ProcedureStatus): LightStep[] {
  const idx = status === "valide" ? 2 : status === "depose" ? 0 : 1; // instruction/complement → 1
  return [
    { label: "Dossier déposé", state: idx > 0 ? "done" : "current" },
    { label: status === "complement" ? "Complément demandé" : "En instruction", state: status === "valide" ? "done" : idx === 1 ? "current" : "todo" },
    { label: "Démarche validée", state: status === "valide" ? "done" : "todo" },
  ];
}

/** Mini-frise verticale, thème clair (les apps mobiles sont claires). */
function LightSteps({ steps }: { steps: LightStep[] }) {
  return (
    <ol className="relative space-y-3">
      {steps.map((s, i) => (
        <li key={i} className="flex gap-2.5">
          <span
            className={cn(
              "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ring-1",
              s.state === "done" && "bg-lime/20 text-[#3f6212] ring-lime/50",
              s.state === "current" && "bg-indigo-100 text-indigo-600 ring-indigo-300",
              s.state === "todo" && "bg-navy-100 text-navy-300 ring-navy-200",
            )}
          >
            {s.state === "done" ? <Check className="h-3 w-3" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
          </span>
          <p className={cn("text-sm", s.state === "todo" ? "text-navy-400" : "font-medium text-navy-800")}>{s.label}</p>
        </li>
      ))}
    </ol>
  );
}

export function CollectiviteApp() {
  const [tab, setTab] = useState("accueil");
  return (
    <AppShell vertical="collectivite" tabs={TABS} active={tab} onSelect={setTab}>
      {tab === "accueil" && <Accueil onGo={setTab} />}
      {tab === "signaler" && <Signaler onTrack={() => setTab("demarches")} />}
      {tab === "demarches" && <Demarches />}
      {tab === "reserver" && <Reserver />}
      {tab === "agenda" && <Agenda />}
      {tab === "annuaire" && <Annuaire onBack={() => setTab("accueil")} />}
    </AppShell>
  );
}

/* ── Feuilles partagées ──────────────────────────────────────────────────── */
function CommerceSheet({ shop, onClose }: { shop: Commerce | null; onClose: () => void }) {
  return (
    <LightSheet open={!!shop} onClose={onClose} title={shop ? `${shop.e} ${shop.t}` : ""}>
      {shop && (
        <div className="space-y-3">
          {shop.image && <Thumb name={shop.image} alt={shop.t} className="h-32 w-full rounded-2xl" sizes="400px" />}
          <span className="inline-flex rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-700">{shop.cat}</span>
          <p className="text-sm text-navy-600">{shop.desc}</p>
          {shop.offer && (
            <div className="flex items-start gap-2 rounded-xl border border-coral/30 bg-coral/10 p-3">
              <Tag className="mt-0.5 h-4 w-4 shrink-0 text-coral" />
              <p className="text-sm text-navy-800"><span className="font-semibold">Bon plan :</span> {shop.offer}</p>
            </div>
          )}
          <div className="rounded-xl bg-surface p-3 text-sm">
            <p className="text-navy-700"><span className="font-medium">Horaires :</span> {shop.hours}</p>
            <p className="mt-1 text-navy-700"><span className="font-medium">Adresse :</span> {shop.addr}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { toast("Ajouté à vos favoris ⭐", "success"); onClose(); }} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-500 py-2.5 text-sm font-semibold text-white">
              <Star className="h-4 w-4" /> Favori
            </button>
            <button onClick={() => toast(`Itinéraire vers ${shop.t} 🗺️`, "info")} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-navy-900/15 py-2.5 text-sm font-medium text-navy-700">
              <Phone className="h-4 w-4" /> Contacter
            </button>
          </div>
        </div>
      )}
    </LightSheet>
  );
}

/* ── Accueil ─────────────────────────────────────────────────────────────── */
function Accueil({ onGo }: { onGo: (t: string) => void }) {
  const [anim, setAnim] = useState<Activite | null>(null);
  const [shop, setShop] = useState<Commerce | null>(null);
  const [actu, setActu] = useState<Actu | null>(null);
  const featured = COMMERCES.find((c) => c.featured) ?? COMMERCES[0];

  const quick = [
    { key: "signaler", label: "Signaler", icon: Camera, color: "bg-coral/10 text-coral" },
    { key: "reserver", label: "Réserver", icon: CalendarPlus, color: "bg-indigo-50 text-indigo-600" },
    { key: "demarches", label: "Démarches", icon: FileText, color: "bg-sky-50 text-sky-600" },
    { key: "agenda", label: "Agenda", icon: Bell, color: "bg-amber-50 text-amber-600" },
    { key: "annuaire", label: "Commerces", icon: Store, color: "bg-teal-50 text-teal-600" },
  ];

  return (
    <div>
      <div className="relative overflow-hidden px-4 pb-7 pt-3 text-white">
        <Thumb name="hero" alt="Ville de Néauville" className="absolute inset-0" sizes="440px" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-700/85 to-sky-600/80" />
        <div className="relative">
          <p className="text-sm/relaxed text-white/85">Bonjour 👋</p>
          <h2 className="font-display text-xl font-bold drop-shadow">Bienvenue à Néauville</h2>
          <p className="mt-0.5 text-sm text-white/80">Votre ville, dans votre poche.</p>
        </div>
      </div>

      <div className="-mt-4 px-4">
        <div className="flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 p-3 shadow-sm">
          <Megaphone className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <p className="text-xs text-amber-900">
            <span className="font-semibold">Alerte :</span> travaux rue des Lilas jusqu'au 28/06. Circulation alternée.
          </p>
        </div>
      </div>

      <AppSection title="Accès rapides">
        <div className="grid grid-cols-5 gap-1.5">
          {quick.map((q) => (
            <button key={q.key} onClick={() => onGo(q.key)} className="flex flex-col items-center gap-1.5">
              <span className={cn("flex h-12 w-12 items-center justify-center rounded-2xl", q.color)}>
                <q.icon className="h-5 w-5" />
              </span>
              <span className="text-[10px] font-medium text-navy-600">{q.label}</span>
            </button>
          ))}
        </div>
      </AppSection>

      <AppSection title="À la une" action={<button onClick={() => onGo("agenda")} className="text-xs font-medium text-indigo-600">Tout voir</button>}>
        <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1">
          {ANIMATIONS.map((a) => (
            <button
              key={a.t}
              onClick={() => setAnim(a)}
              className="w-40 shrink-0 snap-start overflow-hidden rounded-2xl border border-navy-900/8 bg-white text-left shadow-sm transition active:scale-95"
            >
              <Thumb name={a.image} emoji={a.e} alt={a.t} className={cn("h-20 w-full bg-gradient-to-br", a.grad)} sizes="160px" />
              <div className="p-2.5">
                <p className="truncate text-sm font-semibold text-navy-900">{a.t}</p>
                <p className="text-xs text-navy-500">{a.d}</p>
              </div>
            </button>
          ))}
        </div>
      </AppSection>

      {/* Mise en avant des commerces locaux */}
      <AppSection
        title="Commerces & bons plans"
        action={<button onClick={() => onGo("annuaire")} className="text-xs font-medium text-indigo-600">Tout voir</button>}
      >
        <button
          onClick={() => setShop(featured)}
          className="mb-3 flex w-full items-center gap-3 overflow-hidden rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50 p-3 text-left shadow-sm transition active:scale-[0.99]"
        >
          <Thumb name={featured.image} emoji={featured.e} alt={featured.t} className="h-14 w-14 shrink-0 rounded-2xl" sizes="56px" />
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-teal-700">
              <Star className="h-3 w-3" /> Commerce à l'honneur
            </p>
            <p className="truncate text-sm font-bold text-navy-900">{featured.t}</p>
            {featured.offer && <p className="truncate text-xs font-medium text-coral">{featured.offer}</p>}
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 text-navy-300" />
        </button>

        <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1">
          {COMMERCES.map((c) => (
            <button
              key={c.t}
              onClick={() => setShop(c)}
              className="w-36 shrink-0 snap-start overflow-hidden rounded-2xl border border-navy-900/8 bg-white text-left shadow-sm transition active:scale-95"
            >
              <Thumb name={c.image} emoji={c.e} alt={c.t} className="h-16 w-full bg-gradient-to-br from-teal-100 to-cyan-100" sizes="144px" />
              <div className="p-2.5">
                <p className="truncate text-sm font-semibold text-navy-900">{c.t}</p>
                <p className="truncate text-[11px] text-navy-500">{c.tagline}</p>
                {c.offer && (
                  <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-coral/10 px-1.5 py-0.5 text-[10px] font-medium text-coral">
                    <Tag className="h-2.5 w-2.5" /> Bon plan
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      </AppSection>

      <AppSection title="Actualités">
        <div className="space-y-2.5">
          {ACTUALITES.map((a) => (
            <AppCard key={a.t} onClick={() => setActu(a)} className="!p-2.5">
              <div className="flex items-center gap-3">
                <Thumb name={a.image} emoji={a.e} alt={a.t} className="h-12 w-12 shrink-0 rounded-xl" sizes="48px" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-navy-900">{a.t}</p>
                  <p className="truncate text-xs text-navy-500">{a.d}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-navy-300" />
              </div>
            </AppCard>
          ))}
        </div>
      </AppSection>

      {/* Feuilles de détail */}
      <LightSheet open={!!anim} onClose={() => setAnim(null)} title={anim?.t ?? ""}>
        {anim && (
          <div>
            <Thumb name={anim.image} emoji={anim.e} alt={anim.t} className={cn("mb-3 h-32 w-full rounded-2xl bg-gradient-to-br", anim.grad)} sizes="400px" />
            <p className="text-sm font-semibold text-indigo-600">{anim.d}</p>
            <p className="mt-1 text-sm text-navy-600">{anim.desc}</p>
            <button
              onClick={() => { toast("Ajouté à votre agenda 📅", "success"); setAnim(null); }}
              className="mt-4 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-sky-500 py-2.5 text-sm font-semibold text-white"
            >
              Ajouter à mon agenda
            </button>
          </div>
        )}
      </LightSheet>

      <LightSheet open={!!actu} onClose={() => setActu(null)} title={actu?.t ?? ""}>
        {actu && (
          <div>
            <Thumb name={actu.image} emoji={actu.e} alt={actu.t} className="mb-3 h-28 w-full rounded-2xl bg-gradient-to-br from-indigo-100 to-sky-100" sizes="400px" />
            <p className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600"><CalendarClock className="h-4 w-4" /> {actu.d}</p>
            <p className="mt-1.5 text-sm/relaxed text-navy-600">{actu.desc}</p>
            <button
              onClick={() => { toast("Actualité partagée 🔗", "success"); setActu(null); }}
              className="mt-4 w-full rounded-xl border border-navy-900/15 py-2.5 text-sm font-medium text-navy-700"
            >
              Partager
            </button>
          </div>
        )}
      </LightSheet>

      <CommerceSheet shop={shop} onClose={() => setShop(null)} />
    </div>
  );
}

/* ── Signaler (connecté) ─────────────────────────────────────────────────── */
/* ── Signaler : module Propreté & déchets ────────────────────────────────── */
function Signaler({ onTrack }: { onTrack: () => void }) {
  const [view, setView] = useState<"hub" | "flow" | "autre">("hub");
  const [kind, setKind] = useState<WasteKind>("depot_sauvage");
  const [doneId, setDoneId] = useState<string | null>(null);

  if (doneId) return <WasteDone id={doneId} onNew={() => { setDoneId(null); setView("hub"); }} onTrack={onTrack} />;
  if (view === "flow") return <WasteFlow kind={kind} onBack={() => setView("hub")} onDone={setDoneId} />;
  if (view === "autre") return <SignalerAutre onBack={() => setView("hub")} onTrack={onTrack} />;

  return (
    <div className="px-4 py-4">
      <h2 className="font-display text-lg font-bold text-navy-900">Signaler un problème</h2>
      <p className="text-sm text-navy-500">Photo → position GPS → envoi : 3 étapes, moins d'une minute.</p>

      <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-navy-400">Propreté & déchets</p>
      <div className="grid grid-cols-3 gap-1.5">
        {WASTE_TYPES.map((t) => (
          <button
            key={t.key}
            onClick={() => { setKind(t.key); setView("flow"); }}
            className="flex flex-col items-center gap-1 rounded-2xl border border-navy-900/10 bg-white py-3 transition active:scale-95"
          >
            <span className="text-2xl">{t.emoji}</span>
            <span className="px-1 text-center text-[10px] font-medium leading-tight text-navy-700">{t.label}</span>
          </button>
        ))}
        <button
          onClick={() => setView("autre")}
          className="flex flex-col items-center gap-1 rounded-2xl border border-dashed border-navy-900/15 bg-white py-3 transition active:scale-95"
        >
          <span className="text-2xl">🛠️</span>
          <span className="px-1 text-center text-[10px] font-medium leading-tight text-navy-500">Autre (voirie, éclairage…)</span>
        </button>
      </div>

      <AutourDeMoi />

      <p className="mt-4 flex items-start gap-1.5 text-[11px] leading-snug text-navy-400">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        Position arrondie, données EXIF supprimées, photos vérifiées par un agent. Seuls les déchets et incidents matériels sont acceptés — jamais les personnes.
      </p>
    </div>
  );
}

/** Fil « Autour de moi » : incidents proches déjà signalés — un « +1 » vaut mieux qu'un doublon. */
function AutourDeMoi() {
  const wasteReports = useDemoStore((s) => s.wasteReports);
  const confirmWasteReport = useDemoStore((s) => s.confirmWasteReport);
  const [confirmed, setConfirmed] = useState<string[]>([]);

  const nearby = wasteReports.filter((w) => w.moderation === "validee" && w.status !== "resolu").slice(0, 4);
  if (nearby.length === 0) return null;

  return (
    <div className="mt-5">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-navy-400">Autour de moi — déjà signalés</p>
      <div className="space-y-2">
        {nearby.map((w) => {
          const done = confirmed.includes(w.id);
          return (
            <AppCard key={w.id} className="flex items-center gap-2.5">
              <span className="text-xl">{WASTE_KIND_EMOJI[w.kind]}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-navy-900">{w.title}</p>
                <p className="truncate text-xs text-navy-500">
                  {w.address}{w.distanceM ? ` · à ${w.distanceM} m` : ""}
                </p>
              </div>
              <StatusBadge tone={wasteTone[w.status]}>{WASTE_STATUS_LABEL[w.status]}</StatusBadge>
              <button
                onClick={() => { confirmWasteReport(w.id); setConfirmed((c) => [...c, w.id]); toast("Merci ! Signalement confirmé — inutile d'en créer un doublon 👍", "success"); }}
                disabled={done}
                aria-label={`Confirmer le signalement ${w.ref}`}
                className={cn(
                  "flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-semibold transition",
                  done ? "bg-lime/20 text-[#3f6212]" : "bg-indigo-50 text-indigo-700 active:scale-95",
                )}
              >
                <ThumbsUp className="h-3.5 w-3.5" /> {done ? `+${w.confirmations}` : "+1"}
              </button>
            </AppCard>
          );
        })}
      </div>
      <p className="mt-2 text-[11px] text-navy-400">💡 Un problème déjà signalé ? Votre « +1 » le fait remonter dans la file de la mairie.</p>
    </div>
  );
}

/** Parcours de signalement en 3 étapes : Photo → Position → Envoi. */
function WasteFlow({ kind, onBack, onDone }: { kind: WasteKind; onBack: () => void; onDone: (id: string) => void }) {
  const createWasteReport = useDemoStore((s) => s.createWasteReport);
  const [step, setStep] = useState(1);
  const [photo, setPhoto] = useState(false);
  const [address, setAddress] = useState("");
  const [located, setLocated] = useState(false);
  const [pos, setPos] = useState<{ lat: number; lng: number } | null>(null);
  const [desc, setDesc] = useState("");
  const [anonymous, setAnonymous] = useState(true);
  const locating = step === 2 && !located;

  // Étape 2 : géolocalisation automatique (simulée) dès l'arrivée sur l'écran
  useEffect(() => {
    if (step !== 2 || located) return;
    let live = true;
    sleep(900).then(() => {
      if (!live) return;
      setAddress("Square Voltaire, côté aire de jeux");
      setPos({ lat: NEAUVILLE_CENTER.lat - 0.0016, lng: NEAUVILLE_CENTER.lng + 0.0011 });
      setLocated(true);
    });
    return () => { live = false; };
  }, [step, located]);

  const submit = () => {
    const id = createWasteReport({
      kind,
      title: desc,
      address: address.trim() || "Position GPS approximative",
      anonymous,
      ...(pos ? latLngToXY(pos.lat, pos.lng) : {}),
    });
    onDone(id);
  };

  return (
    <div className="px-4 py-4">
      <div className="flex items-center gap-2">
        <button onClick={step === 1 ? onBack : () => setStep(step - 1)} aria-label="Retour" className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-900/5 text-navy-600">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <span className="text-xl">{WASTE_KIND_EMOJI[kind]}</span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-navy-900">{WASTE_KIND_LABEL[kind]}</p>
          <p className="text-[11px] text-navy-400">Étape {step} sur 3</p>
        </div>
      </div>

      <div className="mt-3 flex gap-1.5">
        {["Photo", "Position", "Envoi"].map((label, i) => (
          <span key={label} className={cn("h-1.5 flex-1 rounded-full", i < step ? "bg-indigo-500" : "bg-navy-900/10")} />
        ))}
      </div>

      {step === 1 && (
        <>
          <p className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wide text-navy-400">1 · Prenez une photo</p>
          <button
            onClick={() => setPhoto((p) => !p)}
            className={cn(
              "flex h-36 w-full items-center justify-center rounded-2xl border-2 border-dashed transition",
              photo ? "border-indigo-400 bg-gradient-to-br from-indigo-100 to-sky-100" : "border-navy-900/15 bg-white",
            )}
          >
            {photo ? (
              <span className="relative block h-full w-full overflow-hidden rounded-xl">
                <Thumb name="signalement-exemple" alt="Photo du déchet signalé" className="absolute inset-0" sizes="400px" />
                <span className="absolute bottom-1.5 left-1.5 inline-flex items-center gap-1 rounded-full bg-navy-950/70 px-2 py-0.5 text-xs font-medium text-white">
                  <CheckCircle2 className="h-3.5 w-3.5 text-lime" /> Photo ajoutée
                </span>
              </span>
            ) : (
              <span className="flex flex-col items-center gap-1 text-navy-400">
                <Camera className="h-6 w-6" /> <span className="text-xs">Prendre une photo</span>
              </span>
            )}
          </button>
          <p className="mt-2 text-[11px] text-navy-400">La photo aide l'agent de la mairie à évaluer la situation et à prévoir le bon matériel.</p>
          <button
            onClick={() => setStep(2)}
            disabled={!photo}
            className={cn(
              "mt-4 w-full rounded-xl py-3 text-sm font-semibold text-white transition",
              photo ? "bg-gradient-to-r from-indigo-600 to-sky-500 shadow-lg shadow-indigo-500/25" : "bg-navy-300",
            )}
          >
            Continuer
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <p className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wide text-navy-400">2 · Position détectée</p>
          {locating ? (
            <div className="flex h-40 items-center justify-center rounded-2xl border border-navy-900/10 bg-white">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
            </div>
          ) : (
            <RealMap
              className="h-40 overflow-hidden rounded-2xl border border-navy-900/10"
              center={pos ?? NEAUVILLE_CENTER}
              zoom={16}
              pin={pos}
              onPick={(p) => {
                setPos(p);
                setAddress(`Position ajustée (${p.lat.toFixed(4)}, ${p.lng.toFixed(4)})`);
              }}
            />
          )}
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder={locating ? "Localisation en cours…" : "Adresse du problème"}
            className="mt-3 h-10 w-full rounded-xl border border-navy-900/12 bg-white px-3 text-sm text-navy-900 placeholder:text-navy-300 focus:border-indigo-400 focus:outline-none"
          />
          <p className="mt-2 text-[11px] text-navy-400">📍 Carte interactive : touchez pour ajuster l'épingle. Position arrondie — votre domicile n'est jamais transmis.</p>
          <button
            onClick={() => setStep(3)}
            disabled={locating}
            className={cn(
              "mt-4 w-full rounded-xl py-3 text-sm font-semibold text-white transition",
              !locating ? "bg-gradient-to-r from-indigo-600 to-sky-500 shadow-lg shadow-indigo-500/25" : "bg-navy-300",
            )}
          >
            Continuer
          </button>
        </>
      )}

      {step === 3 && (
        <>
          <p className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wide text-navy-400">3 · Vérifiez et envoyez</p>
          <AppCard>
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{WASTE_KIND_EMOJI[kind]}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-navy-900">{WASTE_KIND_LABEL[kind]}</p>
                <p className="truncate text-xs text-navy-500">{address || "Position GPS approximative"}</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-lime/15 px-2 py-0.5 text-[11px] font-medium" style={{ color: "#3f6212" }}>
                <Camera className="h-3 w-3" /> 1 photo
              </span>
            </div>
          </AppCard>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Précision utile à l'équipe (optionnel)"
            rows={2}
            className="mt-3 w-full resize-none rounded-xl border border-navy-900/12 bg-white px-3 py-2 text-sm text-navy-900 placeholder:text-navy-300 focus:border-indigo-400 focus:outline-none"
          />
          <button
            onClick={() => setAnonymous((a) => !a)}
            role="switch"
            aria-checked={anonymous}
            className="mt-3 flex w-full items-center gap-2.5 rounded-xl border border-navy-900/10 bg-white px-3 py-2.5 text-left"
          >
            <span className={cn("flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition", anonymous ? "bg-indigo-600" : "bg-navy-200")}>
              <span className={cn("h-4 w-4 rounded-full bg-white shadow transition", anonymous && "translate-x-4")} />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-medium text-navy-900">Signaler anonymement</span>
              <span className="block text-[11px] leading-snug text-navy-400">Aucun compte requis — la mairie ne voit pas votre nom. Le suivi reste disponible sur cet appareil dans « Démarches ».</span>
            </span>
          </button>
          <p className="mt-3 flex items-start gap-1.5 text-[11px] leading-snug text-navy-400">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Photo vérifiée par un agent avant publication. Données conservées le temps du traitement (RGPD).
          </p>
          <button onClick={submit} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-500 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25">
            <Send className="h-4 w-4" /> Envoyer le signalement
          </button>
        </>
      )}
    </div>
  );
}

/** Écran de confirmation : suivi en direct + nudge éco + filière de valorisation. */
function WasteDone({ id, onNew, onTrack }: { id: string; onNew: () => void; onTrack: () => void }) {
  const report = useDemoStore((s) => s.wasteReports.find((w) => w.id === id));
  if (!report) return null;

  return (
    <div className="px-4 py-5">
      <div className="flex flex-col items-center text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-lime/20" style={{ color: "#3f6212" }}>
          <CheckCircle2 className="h-8 w-8" />
        </span>
        <h2 className="mt-3 font-display text-lg font-bold text-navy-900">Signalement envoyé !</h2>
        <p className="mt-1 text-sm text-navy-500">
          Référence {report.ref} — transmis à la mairie en temps réel{report.anonymous ? ", en anonyme" : ""}.
        </p>
      </div>

      <AppCard className="mt-5">
        <p className="mb-3 text-sm font-semibold text-navy-900">Suivi en direct</p>
        <LightSteps steps={wasteSteps(report.status)} />
        {report.status === "resolu" && report.photoAfter && (
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-gradient-to-r from-lime/20 to-emerald-100 px-3 py-2.5">
            <Camera className="h-4 w-4 shrink-0" style={{ color: "#3f6212" }} />
            <p className="text-xs font-medium" style={{ color: "#3f6212" }}>Photo « après » disponible : le lieu est propre. Merci ! 🌱</p>
          </div>
        )}
      </AppCard>

      <AppCard className="mt-3 border-emerald-200 bg-emerald-50/60">
        <div className="flex gap-2.5">
          <Leaf className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
          <p className="text-xs leading-relaxed text-emerald-900">{ECO_NUDGE[report.kind]}</p>
        </div>
      </AppCard>

      {report.kind === "encombrants" && (
        <AppCard className="mt-3">
          <div className="flex items-start gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700"><Recycle className="h-4.5 w-4.5" /></span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-navy-900">La Ressourcerie du Beffroi</p>
              <p className="mt-0.5 text-xs leading-snug text-navy-500">Collecte gratuitement les meubles et objets réutilisables à domicile, sous 5 jours.</p>
              <button
                onClick={() => toast("Demande transmise à la ressourcerie ♻️ (démo)", "success")}
                className="mt-2 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white active:scale-95"
              >
                Demander une collecte
              </button>
            </div>
          </div>
        </AppCard>
      )}

      <p className="mt-3 text-center text-xs text-navy-400">
        💡 Côté console mairie, qualifiez puis clôturez : le suivi ci-dessus avance tout seul.
      </p>
      <div className="mt-4 flex gap-2">
        <button onClick={onNew} className="flex-1 rounded-xl border border-navy-900/15 py-2.5 text-sm font-medium text-navy-700">
          Nouveau signalement
        </button>
        <button onClick={onTrack} className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-medium text-white">
          Mes démarches
        </button>
      </div>
    </div>
  );
}

/* ── Signalement « autre » (voirie, éclairage, espaces verts…) ───────────── */
function SignalerAutre({ onTrack, onBack }: { onTrack: () => void; onBack: () => void }) {
  const createReport = useDemoStore((s) => s.createReport);
  const reports = useDemoStore((s) => s.reports);
  const [cat, setCat] = useState<ReportCategory>("voirie");
  const [photo, setPhoto] = useState(false);
  const [address, setAddress] = useState("");
  const [locating, setLocating] = useState(false);
  const [desc, setDesc] = useState("");
  const [doneId, setDoneId] = useState<string | null>(null);

  const created = doneId ? reports.find((r) => r.id === doneId) : null;

  const locate = async () => {
    setLocating(true);
    await sleep(900);
    setAddress("4 rue Victor Hugo (position GPS)");
    setLocating(false);
  };

  const submit = () => {
    const title = desc.trim() || `${CATEGORIES.find((c) => c.key === cat)!.label} à signaler`;
    const id = createReport({ title, category: cat, address: address.trim() || "Localisation approximative", citizen: "Vous (citoyen démo)" });
    setDoneId(id);
  };

  if (created) {
    return (
      <div className="px-4 py-5">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-lime/20" style={{ color: "#3f6212" }}>
            <CheckCircle2 className="h-8 w-8" />
          </span>
          <h2 className="mt-3 font-display text-lg font-bold text-navy-900">Signalement envoyé !</h2>
          <p className="mt-1 text-sm text-navy-500">Référence {created.ref} — transmis à la mairie en temps réel.</p>
        </div>
        <AppCard className="mt-5">
          <p className="mb-3 text-sm font-semibold text-navy-900">Suivi en direct</p>
          <LightSteps steps={reportSteps(created.status)} />
        </AppCard>
        <p className="mt-3 text-center text-xs text-navy-400">
          💡 Côté back-office, faites avancer le statut : le suivi ci-dessus se met à jour tout seul.
        </p>
        <div className="mt-4 flex gap-2">
          <button onClick={() => { setDoneId(null); setPhoto(false); setAddress(""); setDesc(""); }} className="flex-1 rounded-xl border border-navy-900/15 py-2.5 text-sm font-medium text-navy-700">
            Nouveau signalement
          </button>
          <button onClick={onTrack} className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-medium text-white">
            Mes démarches
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4">
      <div className="flex items-center gap-2">
        <button onClick={onBack} aria-label="Retour" className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-900/5 text-navy-600">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h2 className="font-display text-lg font-bold text-navy-900">Autre signalement</h2>
          <p className="text-sm text-navy-500">Voirie, éclairage, espaces verts…</p>
        </div>
      </div>

      <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-navy-400">Catégorie</p>
      <div className="grid grid-cols-4 gap-1.5">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            onClick={() => setCat(c.key)}
            className={cn(
              "flex flex-col items-center gap-1 rounded-2xl border py-2.5 transition",
              cat === c.key ? "border-indigo-500 bg-indigo-50" : "border-navy-900/10 bg-white",
            )}
          >
            <span className="text-xl">{c.emoji}</span>
            <span className="text-[10px] font-medium text-navy-700">{c.label}</span>
          </button>
        ))}
      </div>

      <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-navy-400">Photo</p>
      <button
        onClick={() => setPhoto((p) => !p)}
        className={cn(
          "flex h-28 w-full items-center justify-center rounded-2xl border-2 border-dashed transition",
          photo ? "border-indigo-400 bg-gradient-to-br from-indigo-100 to-sky-100" : "border-navy-900/15 bg-white",
        )}
      >
        {photo ? (
          <span className="relative block h-full w-full overflow-hidden rounded-xl">
            <Thumb name="signalement-exemple" alt="Photo du problème signalé" className="absolute inset-0" sizes="400px" />
            <span className="absolute bottom-1.5 left-1.5 inline-flex items-center gap-1 rounded-full bg-navy-950/70 px-2 py-0.5 text-xs font-medium text-white">
              <CheckCircle2 className="h-3.5 w-3.5 text-lime" /> Photo ajoutée
            </span>
          </span>
        ) : (
          <span className="flex flex-col items-center gap-1 text-navy-400">
            <Camera className="h-6 w-6" /> <span className="text-xs">Prendre une photo</span>
          </span>
        )}
      </button>

      <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-navy-400">Localisation</p>
      <div className="flex gap-2">
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Adresse du problème"
          className="h-10 flex-1 rounded-xl border border-navy-900/12 bg-white px-3 text-sm text-navy-900 placeholder:text-navy-300 focus:border-indigo-400 focus:outline-none"
        />
        <button onClick={locate} className="flex h-10 items-center gap-1.5 rounded-xl bg-navy-900 px-3 text-xs font-medium text-white">
          {locating ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
          {locating ? "…" : "GPS"}
        </button>
      </div>

      <textarea
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        placeholder="Décrivez le problème (optionnel)"
        rows={2}
        className="mt-3 w-full resize-none rounded-xl border border-navy-900/12 bg-white px-3 py-2 text-sm text-navy-900 placeholder:text-navy-300 focus:border-indigo-400 focus:outline-none"
      />

      <button onClick={submit} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-500 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25">
        <Send className="h-4 w-4" /> Envoyer le signalement
      </button>
    </div>
  );
}

/* ── Mes démarches (confidentialité : uniquement les siennes) ────────────── */
const PROC_LABEL: Record<ProcedureStatus, string> = { depose: "Déposé", instruction: "En instruction", complement: "Complément demandé", valide: "Validé" };
const PROC_TONE: Record<ProcedureStatus, "warn" | "progress" | "info" | "success"> = { depose: "warn", instruction: "progress", complement: "info", valide: "success" };
const PROC_TYPES = ["Acte de naissance", "Acte de mariage", "Inscription scolaire", "Déclaration de travaux", "Recensement citoyen"];

const isMine = (citizen: string) => citizen.includes("Vous") || citizen.includes("démo");

function Demarches() {
  const reports = useDemoStore((s) => s.reports);
  const wasteReports = useDemoStore((s) => s.wasteReports);
  const procedures = useDemoStore((s) => s.procedures);
  const createProcedure = useDemoStore((s) => s.createProcedure);
  const [openReport, setOpenReport] = useState<string | null>(null);
  const [procId, setProcId] = useState<string | null>(null);

  const myReports = reports.filter((r) => isMine(r.citizen));
  // Créés depuis cet appareil (même anonymes : la mairie ne voit pas le nom,
  // mais l'appareil garde le suivi) + éventuels signalements nominatifs.
  const myWaste = wasteReports.filter((w) => w.mine || (w.citizen && isMine(w.citizen)));
  const myProcedures = procedures.filter((p) => isMine(p.citizen));
  const proc = procId ? procedures.find((p) => p.id === procId) ?? null : null;

  return (
    <div>
      <AppSection title="Mes signalements">
        {myReports.length === 0 && myWaste.length === 0 ? (
          <AppCard><p className="text-sm text-navy-500">Aucun signalement pour l'instant. Créez-en un depuis l'onglet « Signaler ». (Les signalements anonymes ne sont pas rattachés à votre compte.)</p></AppCard>
        ) : (
          <div className="space-y-2.5">
            {myWaste.map((w) => (
              <AppCard key={w.id} onClick={() => setOpenReport(openReport === w.id ? null : w.id)}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{WASTE_KIND_EMOJI[w.kind]}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-navy-900">{w.title}</p>
                    <p className="text-xs text-navy-500">{w.ref} · {WASTE_KIND_LABEL[w.kind]}{w.anonymous ? " · anonyme" : ""}</p>
                  </div>
                  <StatusBadge tone={wasteTone[w.status]} dot>{WASTE_STATUS_LABEL[w.status]}</StatusBadge>
                  <ChevronRight className={cn("h-4 w-4 text-navy-300 transition", openReport === w.id && "rotate-90")} />
                </div>
                {openReport === w.id && (
                  <div className="mt-3 border-t border-navy-900/8 pt-3">
                    <LightSteps steps={wasteSteps(w.status)} />
                    {w.status === "resolu" && w.photoAfter && (
                      <p className="mt-2 rounded-lg bg-lime/15 px-2.5 py-1.5 text-xs font-medium" style={{ color: "#3f6212" }}>
                        📸 Photo « après » jointe par l'équipe : lieu nettoyé.
                      </p>
                    )}
                  </div>
                )}
              </AppCard>
            ))}
            {myReports.map((r) => (
              <AppCard key={r.id} onClick={() => setOpenReport(openReport === r.id ? null : r.id)}>
                <div className="flex items-center gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-navy-900">{r.title}</p>
                    <p className="text-xs text-navy-500">{r.ref}</p>
                  </div>
                  <ChevronRight className={cn("h-4 w-4 text-navy-300 transition", openReport === r.id && "rotate-90")} />
                </div>
                {openReport === r.id && (
                  <div className="mt-3 border-t border-navy-900/8 pt-3">
                    <LightSteps steps={reportSteps(r.status)} />
                  </div>
                )}
              </AppCard>
            ))}
          </div>
        )}
      </AppSection>

      <AppSection title="Mes démarches" action={<DemoLink feature="FranceConnect" className="text-xs font-medium text-indigo-600">FranceConnect</DemoLink>}>
        {myProcedures.length === 0 ? (
          <AppCard><p className="text-sm text-navy-500">Vous n'avez aucune démarche en cours. Initiez-en une ci-dessous.</p></AppCard>
        ) : (
          <div className="space-y-2.5">
            {myProcedures.map((p) => {
              const pendingUploads = p.documents.filter((d) => d.kind === "upload" && !d.uploaded).length;
              return (
                <AppCard key={p.id} onClick={() => setProcId(p.id)}>
                  <div className="flex items-center gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-navy-900">{p.type}</p>
                      <p className="text-xs text-navy-500">{p.ref} · déposé le {shortDate(p.createdAt)}</p>
                    </div>
                    <StatusBadge tone={PROC_TONE[p.status]} dot>{PROC_LABEL[p.status]}</StatusBadge>
                  </div>
                  {p.status === "complement" && (
                    <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-coral/10 px-2 py-1.5 text-xs font-medium text-coral">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      Action requise{pendingUploads > 0 ? ` — ${pendingUploads} pièce(s) à fournir` : ""}
                    </div>
                  )}
                </AppCard>
              );
            })}
          </div>
        )}
      </AppSection>

      <AppSection title="Initier une démarche">
        <div className="flex flex-wrap gap-1.5">
          {PROC_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => { const id = createProcedure({ type: t }); setProcId(id); }}
              className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 transition active:scale-95"
            >
              + {t}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-navy-400">💡 La démarche déposée arrive aussitôt côté mairie pour instruction.</p>
      </AppSection>

      <ProcedureSheet proc={proc} onClose={() => setProcId(null)} />
    </div>
  );
}

/* ── Détail d'une démarche : suivi, messages, pièces ─────────────────────── */
function ProcedureSheet({ proc, onClose }: { proc: Procedure | null; onClose: () => void }) {
  const uploadDoc = useDemoStore((s) => s.uploadProcedureDocument);
  const submitComplement = useDemoStore((s) => s.submitProcedureComplement);
  const [downloading, setDownloading] = useState<string | null>(null);

  if (!proc) return <LightSheet open={false} onClose={onClose} title="">{null}</LightSheet>;

  const forms = proc.documents.filter((d) => d.kind === "form");
  const uploads = proc.documents.filter((d) => d.kind === "upload");
  const pendingUploads = uploads.filter((d) => !d.uploaded);
  const lastAdminMsg = [...proc.messages].reverse().find((m) => m.from === "administration");

  const download = async (docId: string) => {
    setDownloading(docId);
    await sleep(700);
    setDownloading(null);
    toast("Document téléchargé 📄 (simulé)", "success");
  };

  const submit = () => {
    submitComplement(proc.id);
    toast("Compléments transmis à la mairie ✅", "success");
    onClose();
  };

  return (
    <LightSheet open={!!proc} onClose={onClose} title={proc.type}>
      <div className="space-y-4">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-navy-500">
            <p>{proc.ref}</p>
            <p className="mt-0.5 flex items-center gap-1"><Clock className="h-3 w-3" /> Déposé le {shortDate(proc.createdAt)} · maj <RelativeTime iso={proc.updatedAt} /></p>
          </div>
          <StatusBadge tone={PROC_TONE[proc.status]} dot>{PROC_LABEL[proc.status]}</StatusBadge>
        </div>

        {/* Suivi */}
        <div className="rounded-2xl border border-navy-900/8 bg-white p-3">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-navy-400">Suivi du dossier</p>
          <LightSteps steps={procedureSteps(proc.status)} />
        </div>

        {/* Message de l'administration (complément / précisions) */}
        {proc.status === "complement" && lastAdminMsg && (
          <div className="flex items-start gap-2 rounded-2xl border border-coral/30 bg-coral/10 p-3">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-coral" />
            <div>
              <p className="text-xs font-semibold text-coral">Message de l'administration</p>
              <p className="mt-0.5 text-sm text-navy-800">{lastAdminMsg.body}</p>
            </div>
          </div>
        )}

        {/* Documents à télécharger */}
        {forms.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-navy-400">Documents à télécharger</p>
            <div className="space-y-2">
              {forms.map((d) => (
                <div key={d.id} className="flex items-center gap-2.5 rounded-xl border border-navy-900/8 bg-white p-2.5">
                  <FileText className="h-4 w-4 shrink-0 text-indigo-500" />
                  <p className="min-w-0 flex-1 truncate text-sm text-navy-800">{d.name}</p>
                  <button
                    onClick={() => download(d.id)}
                    className="flex shrink-0 items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-medium text-indigo-700"
                  >
                    {downloading === d.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                    Télécharger
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pièces à fournir */}
        {uploads.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-navy-400">Pièces à fournir</p>
            <div className="space-y-2">
              {uploads.map((d) => (
                <div key={d.id} className="flex items-center gap-2.5 rounded-xl border border-navy-900/8 bg-white p-2.5">
                  <Upload className={cn("h-4 w-4 shrink-0", d.uploaded ? "text-lime-700" : "text-navy-400")} />
                  <p className="min-w-0 flex-1 truncate text-sm text-navy-800">{d.name}</p>
                  {d.uploaded ? (
                    <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-[#3f6212]"><CheckCircle2 className="h-3.5 w-3.5" /> Fourni</span>
                  ) : (
                    <button
                      onClick={() => { uploadDoc(proc.id, d.id); toast("Pièce téléversée 📎 (simulé)", "success"); }}
                      className="flex shrink-0 items-center gap-1 rounded-lg bg-navy-900 px-2.5 py-1.5 text-xs font-medium text-white"
                    >
                      <Upload className="h-3.5 w-3.5" /> Téléverser
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action complément */}
        {proc.status === "complement" && (
          <button
            onClick={submit}
            disabled={pendingUploads.length > 0}
            className={cn(
              "w-full rounded-xl py-3 text-sm font-semibold text-white",
              pendingUploads.length > 0 ? "cursor-not-allowed bg-navy-200" : "bg-gradient-to-r from-indigo-600 to-sky-500 shadow-lg shadow-indigo-500/25",
            )}
          >
            {pendingUploads.length > 0 ? `Fournissez ${pendingUploads.length} pièce(s) pour continuer` : "Envoyer les compléments"}
          </button>
        )}

        {/* Historique des messages */}
        {proc.messages.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-navy-400">Historique</p>
            <div className="space-y-2">
              {proc.messages.map((m) => (
                <div key={m.id} className={cn("rounded-xl p-2.5 text-sm", m.from === "administration" ? "bg-surface text-navy-700" : "bg-indigo-50 text-indigo-900")}>
                  <p className="mb-0.5 flex items-center justify-between text-[11px] font-medium text-navy-400">
                    <span>{m.from === "administration" ? "🏛️ Mairie de Néauville" : "🙋 Vous"}</span>
                    <RelativeTime iso={m.ts} />
                  </p>
                  {m.body}
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-center text-[11px] text-navy-400">
          💡 Côté mairie, l'agent peut demander un complément : il apparaîtra ici instantanément.
        </p>
      </div>
    </LightSheet>
  );
}

/* ── Réserver (connecté) + gestion (modifier / annuler) ──────────────────── */
const RESOURCES = ["Salle des fêtes", "Gymnase municipal", "Atelier médiathèque", "Salle de réunion B"];
const SLOTS = ["10:00 – 12:00", "14:00 – 16:00", "18:00 – 20:00", "20:00 – 23:00"];

function Reserver() {
  const bookings = useDemoStore((s) => s.roomBookings);
  const createBooking = useDemoStore((s) => s.createRoomBooking);
  const [resource, setResource] = useState("Salle des fêtes");
  const [slot, setSlot] = useState("18:00 – 20:00");
  const [people, setPeople] = useState(20);
  const [done, setDone] = useState(false);
  const [manageId, setManageId] = useState<string | null>(null);

  const myBookings = bookings.filter((b) => isMine(b.applicant));
  const managed = manageId ? bookings.find((b) => b.id === manageId) ?? null : null;

  if (done) {
    return (
      <div className="flex flex-col items-center px-4 py-10 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600"><CheckCircle2 className="h-8 w-8" /></span>
        <h2 className="mt-3 font-display text-lg font-bold text-navy-900">Demande envoyée</h2>
        <p className="mt-1 text-sm text-navy-500">{resource} · {slot}. La mairie validera votre demande — vous serez notifié·e.</p>
        <button onClick={() => setDone(false)} className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white">Nouvelle réservation</button>
      </div>
    );
  }

  return (
    <div>
      {myBookings.length > 0 && (
        <AppSection title="Mes réservations">
          <div className="space-y-2.5">
            {myBookings.map((b) => {
              const manageable = b.status === "demande" || b.status === "validee";
              return (
                <AppCard key={b.id} onClick={manageable ? () => setManageId(b.id) : undefined}>
                  <div className="flex items-center gap-2">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"><CalendarPlus className="h-4 w-4" /></span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-navy-900">{b.resource}</p>
                      <p className="truncate text-xs text-navy-500">{shortDate(b.date)} · {b.slot} · {b.people} pers.</p>
                    </div>
                    <StatusBadge tone={b.status === "validee" ? "success" : b.status === "demande" ? "warn" : "neutral"} dot>
                      {RESERVATION_STATUS_LABEL[b.status]}
                    </StatusBadge>
                  </div>
                  {manageable && (
                    <p className="mt-2 flex items-center gap-1 text-xs font-medium text-indigo-600"><Pencil className="h-3 w-3" /> Gérer ma réservation</p>
                  )}
                </AppCard>
              );
            })}
          </div>
        </AppSection>
      )}

      <AppSection title="Nouvelle réservation">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-navy-400">Équipement</p>
        <div className="space-y-1.5">
          {RESOURCES.map((r) => (
            <button key={r} onClick={() => setResource(r)} className={cn("flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-sm transition", resource === r ? "border-indigo-500 bg-indigo-50 font-medium text-navy-900" : "border-navy-900/10 bg-white text-navy-700")}>
              {r}
              {resource === r && <CheckCircle2 className="h-4 w-4 text-indigo-600" />}
            </button>
          ))}
        </div>

        <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-navy-400">Créneau</p>
        <div className="grid grid-cols-2 gap-1.5">
          {SLOTS.map((s) => (
            <button key={s} onClick={() => setSlot(s)} className={cn("rounded-xl border py-2 text-xs font-medium transition", slot === s ? "border-indigo-500 bg-indigo-50 text-navy-900" : "border-navy-900/10 bg-white text-navy-600")}>{s}</button>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-medium text-navy-700">Nombre de personnes</span>
          <div className="flex items-center gap-3">
            <button onClick={() => setPeople((p) => Math.max(1, p - 5))} className="h-8 w-8 rounded-full bg-navy-100 text-navy-700">−</button>
            <span className="w-8 text-center font-semibold text-navy-900">{people}</span>
            <button onClick={() => setPeople((p) => p + 5)} className="h-8 w-8 rounded-full bg-navy-100 text-navy-700">+</button>
          </div>
        </div>

        <button onClick={() => { createBooking({ resource, date: new Date().toISOString(), slot, applicant: "Vous (citoyen démo)", people }); setDone(true); }} className="mt-5 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-sky-500 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25">
          Demander la réservation
        </button>
      </AppSection>

      <ManageBookingSheet booking={managed} onClose={() => setManageId(null)} />
    </div>
  );
}

function ManageBookingSheet({ booking, onClose }: { booking: RoomBooking | null; onClose: () => void }) {
  const updateBooking = useDemoStore((s) => s.updateRoomBooking);
  const cancelBooking = useDemoStore((s) => s.cancelRoomBooking);
  const [confirmCancel, setConfirmCancel] = useState(false);

  // État d'édition local, réinitialisé à chaque ouverture.
  const [slot, setSlot] = useState(booking?.slot ?? SLOTS[2]);
  const [people, setPeople] = useState(booking?.people ?? 20);
  const [editKey, setEditKey] = useState<string | null>(null);
  if (booking && editKey !== booking.id) {
    setEditKey(booking.id);
    setSlot(booking.slot);
    setPeople(booking.people);
    setConfirmCancel(false);
  }

  const save = () => {
    if (!booking) return;
    updateBooking(booking.id, { slot, people });
    toast("Réservation modifiée — en attente de validation", "info");
    onClose();
  };

  const cancel = () => {
    if (!booking) return;
    cancelBooking(booking.id);
    toast("Réservation annulée", "warn");
    onClose();
  };

  return (
    <LightSheet open={!!booking} onClose={onClose} title={booking?.resource ?? ""}>
      {booking && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-navy-500">{booking.ref} · {shortDate(booking.date)}</p>
            <StatusBadge tone={booking.status === "validee" ? "success" : "warn"} dot>{RESERVATION_STATUS_LABEL[booking.status]}</StatusBadge>
          </div>

          {!confirmCancel ? (
            <>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-navy-400">Créneau</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {SLOTS.map((s) => (
                    <button key={s} onClick={() => setSlot(s)} className={cn("rounded-xl border py-2 text-xs font-medium transition", slot === s ? "border-indigo-500 bg-indigo-50 text-navy-900" : "border-navy-900/10 bg-white text-navy-600")}>{s}</button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-navy-700">Nombre de personnes</span>
                <div className="flex items-center gap-3">
                  <button onClick={() => setPeople((p) => Math.max(1, p - 5))} className="h-8 w-8 rounded-full bg-navy-100 text-navy-700">−</button>
                  <span className="w-8 text-center font-semibold text-navy-900">{people}</span>
                  <button onClick={() => setPeople((p) => p + 5)} className="h-8 w-8 rounded-full bg-navy-100 text-navy-700">+</button>
                </div>
              </div>

              {booking.status === "validee" && (
                <p className="rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs text-amber-800">
                  ⚠️ Modifier une réservation validée la replace en attente de validation par la mairie.
                </p>
              )}

              <div className="flex gap-2">
                <button onClick={() => setConfirmCancel(true)} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 py-2.5 text-sm font-medium text-red-600">
                  <Trash2 className="h-4 w-4" /> Annuler
                </button>
                <button onClick={save} className="flex flex-[1.4] items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-500 py-2.5 text-sm font-semibold text-white">
                  <Check className="h-4 w-4" /> Enregistrer
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3">
                <Trash2 className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                <p className="text-sm text-navy-800">Confirmez-vous l'annulation de la réservation <span className="font-semibold">{booking.resource}</span> ({booking.ref}) ? La mairie en sera informée.</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setConfirmCancel(false)} className="flex-1 rounded-xl border border-navy-900/15 py-2.5 text-sm font-medium text-navy-700">Retour</button>
                <button onClick={cancel} className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white">Confirmer l'annulation</button>
              </div>
            </div>
          )}
        </div>
      )}
    </LightSheet>
  );
}

/* ── Agenda & notifications ─────────────────────────────────────────────── */
function Agenda() {
  const notifications = useDemoStore((s) => s.notifications).filter((n) => n.vertical === "collectivite" && n.audience === "app");
  return (
    <div>
      <AppSection title="Mes notifications">
        {notifications.length === 0 ? (
          <AppCard><p className="text-sm text-navy-500">Pas encore de notification. Vos suivis de demandes apparaîtront ici (push simulées).</p></AppCard>
        ) : (
          <div className="space-y-2.5">
            {notifications.map((n) => (
              <AppCard key={n.id}>
                <div className="flex items-start gap-2.5">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-navy-900">{n.title}</p>
                    <p className="text-xs text-navy-500">{n.body}</p>
                    <RelativeTime iso={n.ts} className="text-[11px] text-navy-400" />
                  </div>
                </div>
              </AppCard>
            ))}
          </div>
        )}
      </AppSection>
      <AppSection title="Événements à venir">
        <div className="space-y-2.5">
          {[
            { t: "Fête de la musique", d: "21 juin · Centre-ville", e: "🎶" },
            { t: "Don du sang", d: "26 juin · Salle des fêtes", e: "🩸" },
            { t: "Cinéma plein air", d: "5 juillet · Parc municipal", e: "🎬" },
          ].map((e) => (
            <AppCard key={e.t}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{e.e}</span>
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-navy-900">{e.t}</p><p className="text-xs text-navy-500">{e.d}</p></div>
                <button onClick={() => toast(`« ${e.t} » ajouté à votre agenda 📅`, "success")} className="text-xs font-medium text-indigo-600">+ Agenda</button>
              </div>
            </AppCard>
          ))}
        </div>
      </AppSection>
    </div>
  );
}

/* ── Annuaire commerces ─────────────────────────────────────────────────── */
function Annuaire({ onBack }: { onBack: () => void }) {
  const [shop, setShop] = useState<Commerce | null>(null);
  return (
    <div>
      <div className="flex items-center gap-2 px-4 pt-3">
        <button onClick={onBack} className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-100 text-navy-700"><ArrowLeft className="h-4 w-4" /></button>
        <h2 className="font-display text-lg font-bold text-navy-900">Commerces locaux</h2>
      </div>
      <AppSection>
        <div className="space-y-2.5">
          {COMMERCES.map((c) => (
            <AppCard key={c.t} onClick={() => setShop(c)} className="!p-2.5">
              <div className="flex items-center gap-3">
                <Thumb name={c.image} emoji={c.e} alt={c.t} className="h-12 w-12 shrink-0 rounded-xl" sizes="48px" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-navy-900">{c.t}</p>
                  <p className="truncate text-xs text-navy-500">{c.cat} · {c.tagline}</p>
                </div>
                {c.offer ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-coral/10 px-2 py-0.5 text-[10px] font-medium text-coral"><Tag className="h-2.5 w-2.5" /> Bon plan</span>
                ) : (
                  <span className="text-xs font-medium text-indigo-600">Voir</span>
                )}
              </div>
            </AppCard>
          ))}
        </div>
      </AppSection>

      <CommerceSheet shop={shop} onClose={() => setShop(null)} />
    </div>
  );
}
