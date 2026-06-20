"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  LayoutGrid,
  BedDouble,
  BellRing,
  Tags,
  Percent,
  LogIn,
  LogOut,
  ConciergeBell,
  Euro,
  ArrowRight,
  Check,
  Car,
  Coffee,
  Clock3,
  Sparkles,
} from "lucide-react";
import { AdminShell, type AdminModule } from "@/components/admin-shell";
import { ActivityFeed } from "@/components/activity-feed";
import { DemoLink } from "@/components/demo-link";
import { KpiCard } from "@/components/ui/kpi-card";
import { Card, CardHeader, Button } from "@/components/ui/primitives";
import { StatusBadge, serviceTone, roomTone, hotelReservationTone } from "@/components/ui/status-badge";
import { RelativeTime } from "@/components/relative-time";
import { useDemoStore } from "@/lib/store";
import { SERVICE_KIND_LABEL, SERVICE_STATUS_LABEL, HOTEL_RESERVATION_STATUS_LABEL } from "@/lib/verticals";
import type { HotelRoom, RoomStatus, ServiceKind, ServiceStatus } from "@/lib/types";
import { cn, shortDate } from "@/lib/utils";

const MODULES: AdminModule[] = [
  { key: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { key: "planning", label: "Planning chambres", icon: LayoutGrid },
  { key: "reservations", label: "Réservations", icon: BedDouble },
  { key: "conciergerie", label: "Conciergerie", icon: BellRing },
  { key: "tarifs", label: "Tarifs & dispo", icon: Tags },
];

const SERVICE_ICON: Record<ServiceKind, typeof Coffee> = {
  room_service: Coffee,
  late_checkout: Clock3,
  taxi: Car,
  menage: Sparkles,
  spa: Sparkles,
};
const NEXT_SVC: Partial<Record<ServiceStatus, ServiceStatus>> = { nouvelle: "en_cours", en_cours: "traitee" };
const ROOM_CYCLE: Record<RoomStatus, RoomStatus> = { libre: "occupee", occupee: "menage", menage: "libre" };
const ROOM_LABEL: Record<RoomStatus, string> = { libre: "Libre", occupee: "Occupée", menage: "Ménage" };

export function HotelAdmin({ standalone = false }: { standalone?: boolean }) {
  const [module, setModule] = useState("dashboard");
  const titles: Record<string, string> = {
    dashboard: "Tableau de bord",
    planning: "Planning des chambres",
    reservations: "Réservations",
    conciergerie: "Conciergerie & services",
    tarifs: "Tarifs & disponibilités",
  };
  return (
    <AdminShell vertical="hotel" modules={MODULES} active={module} onSelect={setModule} title={titles[module]} subtitle="Hôtel Lumen · réception" standalone={standalone}>
      {module === "dashboard" && <Dashboard onGo={setModule} />}
      {module === "planning" && <Planning />}
      {module === "reservations" && <Reservations />}
      {module === "conciergerie" && <Conciergerie />}
      {module === "tarifs" && <Tarifs />}
    </AdminShell>
  );
}

/* ── Dashboard ───────────────────────────────────────────────────────────── */
function Dashboard({ onGo }: { onGo: (m: string) => void }) {
  const rooms = useDemoStore((s) => s.rooms);
  const services = useDemoStore((s) => s.serviceRequests);
  const reservations = useDemoStore((s) => s.reservations);
  const occupied = rooms.filter((r) => r.status === "occupee").length;
  const occRate = Math.round((occupied / rooms.length) * 100);
  const pending = services.filter((s) => s.status !== "traitee").length;
  const arrivals = reservations.filter((r) => r.status === "confirmee").length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <KpiCard label="Taux d'occupation" value={occRate} suffix=" %" delta={5} icon={Percent} spark={[62, 68, 71, 74, 78, occRate]} accentClass="text-teal-300" />
        <KpiCard label="Arrivées du jour" value={arrivals} icon={LogIn} delta={12} spark={[3, 4, 5, 4, 6, arrivals]} accentClass="text-cyan-300" />
        <KpiCard label="Demandes de service" value={pending} icon={ConciergeBell} delta={-8} spark={[5, 4, 6, 3, 4, pending]} accentClass="text-coral-soft" />
        <KpiCard label="RevPAR" value={118} suffix=" €" decimals={0} delta={7} icon={Euro} spark={[96, 102, 108, 112, 115, 118]} accentClass="text-lime" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Arrivées & départs" subtitle="Aujourd'hui" icon={<BedDouble className="h-4 w-4" />} action={<button onClick={() => onGo("reservations")} className="text-xs text-teal-300 hover:underline">Réservations</button>} />
          <div className="divide-y divide-white/5">
            {reservations.slice(0, 4).map((r) => (
              <div key={r.id} className="flex items-center gap-3 px-4 py-2.5">
                <span className={cn("flex h-7 w-7 items-center justify-center rounded-lg", r.status === "confirmee" ? "bg-cyan-500/15 text-cyan-300" : "bg-white/8 text-white/50")}>
                  {r.status === "partie" ? <LogOut className="h-3.5 w-3.5" /> : <LogIn className="h-3.5 w-3.5" />}
                </span>
                <div className="min-w-0 flex-1"><p className="truncate text-sm text-white/80">{r.guest}</p><p className="text-xs text-white/40">Ch. {r.room} · {r.ref}</p></div>
                {r.checkedInOnline && <StatusBadge tone="success">Check-in en ligne</StatusBadge>}
              </div>
            ))}
          </div>
        </Card>
        <ActivityFeed vertical="hotel" />
      </div>
    </div>
  );
}

/* ── Planning ───────────────────────────────────────────────────────────── */
function Planning() {
  const rooms = useDemoStore((s) => s.rooms);
  const setRoomStatus = useDemoStore((s) => s.setRoomStatus);
  const counts = {
    libre: rooms.filter((r) => r.status === "libre").length,
    occupee: rooms.filter((r) => r.status === "occupee").length,
    menage: rooms.filter((r) => r.status === "menage").length,
  };
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {(["libre", "occupee", "menage"] as RoomStatus[]).map((s) => (
          <span key={s} className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-xs text-white/70">
            <span className={cn("h-2.5 w-2.5 rounded-full", s === "libre" ? "bg-lime" : s === "occupee" ? "bg-sky-400" : "bg-amber-400")} />
            {ROOM_LABEL[s]} · {counts[s]}
          </span>
        ))}
        <span className="ml-auto self-center text-xs text-white/40">Cliquez une chambre pour changer son statut</span>
      </div>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-4">
        {rooms.map((r) => (
          <RoomCard key={r.id} room={r} onClick={() => setRoomStatus(r.id, ROOM_CYCLE[r.status])} />
        ))}
      </div>
    </div>
  );
}

function RoomCard({ room, onClick }: { room: HotelRoom; onClick: () => void }) {
  const ring = room.status === "libre" ? "border-lime/30" : room.status === "occupee" ? "border-sky-400/30" : "border-amber-400/30";
  return (
    <button onClick={onClick} className={cn("rounded-2xl border bg-white/[0.03] p-3 text-left transition hover:bg-white/[0.06]", ring)}>
      <div className="flex items-center justify-between">
        <span className="font-display text-lg font-bold text-white">{room.number}</span>
        <StatusBadge tone={roomTone[room.status]} dot>{ROOM_LABEL[room.status]}</StatusBadge>
      </div>
      <p className="mt-1 text-xs text-white/50">{room.type}</p>
      <p className="mt-0.5 h-4 truncate text-xs text-white/35">{room.guest ?? "—"}</p>
    </button>
  );
}

/* ── Réservations (valider / refuser, puis check-in / out) ──────────────── */
function Reservations() {
  const reservations = useDemoStore((s) => s.reservations);
  const setStatus = useDemoStore((s) => s.setReservationStatus);
  const checkIn = useDemoStore((s) => s.checkInOnline);
  const checkOut = useDemoStore((s) => s.checkOut);
  return (
    <Card className="overflow-hidden">
      <CardHeader title="Réservations" subtitle="Validez les demandes · check-in / check-out" icon={<BedDouble className="h-4 w-4" />} />
      <div className="divide-y divide-white/5">
        {reservations.map((r) => (
          <div key={r.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-white">{r.guest}</p>
              <p className="text-xs text-white/45">{r.ref} · Ch. {r.room} · {shortDate(r.checkIn)} → {shortDate(r.checkOut)}</p>
            </div>
            <StatusBadge tone={hotelReservationTone[r.status]} dot>{HOTEL_RESERVATION_STATUS_LABEL[r.status]}</StatusBadge>
            {r.status === "demande" ? (
              <div className="flex gap-1.5">
                <Button size="sm" variant="soft" onClick={() => setStatus(r.id, "refusee")}>Refuser</Button>
                <Button size="sm" onClick={() => setStatus(r.id, "confirmee")}>Valider</Button>
              </div>
            ) : r.status === "confirmee" ? (
              <Button size="sm" variant="soft" onClick={() => checkIn(r.id)}>Check-in <ArrowRight className="h-3.5 w-3.5" /></Button>
            ) : r.status === "arrivee" ? (
              <Button size="sm" variant="soft" onClick={() => checkOut(r.id)}>Check-out</Button>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs text-white/40"><Check className="h-3.5 w-3.5" /> Clôturée</span>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ── Conciergerie (module connecté) ─────────────────────────────────────── */
function Conciergerie() {
  const services = useDemoStore((s) => s.serviceRequests);
  const setStatus = useDemoStore((s) => s.setServiceStatus);
  return (
    <Card className="overflow-hidden">
      <CardHeader title="Demandes voyageurs" subtitle="Room service · late check-out · taxi…" icon={<BellRing className="h-4 w-4" />} />
      <div className="divide-y divide-white/5">
        {services.map((sv) => {
          const Icon = SERVICE_ICON[sv.kind];
          const next = NEXT_SVC[sv.status];
          return (
            <div key={sv.id} className="flex items-center gap-3 px-4 py-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-500/15 text-teal-300"><Icon className="h-4 w-4" /></span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{SERVICE_KIND_LABEL[sv.kind]} — Ch. {sv.room}</p>
                <p className="truncate text-xs text-white/45">{sv.note} · {sv.guest} · <RelativeTime iso={sv.createdAt} /></p>
              </div>
              <StatusBadge tone={serviceTone[sv.status]} dot>{SERVICE_STATUS_LABEL[sv.status]}</StatusBadge>
              {next && (
                <Button size="sm" variant={sv.status === "nouvelle" ? "soft" : "solid"} onClick={() => setStatus(sv.id, next)}>
                  {sv.status === "nouvelle" ? "Prendre" : "Terminer"} <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          );
        })}
        {services.length === 0 && <p className="px-4 py-6 text-sm text-white/45">Aucune demande. Envoyez-en une depuis l'app voyageur 📱</p>}
      </div>
    </Card>
  );
}

/* ── Tarifs ─────────────────────────────────────────────────────────────── */
function Tarifs() {
  const rows = [
    { type: "Classique", base: 89, we: 109, dispo: 4 },
    { type: "Supérieure", base: 129, we: 159, dispo: 2 },
    { type: "Suite Lumen", base: 189, we: 229, dispo: 3 },
    { type: "Suite Panorama", base: 259, we: 309, dispo: 1 },
  ];
  return (
    <Card className="overflow-hidden">
      <CardHeader title="Grille tarifaire" subtitle="Tarifs indicatifs (mock)" icon={<Tags className="h-4 w-4" />} action={<DemoLink feature="Yield management / tarifs dynamiques" className="text-xs text-teal-300 hover:underline">Tarifs dynamiques</DemoLink>} />
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-white/8 text-left text-xs text-white/45">
            <th className="px-4 py-2 font-medium">Type</th><th className="px-4 py-2 font-medium">Semaine</th><th className="px-4 py-2 font-medium">Week-end</th><th className="px-4 py-2 text-right font-medium">Dispo.</th>
          </tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.type} className="border-b border-white/5">
                <td className="px-4 py-2.5 font-medium text-white">{r.type}</td>
                <td className="px-4 py-2.5 text-white/70">{r.base} €</td>
                <td className="px-4 py-2.5 text-white/70">{r.we} €</td>
                <td className="px-4 py-2.5 text-right"><StatusBadge tone={r.dispo > 1 ? "success" : "warn"}>{r.dispo}</StatusBadge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
