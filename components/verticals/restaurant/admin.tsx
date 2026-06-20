"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  ChefHat,
  CalendarCheck,
  UtensilsCrossed,
  Star,
  Euro,
  ShoppingBag,
  TrendingUp,
  PiggyBank,
  ArrowRight,
  Leaf,
  Clock,
  Pencil,
} from "lucide-react";
import { AdminShell, type AdminModule } from "@/components/admin-shell";
import { ActivityFeed } from "@/components/activity-feed";
import { Thumb } from "@/components/asset-image";
import { DemoLink } from "@/components/demo-link";
import { KpiCard } from "@/components/ui/kpi-card";
import { Card, CardHeader, Button } from "@/components/ui/primitives";
import { StatusBadge, orderTone, reservationTone } from "@/components/ui/status-badge";
import { RelativeTime } from "@/components/relative-time";
import { useDemoStore } from "@/lib/store";
import { toast } from "@/lib/ui-store";
import { ORDER_STATUS_LABEL, RESERVATION_STATUS_LABEL } from "@/lib/verticals";
import type { OrderStatus } from "@/lib/types";
import { cn, euros, shortDate } from "@/lib/utils";

/* Édition de prix en ligne (US-RA4 : gérer les prix) */
function PriceEditor({ id, price }: { id: string; price: number }) {
  const setPrice = useDemoStore((s) => s.setMenuPrice);
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(String(price));

  const commit = () => {
    const n = parseFloat(val.replace(",", "."));
    if (!Number.isNaN(n)) setPrice(id, n);
    setEditing(false);
  };

  if (editing) {
    return (
      <input
        autoFocus
        type="number"
        step="0.5"
        min="0"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") setEditing(false); }}
        aria-label="Modifier le prix"
        className="h-7 w-16 rounded-lg border border-amber-400/50 bg-navy-900 px-2 text-right text-sm text-white focus:outline-none"
      />
    );
  }
  return (
    <button onClick={() => { setVal(String(price)); setEditing(true); }} className="group inline-flex items-center gap-1 font-semibold text-white" title="Modifier le prix">
      {euros(price)}
      <Pencil className="h-3 w-3 text-white/30 group-hover:text-amber-300" />
    </button>
  );
}

const MODULES: AdminModule[] = [
  { key: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { key: "kds", label: "Commandes", icon: ChefHat },
  { key: "reservations", label: "Réservations", icon: CalendarCheck },
  { key: "carte", label: "Carte & menu", icon: UtensilsCrossed },
  { key: "fidelite", label: "Fidélité", icon: Star },
];

const NEXT: Partial<Record<OrderStatus, OrderStatus>> = {
  en_preparation: "prete",
  prete: "recuperee",
};

export function RestaurantAdmin({ standalone = false }: { standalone?: boolean }) {
  const [module, setModule] = useState("dashboard");
  const titles: Record<string, string> = {
    dashboard: "Tableau de bord",
    kds: "Commandes en ligne",
    reservations: "Réservations de table",
    carte: "Carte & menu",
    fidelite: "Programme de fidélité",
  };
  return (
    <AdminShell vertical="restaurant" modules={MODULES} active={module} onSelect={setModule} title={titles[module]} subtitle="La Table d'Henri · service en cours" standalone={standalone}>
      {module === "dashboard" && <Dashboard onGo={setModule} />}
      {module === "kds" && <Kds />}
      {module === "reservations" && <Reservations />}
      {module === "carte" && <Carte />}
      {module === "fidelite" && <Fidelite />}
    </AdminShell>
  );
}

/* ── Dashboard ───────────────────────────────────────────────────────────── */
function Dashboard({ onGo }: { onGo: (m: string) => void }) {
  const orders = useDemoStore((s) => s.orders);
  const active = orders.filter((o) => o.status !== "recuperee" && o.status !== "refusee");
  const pending = orders.filter((o) => o.status === "en_attente").length;
  const ca = orders.reduce((sum, o) => sum + o.total, 0) + 740;
  const avg = orders.length ? Math.round((orders.reduce((s, o) => s + o.total, 0) / orders.length) * 10) / 10 : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <KpiCard label="CA du jour" value={ca} suffix=" €" delta={14} icon={Euro} spark={[420, 510, 560, 640, 690, ca]} accentClass="text-amber-300" />
        <KpiCard label="Commandes en cours" value={active.length} icon={ShoppingBag} delta={9} spark={[2, 3, 2, 4, 3, active.length]} accentClass="text-coral-soft" />
        <KpiCard label="Panier moyen" value={avg} decimals={1} suffix=" €" delta={6} icon={TrendingUp} spark={[22, 24, 23, 26, 27, avg]} accentClass="text-lime" />
        <KpiCard label="Économies vs plateformes" value={1280} suffix=" €" delta={31} icon={PiggyBank} spark={[600, 800, 950, 1100, 1200, 1280]} accentClass="text-cyan-300" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Commandes en cours" subtitle={pending > 0 ? `${pending} à confirmer` : `${active.length} en cours`} icon={<ChefHat className="h-4 w-4" />} action={<button onClick={() => onGo("kds")} className="text-xs text-amber-300 hover:underline">Gérer</button>} />
          <div className="divide-y divide-white/5">
            {active.slice(0, 4).map((o) => (
              <div key={o.id} className="flex items-center gap-3 px-4 py-2.5">
                <span className="font-mono text-sm font-bold text-amber-300">#{o.code}</span>
                <span className="min-w-0 flex-1 truncate text-sm text-white/70">{o.items.map((i) => `${i.qty}× ${i.name}`).join(", ")}</span>
                <StatusBadge tone={orderTone[o.status]} dot>{ORDER_STATUS_LABEL[o.status]}</StatusBadge>
              </div>
            ))}
            {active.length === 0 && <p className="px-4 py-6 text-sm text-white/45">Aucune commande active. Passez-en une depuis le site web 🌐</p>}
          </div>
        </Card>
        <ActivityFeed vertical="restaurant" />
      </div>

      <Card className="flex items-center gap-4 p-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-lime/15 text-lime"><Leaf className="h-6 w-6" /></span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white">Anti-gaspillage</p>
          <p className="text-xs text-white/55">Activez une promo sur les invendus en un clic depuis « Carte & menu ».</p>
        </div>
        <Button variant="soft" size="sm" onClick={() => onGo("carte")}>Gérer <ArrowRight className="h-3.5 w-3.5" /></Button>
      </Card>
    </div>
  );
}

/* ── Commandes (module connecté : accepter / refuser puis avancer) ──────── */
function Kds() {
  const orders = useDemoStore((s) => s.orders);
  const setStatus = useDemoStore((s) => s.setOrderStatus);
  const columns: { status: OrderStatus; label: string; accent: string }[] = [
    { status: "en_attente", label: "À confirmer", accent: "border-coral/40" },
    { status: "en_preparation", label: "En préparation", accent: "border-amber-400/40" },
    { status: "prete", label: "Prêtes", accent: "border-lime/40" },
  ];

  return (
    <div className="grid gap-3 md:grid-cols-3">
      {columns.map((col) => {
        const list = orders.filter((o) => o.status === col.status);
        return (
          <div key={col.status} className={cn("rounded-2xl border bg-white/[0.03] p-2.5", col.accent)}>
            <div className="mb-2 flex items-center justify-between px-1">
              <span className="text-sm font-semibold text-white">{col.label}</span>
              <span className="rounded-full bg-white/8 px-2 py-0.5 text-xs text-white/55">{list.length}</span>
            </div>
            <div className="space-y-2">
              <AnimatePresence initial={false}>
                {list.map((o) => (
                  <motion.div
                    key={o.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="rounded-xl border border-white/10 bg-navy-900 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-base font-bold text-amber-300">#{o.code}</span>
                      <span className="flex items-center gap-1 text-[11px] text-white/40"><Clock className="h-3 w-3" /><RelativeTime iso={o.createdAt} /></span>
                    </div>
                    <ul className="mt-1.5 space-y-0.5">
                      {o.items.map((i, idx) => (
                        <li key={idx} className="flex justify-between text-xs text-white/70"><span>{i.qty}× {i.name}</span></li>
                      ))}
                    </ul>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <span className="truncate text-xs text-white/45">{o.customer}</span>
                      {col.status === "en_attente" ? (
                        <div className="flex shrink-0 gap-1.5">
                          <Button size="sm" variant="soft" onClick={() => setStatus(o.id, "refusee")}>Refuser</Button>
                          <Button size="sm" onClick={() => setStatus(o.id, "en_preparation")}>Accepter</Button>
                        </div>
                      ) : (
                        NEXT[o.status] && (
                          <Button size="sm" variant={col.status === "en_preparation" ? "solid" : "soft"} onClick={() => setStatus(o.id, NEXT[o.status]!)}>
                            {col.status === "en_preparation" ? "Prête" : "Remettre"}
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Button>
                        )
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {list.length === 0 && <p className="px-1 py-4 text-center text-xs text-white/30">—</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Réservations de table (valider / refuser) ──────────────────────────── */
function Reservations() {
  const bookings = useDemoStore((s) => s.tableBookings);
  const setStatus = useDemoStore((s) => s.setTableBookingStatus);
  return (
    <Card className="overflow-hidden">
      <CardHeader title="Réservations de table" subtitle="Validez ou refusez les demandes" icon={<CalendarCheck className="h-4 w-4" />} action={<DemoLink feature="Plan de salle interactif" className="text-xs text-amber-300 hover:underline">Plan de salle</DemoLink>} />
      <div className="divide-y divide-white/5">
        {bookings.map((b) => (
          <div key={b.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 font-bold text-amber-300">{b.covers}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-white">{b.name}</p>
              <p className="text-xs text-white/45">{b.ref} · {shortDate(b.date)} · {b.slot} · {b.covers} couverts</p>
            </div>
            <StatusBadge tone={reservationTone[b.status]} dot>{RESERVATION_STATUS_LABEL[b.status]}</StatusBadge>
            {b.status === "demande" && (
              <div className="flex gap-1.5">
                <Button size="sm" variant="soft" onClick={() => setStatus(b.id, "refusee")}>Refuser</Button>
                <Button size="sm" onClick={() => setStatus(b.id, "validee")}>Valider</Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ── Carte & menu (anti-gaspi) ──────────────────────────────────────────── */
const CAT_LABEL: Record<string, string> = { entrees: "Entrées", plats: "Plats", desserts: "Desserts", boissons: "Boissons" };
function Carte() {
  const menu = useDemoStore((s) => s.menu);
  const toggle = useDemoStore((s) => s.toggleAntiGaspi);
  const cats = ["entrees", "plats", "desserts", "boissons"] as const;
  return (
    <div className="space-y-4">
      {cats.map((c) => {
        const items = menu.filter((m) => m.category === c);
        if (!items.length) return null;
        return (
          <Card key={c}>
            <CardHeader title={CAT_LABEL[c]} subtitle={`${items.length} article(s)`} icon={<UtensilsCrossed className="h-4 w-4" />} />
            <div className="divide-y divide-white/5">
              {items.map((m) => (
                <div key={m.id} className="flex items-center gap-3 px-4 py-2.5">
                  <Thumb name={m.image} emoji={m.emoji} alt={m.name} className="h-10 w-10 shrink-0 rounded-lg" sizes="40px" />
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 truncate text-sm font-medium text-white">
                      {m.name}
                      {m.antiGaspi && <span className="inline-flex items-center gap-1 rounded-full bg-lime/15 px-2 py-0.5 text-[10px] font-semibold text-lime"><Leaf className="h-3 w-3" /> Anti-gaspi</span>}
                    </p>
                    <p className="truncate text-xs text-white/45">{m.description}</p>
                  </div>
                  <PriceEditor id={m.id} price={m.price} />
                  <button
                    onClick={() => toggle(m.id)}
                    role="switch"
                    aria-checked={!!m.antiGaspi}
                    aria-label={`Anti-gaspillage pour ${m.name}`}
                    className={cn("relative h-6 w-10 shrink-0 rounded-full transition", m.antiGaspi ? "bg-lime" : "bg-white/15")}
                  >
                    <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all", m.antiGaspi ? "left-[18px]" : "left-0.5")} />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

/* ── Fidélité ───────────────────────────────────────────────────────────── */
function Fidelite() {
  const clients = [
    { name: "Julie Pérez", pts: 320, tier: "Or" },
    { name: "Karim Benali", pts: 180, tier: "Argent" },
    { name: "Élodie Moreau", pts: 95, tier: "Bronze" },
    { name: "Thomas Roy", pts: 410, tier: "Or" },
  ];
  return (
    <Card className="overflow-hidden">
      <CardHeader title="Clients fidèles" subtitle="Points & relances" icon={<Star className="h-4 w-4" />} action={<button onClick={() => toast("Relance envoyée à 24 clients fidèles 📣", "success")} className="text-xs text-amber-300 hover:underline">Lancer une relance</button>} />
      <div className="divide-y divide-white/5">
        {clients.map((c) => (
          <div key={c.name} className="flex items-center gap-3 px-4 py-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/15 text-sm font-bold text-amber-300">{c.name[0]}</span>
            <span className="min-w-0 flex-1 truncate text-sm text-white/80">{c.name}</span>
            <StatusBadge tone={c.tier === "Or" ? "warn" : "neutral"}>{c.tier}</StatusBadge>
            <span className="w-16 text-right text-sm font-semibold text-white">{c.pts} pts</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
