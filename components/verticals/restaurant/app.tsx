"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Home,
  UtensilsCrossed,
  Receipt,
  CalendarPlus,
  Star,
  Plus,
  Minus,
  ShoppingBag,
  Leaf,
  CreditCard,
  Loader2,
  CheckCircle2,
  XCircle,
  X,
  MapPin,
  Clock,
  ChevronRight,
} from "lucide-react";
import { SiteShell, type SiteTab } from "@/components/site-shell";
import { AppSection, AppCard } from "@/components/app-shell";
import { Thumb } from "@/components/asset-image";
import { Timeline, type TimelineStep } from "@/components/ui/timeline";
import { useDemoStore } from "@/lib/store";
import { toast } from "@/lib/ui-store";
import type { MenuItem, OrderStatus } from "@/lib/types";
import { cn, euros, sleep } from "@/lib/utils";

const TABS: SiteTab[] = [
  { key: "vitrine", label: "Accueil", icon: Home },
  { key: "commander", label: "Commander", icon: UtensilsCrossed },
  { key: "suivi", label: "Suivi", icon: Receipt },
  { key: "reserver", label: "Réserver", icon: CalendarPlus },
  { key: "fidelite", label: "Fidélité", icon: Star },
];

function orderSteps(status: OrderStatus): TimelineStep[] {
  const labels = ["Commande envoyée", "Confirmée par le restaurant", "En préparation", "Prête — à récupérer", "Récupérée"];
  // index « courant » selon le statut
  const currentByStatus: Record<string, number> = { en_attente: 1, en_preparation: 2, prete: 3, recuperee: 5 };
  const cur = currentByStatus[status] ?? 0;
  return labels.map((label, i) => ({ label, state: i < cur ? "done" : i === cur ? "current" : "todo" }));
}

export function RestaurantSite() {
  const [tab, setTab] = useState("vitrine");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);

  return (
    <SiteShell vertical="restaurant" tabs={TABS} active={tab} onSelect={setTab}>
      {tab === "vitrine" && <Vitrine onOrder={() => setTab("commander")} />}
      {tab === "commander" && (
        <Commander cart={cart} setCart={setCart} onOrdered={(id) => { setLastOrderId(id); setCart({}); setTab("suivi"); }} />
      )}
      {tab === "suivi" && <Suivi lastOrderId={lastOrderId} onOrder={() => setTab("commander")} />}
      {tab === "reserver" && <Reserver />}
      {tab === "fidelite" && <Fidelite />}
    </SiteShell>
  );
}

/* ── Vitrine ─────────────────────────────────────────────────────────────── */
function Vitrine({ onOrder }: { onOrder: () => void }) {
  return (
    <div>
      <div className="relative h-40">
        <Thumb name="hero-resto" alt="Salle du restaurant La Table d'Henri" className="absolute inset-0" sizes="440px" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/30 to-transparent" />
        <div className="absolute inset-0 flex items-end p-4">
          <div className="text-white">
            <h2 className="font-display text-xl font-bold drop-shadow">La Table d'Henri</h2>
            <p className="text-sm text-white/90">Cuisine de saison · Lille</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 px-4 py-3">
        <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-sm font-semibold text-amber-700"><Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> 4,8</span>
        <span className="flex items-center gap-1 text-xs text-navy-500"><Clock className="h-3.5 w-3.5" /> Ouvert · 12h-14h, 19h-22h</span>
      </div>

      <div className="px-4">
        <button onClick={onOrder} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-500/25">
          <ShoppingBag className="h-4 w-4" /> Commander en click & collect
        </button>
        <p className="mt-2 text-center text-xs text-navy-400">Aucune application à installer — commande 100 % en ligne.</p>
      </div>

      <AppSection title="Les incontournables">
        <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-1">
          {[
            { img: "plat-burger", n: "Burger maison", p: 16 },
            { img: "plat-risotto", n: "Risotto cèpes", p: 18 },
            { img: "plat-bar", n: "Filet de bar", p: 22 },
            { img: "plat-fondant", n: "Fondant choco", p: 8 },
          ].map((d) => (
            <div key={d.n} className="w-32 shrink-0 snap-start overflow-hidden rounded-2xl border border-navy-900/8 bg-white shadow-sm">
              <Thumb name={d.img} alt={d.n} className="h-20 w-full" sizes="128px" />
              <div className="p-2.5 text-center">
                <p className="truncate text-xs font-semibold text-navy-900">{d.n}</p>
                <p className="text-xs text-amber-600">{euros(d.p)}</p>
              </div>
            </div>
          ))}
        </div>
      </AppSection>

      <AppSection title="Avis récents">
        <div className="space-y-2.5">
          {[
            { n: "Sophie L.", t: "La commande en ligne est ultra pratique, jamais d'attente !", s: 5 },
            { n: "Marc D.", t: "Cuisine généreuse, le site est top.", s: 5 },
          ].map((a) => (
            <AppCard key={a.n}>
              <div className="mb-1 flex items-center gap-2">
                <span className="text-sm font-semibold text-navy-900">{a.n}</span>
                <span className="flex">{Array.from({ length: a.s }).map((_, i) => <Star key={i} className="h-3 w-3 fill-amber-500 text-amber-500" />)}</span>
              </div>
              <p className="text-xs text-navy-500">{a.t}</p>
            </AppCard>
          ))}
        </div>
      </AppSection>

      <AppSection>
        <AppCard>
          <div className="flex items-center gap-2 text-sm text-navy-700"><MapPin className="h-4 w-4 text-coral" /> 14 rue du Beffroi, Lille</div>
        </AppCard>
      </AppSection>
    </div>
  );
}

/* ── Commander ───────────────────────────────────────────────────────────── */
function Commander({
  cart,
  setCart,
  onOrdered,
}: {
  cart: Record<string, number>;
  setCart: (c: Record<string, number>) => void;
  onOrdered: (id: string) => void;
}) {
  const menu = useDemoStore((s) => s.menu);
  const createOrder = useDemoStore((s) => s.createOrder);
  const [openCart, setOpenCart] = useState(false);
  const [paying, setPaying] = useState(false);

  const cats = ["entrees", "plats", "desserts", "boissons"] as const;
  const catLabel: Record<string, string> = { entrees: "Entrées", plats: "Plats", desserts: "Desserts", boissons: "Boissons" };

  const lines = useMemo(
    () => Object.entries(cart).map(([id, qty]) => ({ item: menu.find((m) => m.id === id)!, qty })).filter((l) => l.item),
    [cart, menu],
  );
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const total = lines.reduce((s, l) => s + l.item.price * l.qty, 0);

  const setQty = (id: string, delta: number) => {
    const next = { ...cart };
    next[id] = Math.max(0, (next[id] ?? 0) + delta);
    if (next[id] === 0) delete next[id];
    setCart(next);
  };

  const pay = async () => {
    setPaying(true);
    await sleep(1300);
    const items = lines.map((l) => ({ name: l.item.name, qty: l.qty, price: l.item.price }));
    const { id } = createOrder({ items, customer: "Vous (client démo)" });
    setPaying(false);
    setOpenCart(false);
    onOrdered(id);
  };

  return (
    <div className="relative">
      {cats.map((c) => {
        const items = menu.filter((m) => m.category === c);
        if (!items.length) return null;
        return (
          <AppSection key={c} title={catLabel[c]}>
            <div className="space-y-2">
              {items.map((m) => (
                <MenuRow key={m.id} m={m} qty={cart[m.id] ?? 0} onAdd={() => setQty(m.id, 1)} onSub={() => setQty(m.id, -1)} />
              ))}
            </div>
          </AppSection>
        );
      })}

      {/* barre panier */}
      <AnimatePresence>
        {count > 0 && !openCart && (
          <motion.button
            initial={{ y: 80 }}
            animate={{ y: 0 }}
            exit={{ y: 80 }}
            onClick={() => setOpenCart(true)}
            className="sticky bottom-2 z-30 mx-3 flex w-[calc(100%-1.5rem)] items-center gap-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 text-white shadow-xl"
          >
            <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-white/25 px-2 text-sm font-bold">{count}</span>
            <span className="text-sm font-semibold">Voir le panier</span>
            <span className="ml-auto text-sm font-bold">{euros(total)}</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* feuille panier */}
      <AnimatePresence>
        {openCart && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-40 flex flex-col justify-end bg-navy-950/40">
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="max-h-[80%] overflow-y-auto rounded-t-3xl bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-display text-lg font-bold text-navy-900">Votre panier</h3>
                <button onClick={() => setOpenCart(false)} className="rounded-full bg-navy-100 p-1.5 text-navy-600"><X className="h-4 w-4" /></button>
              </div>
              <div className="space-y-2">
                {lines.map((l) => (
                  <div key={l.item.id} className="flex items-center gap-3">
                    <span className="text-xl">{l.item.emoji}</span>
                    <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-navy-900">{l.item.name}</p><p className="text-xs text-navy-500">{euros(l.item.price)}</p></div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setQty(l.item.id, -1)} className="flex h-7 w-7 items-center justify-center rounded-full bg-navy-100 text-navy-700"><Minus className="h-3.5 w-3.5" /></button>
                      <span className="w-5 text-center text-sm font-semibold text-navy-900">{l.qty}</span>
                      <button onClick={() => setQty(l.item.id, 1)} className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-white"><Plus className="h-3.5 w-3.5" /></button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-navy-900/8 pt-3">
                <span className="text-sm text-navy-500">Total</span>
                <span className="font-display text-xl font-bold text-navy-900">{euros(total)}</span>
              </div>
              <p className="mt-1 text-xs text-navy-400">Retrait estimé dans ~20 min · paiement simulé (aucune transaction).</p>
              <button onClick={pay} disabled={paying} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 disabled:opacity-60">
                {paying ? <><Loader2 className="h-4 w-4 animate-spin" /> Paiement…</> : <><CreditCard className="h-4 w-4" /> Payer {euros(total)}</>}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuRow({ m, qty, onAdd, onSub }: { m: MenuItem; qty: number; onAdd: () => void; onSub: () => void }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-navy-900/8 bg-white p-2.5 shadow-sm">
      <Thumb name={m.image} emoji={m.emoji} alt={m.name} className="h-16 w-16 shrink-0 rounded-xl" sizes="64px" />
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 truncate text-sm font-semibold text-navy-900">
          {m.name}
          {m.antiGaspi && <span className="inline-flex items-center gap-0.5 rounded-full bg-lime/20 px-1.5 py-0.5 text-[10px] font-semibold" style={{ color: "#3f6212" }}><Leaf className="h-2.5 w-2.5" /> -50%</span>}
        </p>
        <p className="truncate text-xs text-navy-500">{m.description}</p>
        <p className="mt-0.5 text-sm font-bold text-amber-600">{euros(m.price)}</p>
      </div>
      {qty > 0 ? (
        <div className="flex items-center gap-1.5">
          <button onClick={onSub} className="flex h-7 w-7 items-center justify-center rounded-full bg-navy-100 text-navy-700"><Minus className="h-3.5 w-3.5" /></button>
          <span className="w-4 text-center text-sm font-semibold text-navy-900">{qty}</span>
          <button onClick={onAdd} className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-white"><Plus className="h-3.5 w-3.5" /></button>
        </div>
      ) : (
        <button onClick={onAdd} aria-label={`Ajouter ${m.name}`} className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-50 text-amber-600"><Plus className="h-4 w-4" /></button>
      )}
    </div>
  );
}

/* ── Suivi ───────────────────────────────────────────────────────────────── */
function Suivi({ lastOrderId, onOrder }: { lastOrderId: string | null; onOrder: () => void }) {
  const orders = useDemoStore((s) => s.orders);
  const order = lastOrderId ? orders.find((o) => o.id === lastOrderId) : orders.find((o) => o.customer.includes("démo")) ?? null;

  if (!order) {
    return (
      <div className="flex flex-col items-center px-6 py-12 text-center">
        <Receipt className="h-10 w-10 text-navy-300" />
        <p className="mt-3 text-sm font-medium text-navy-600">Aucune commande en cours</p>
        <p className="mt-1 text-xs text-navy-400">Passez une commande pour suivre sa préparation en direct.</p>
        <button onClick={onOrder} className="mt-4 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white">Commander</button>
      </div>
    );
  }

  if (order.status === "refusee") {
    return (
      <div className="px-4 py-6">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-coral/15 text-coral"><XCircle className="h-8 w-8" /></span>
          <h2 className="mt-3 font-display text-lg font-bold text-navy-900">Commande refusée</h2>
          <p className="mt-1 text-sm text-navy-500">Le restaurant n'a pas pu accepter la commande #{order.code}. Vous n'avez pas été débité (démo).</p>
          <button onClick={onOrder} className="mt-5 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white">Repasser commande</button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4">
      <div className="rounded-3xl bg-gradient-to-br from-amber-500 to-orange-500 p-5 text-center text-white shadow-lg">
        <p className="text-sm text-white/85">Code de retrait</p>
        <p className="font-display text-5xl font-bold tracking-[0.2em]">{order.code}</p>
        <p className="mt-1 text-xs text-white/85">Présentez ce code au comptoir</p>
      </div>

      <AppCard className="mt-4">
        <p className="mb-3 text-sm font-semibold text-navy-900">Suivi en temps réel</p>
        <Timeline steps={orderSteps(order.status)} />
      </AppCard>

      <p className="mt-3 text-center text-xs text-navy-400">
        💡 Côté back-office, le restaurant accepte puis fait avancer la commande : ce suivi se met à jour instantanément.
      </p>

      <AppCard className="mt-4">
        <p className="text-sm font-semibold text-navy-900">Détail</p>
        <div className="mt-2 space-y-1">
          {order.items.map((i, idx) => (
            <div key={idx} className="flex justify-between text-sm text-navy-600"><span>{i.qty}× {i.name}</span><span>{euros(i.price * i.qty)}</span></div>
          ))}
          <div className="flex justify-between border-t border-navy-900/8 pt-1.5 text-sm font-bold text-navy-900"><span>Total</span><span>{euros(order.total)}</span></div>
        </div>
      </AppCard>
    </div>
  );
}

/* ── Réserver une table ─────────────────────────────────────────────────── */
function Reserver() {
  const createTableBooking = useDemoStore((s) => s.createTableBooking);
  const [covers, setCovers] = useState(2);
  const [slot, setSlot] = useState("20:00");
  const [done, setDone] = useState(false);
  const slots = ["12:00", "12:30", "19:30", "20:00", "20:30", "21:00"];

  if (done) {
    return (
      <div className="flex flex-col items-center px-4 py-10 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600"><CheckCircle2 className="h-8 w-8" /></span>
        <h2 className="mt-3 font-display text-lg font-bold text-navy-900">Demande envoyée</h2>
        <p className="mt-1 text-sm text-navy-500">Table pour {covers} · {slot}. Le restaurant confirmera votre réservation.</p>
        <button onClick={() => setDone(false)} className="mt-5 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-medium text-white">Nouvelle réservation</button>
      </div>
    );
  }

  return (
    <div className="px-4 py-4">
      <h2 className="font-display text-lg font-bold text-navy-900">Réserver une table</h2>
      <div className="mt-4 flex items-center justify-between rounded-2xl border border-navy-900/8 bg-white p-3">
        <span className="text-sm font-medium text-navy-700">Couverts</span>
        <div className="flex items-center gap-3">
          <button onClick={() => setCovers((c) => Math.max(1, c - 1))} className="h-8 w-8 rounded-full bg-navy-100 text-navy-700">−</button>
          <span className="w-6 text-center font-semibold text-navy-900">{covers}</span>
          <button onClick={() => setCovers((c) => c + 1)} className="h-8 w-8 rounded-full bg-navy-100 text-navy-700">+</button>
        </div>
      </div>
      <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-navy-400">Créneau</p>
      <div className="grid grid-cols-3 gap-1.5">
        {slots.map((s) => (
          <button key={s} onClick={() => setSlot(s)} className={cn("rounded-xl border py-2 text-sm font-medium transition", slot === s ? "border-amber-500 bg-amber-50 text-navy-900" : "border-navy-900/10 bg-white text-navy-600")}>{s}</button>
        ))}
      </div>
      <button onClick={() => { createTableBooking({ name: "Vous (client démo)", date: new Date().toISOString(), slot, covers }); setDone(true); }} className="mt-5 w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-500/25">
        Demander la réservation
      </button>
    </div>
  );
}

/* ── Fidélité ───────────────────────────────────────────────────────────── */
function Fidelite() {
  const pts = 180;
  const next = 250;
  return (
    <div className="px-4 py-4">
      <div className="rounded-3xl bg-gradient-to-br from-navy-900 to-navy-800 p-5 text-white">
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/70">Carte fidélité</span>
          <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
        </div>
        <p className="mt-3 font-display text-4xl font-bold">{pts} <span className="text-lg font-normal text-white/60">pts</span></p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/15">
          <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500" style={{ width: `${(pts / next) * 100}%` }} />
        </div>
        <p className="mt-1.5 text-xs text-white/70">Plus que {next - pts} pts → dessert offert 🍰</p>
      </div>

      <AppSection title="Vos récompenses">
        <div className="space-y-2.5">
          {[
            { e: "☕", n: "Café offert", c: "100 pts", ok: true },
            { e: "🍰", n: "Dessert offert", c: "250 pts", ok: false },
            { e: "🍽️", n: "-10€ dès 40€", c: "400 pts", ok: false },
          ].map((r) => (
            <AppCard key={r.n}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{r.e}</span>
                <div className="min-w-0 flex-1"><p className="text-sm font-semibold text-navy-900">{r.n}</p><p className="text-xs text-navy-500">{r.c}</p></div>
                {r.ok ? <button onClick={() => toast("Récompense activée — montrez ce code en caisse 🎁", "success")} className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white">Utiliser</button> : <ChevronRight className="h-4 w-4 text-navy-300" />}
              </div>
            </AppCard>
          ))}
        </div>
      </AppSection>
    </div>
  );
}
