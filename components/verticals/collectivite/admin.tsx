"use client";

import { useMemo, useState } from "react";
import {
  LayoutDashboard,
  TriangleAlert,
  CalendarCheck,
  FileText,
  Accessibility,
  Newspaper,
  MapPin,
  Clock,
  ShieldCheck,
  Users,
  ArrowRight,
  Check,
  Cog,
  Sparkles,
  Trash2,
  Truck,
  BarChart3,
  ShieldAlert,
  ThumbsUp,
  Camera,
  Recycle,
  Ban,
} from "lucide-react";
import { AdminShell, type AdminModule } from "@/components/admin-shell";
import { ActivityFeed } from "@/components/activity-feed";
import { Thumb } from "@/components/asset-image";
import { DemoLink } from "@/components/demo-link";
import { Modal } from "@/components/modal";
import { KpiCard } from "@/components/ui/kpi-card";
import { Card, CardHeader, Button } from "@/components/ui/primitives";
import { DataTable, type Column } from "@/components/ui/data-table";
import { StatusBadge, reportTone, reservationTone, wastePriorityTone, wasteTone } from "@/components/ui/status-badge";
import { RelativeTime } from "@/components/relative-time";
import { useDemoStore } from "@/lib/store";
import {
  REPORT_STATUS_LABEL,
  RESERVATION_STATUS_LABEL,
  WASTE_FILIERE_LABEL,
  WASTE_KIND_EMOJI,
  WASTE_KIND_LABEL,
  WASTE_PRIORITY_LABEL,
  WASTE_STATUS_LABEL,
} from "@/lib/verticals";
import { EQUIPMENT_BY_KIND, WASTE_BLACKSPOTS, WASTE_WEEKLY_TREND } from "@/lib/mocks";
import { RealMap, xyToLatLng, type MapCircle, type MapPoint } from "@/components/real-map";
import type { Report, ReportStatus, WasteFiliere, WastePriority, WasteReport } from "@/lib/types";
import { cn, shortDate } from "@/lib/utils";

const MODULES: AdminModule[] = [
  { key: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { key: "proprete", label: "Propreté & déchets", icon: Trash2 },
  { key: "signalements", label: "Signalements", icon: TriangleAlert },
  { key: "reservations", label: "Réservations", icon: CalendarCheck },
  { key: "demarches", label: "Démarches", icon: FileText },
  { key: "conformite", label: "Conformité", icon: Accessibility },
  { key: "contenu", label: "Actualités", icon: Newspaper },
];

/** Équipes / tournées disponibles pour l'assignation des interventions propreté. */
const WASTE_TEAMS = ["Tournée propreté A", "Tournée propreté B", "Régie propreté"];

const CATEGORY_LABEL: Record<string, string> = {
  voirie: "Voirie",
  eclairage: "Éclairage",
  proprete: "Propreté",
  espaces_verts: "Espaces verts",
};
const CATEGORY_COLOR: Record<string, string> = {
  voirie: "bg-amber-400",
  eclairage: "bg-sky-400",
  proprete: "bg-coral",
  espaces_verts: "bg-lime",
};
/* Couleurs hex (pastilles Leaflet — pas de classes Tailwind dans les divIcon) */
const CATEGORY_HEX: Record<string, string> = {
  voirie: "#fbbf24",
  eclairage: "#38bdf8",
  proprete: "#ff7a59",
  espaces_verts: "#c5f277",
};
const WASTE_KIND_HEX: Record<WasteReport["kind"], string> = {
  poubelle_pleine: "#38bdf8",
  depot_sauvage: "#ff7a59",
  bris_verre: "#fbbf24",
  encombrants: "#a78bfa",
  autre_proprete: "#c5f277",
};
const NEXT_STATUS: Partial<Record<ReportStatus, ReportStatus>> = {
  nouveau: "recu",
  recu: "en_cours",
  en_cours: "resolu",
};

export function CollectiviteAdmin({ standalone = false }: { standalone?: boolean }) {
  const [module, setModule] = useState("dashboard");
  const titleMap: Record<string, string> = {
    dashboard: "Tableau de bord",
    proprete: "Propreté & déchets",
    signalements: "Signalements citoyens",
    reservations: "Réservations municipales",
    demarches: "Démarches en ligne",
    conformite: "Conformité & accessibilité",
    contenu: "Actualités & agenda",
  };

  return (
    <AdminShell
      vertical="collectivite"
      modules={MODULES}
      active={module}
      onSelect={setModule}
      title={titleMap[module]}
      subtitle="Ville de Néauville · console interne"
      standalone={standalone}
    >
      {module === "dashboard" && <Dashboard onGo={setModule} />}
      {module === "proprete" && <Proprete />}
      {module === "signalements" && <Signalements />}
      {module === "reservations" && <Reservations />}
      {module === "demarches" && <Demarches />}
      {module === "conformite" && <Conformite />}
      {module === "contenu" && <Contenu />}
    </AdminShell>
  );
}

/* ── Dashboard ───────────────────────────────────────────────────────────── */
function Dashboard({ onGo }: { onGo: (m: string) => void }) {
  const reports = useDemoStore((s) => s.reports);
  const wasteReports = useDemoStore((s) => s.wasteReports);
  const procedures = useDemoStore((s) => s.procedures);
  const openWaste = wasteReports.filter((w) => w.moderation === "validee" && w.status !== "resolu").length;
  const open = reports.filter((r) => r.status !== "resolu").length + openWaste;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <KpiCard label="Demandes en cours" value={open} delta={8} icon={TriangleAlert} spark={[4, 6, 5, 8, 7, 9, open]} accentClass="text-indigo-300" />
        <KpiCard label="Délai moyen (jours)" value={2.4} decimals={1} delta={-12} icon={Clock} spark={[3.2, 3, 2.8, 2.6, 2.5, 2.4]} accentClass="text-sky-300" />
        <KpiCard label="Conformité site" value={92} suffix=" %" delta={3} icon={ShieldCheck} spark={[84, 86, 88, 90, 91, 92]} accentClass="text-lime" />
        <KpiCard label="Démarches en ligne / sem." value={318} delta={21} icon={Users} spark={[180, 210, 240, 260, 290, 318]} accentClass="text-cyan-300" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Cartographie de la ville"
            subtitle={`${reports.length + wasteReports.filter((w) => w.moderation === "validee").length} signalements · ${WASTE_BLACKSPOTS.length} points noirs`}
            icon={<MapPin className="h-4 w-4" />}
            action={<button onClick={() => onGo("proprete")} className="text-xs text-sky-300 hover:underline">Module propreté</button>}
          />
          <div className="p-3">
            <CityMap reports={reports} wasteReports={wasteReports} />
            <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5">
              {Object.entries(CATEGORY_LABEL).map(([k, label]) => (
                <span key={k} className="flex items-center gap-1.5 text-xs text-white/55">
                  <span className={cn("h-2.5 w-2.5 rounded-full", CATEGORY_COLOR[k])} /> {label}
                </span>
              ))}
              {(Object.keys(WASTE_KIND_LABEL) as WasteReport["kind"][]).slice(0, 3).map((k) => (
                <span key={k} className="flex items-center gap-1.5 text-xs text-white/55">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: WASTE_KIND_HEX[k] }} /> {WASTE_KIND_LABEL[k]}
                </span>
              ))}
              <span className="flex items-center gap-1.5 text-xs text-white/55">
                <span className="h-2.5 w-2.5 rounded-full border border-coral bg-coral/25" /> Point noir
              </span>
            </div>
          </div>
        </Card>

        <ActivityFeed vertical="collectivite" />
      </div>

      <Card>
        <CardHeader title="Dernières demandes" subtitle="Propreté, signalements & démarches récents" icon={<FileText className="h-4 w-4" />} action={<button onClick={() => onGo("proprete")} className="text-xs text-sky-300 hover:underline">Module propreté</button>} />
        <div className="divide-y divide-white/5">
          {wasteReports.filter((w) => w.moderation === "validee").slice(0, 2).map((w) => (
            <div key={w.id} className="flex items-center gap-3 px-4 py-2.5">
              <span className="text-sm leading-none">{WASTE_KIND_EMOJI[w.kind]}</span>
              <span className="min-w-0 flex-1 truncate text-sm text-white/80">{w.title}</span>
              <StatusBadge tone={wasteTone[w.status]}>{WASTE_STATUS_LABEL[w.status]}</StatusBadge>
              <RelativeTime iso={w.createdAt} className="hidden w-20 shrink-0 text-right text-[11px] text-white/35 sm:block" />
            </div>
          ))}
          {reports.slice(0, 3).map((r) => (
            <div key={r.id} className="flex items-center gap-3 px-4 py-2.5">
              <span className={cn("h-2 w-2 rounded-full", CATEGORY_COLOR[r.category])} />
              <span className="min-w-0 flex-1 truncate text-sm text-white/80">{r.title}</span>
              <StatusBadge tone={reportTone[r.status]}>{REPORT_STATUS_LABEL[r.status]}</StatusBadge>
              <RelativeTime iso={r.createdAt} className="hidden w-20 shrink-0 text-right text-[11px] text-white/35 sm:block" />
            </div>
          ))}
          {procedures.slice(0, 2).map((p) => (
            <div key={p.id} className="flex items-center gap-3 px-4 py-2.5">
              <span className="h-2 w-2 rounded-full bg-indigo-400" />
              <span className="min-w-0 flex-1 truncate text-sm text-white/80">{p.type} — {p.citizen}</span>
              <StatusBadge tone="info">{p.ref}</StatusBadge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/** Cartographie réelle (OSM) : signalements classiques + propreté + points noirs. */
function CityMap({ reports, wasteReports, className }: { reports: Report[]; wasteReports: WasteReport[]; className?: string }) {
  const points: MapPoint[] = [
    ...reports.map((r) => ({
      id: r.id,
      ...xyToLatLng(r.x, r.y),
      color: CATEGORY_HEX[r.category],
      title: `${r.title} — ${CATEGORY_LABEL[r.category]}`,
      pulse: r.status === "nouveau",
    })),
    ...wasteReports
      .filter((w) => w.moderation === "validee")
      .map((w) => ({
        id: w.id,
        ...xyToLatLng(w.x, w.y),
        color: WASTE_KIND_HEX[w.kind],
        title: `${w.title} — ${WASTE_KIND_LABEL[w.kind]}`,
        pulse: w.status === "nouveau",
      })),
  ];
  const circles: MapCircle[] = WASTE_BLACKSPOTS.map((b) => ({
    id: b.place,
    ...xyToLatLng(b.x, b.y),
    color: "#ff7a59",
    radiusM: 90,
    title: `Point noir : ${b.place} · ${b.count90d} signalements / 90 j`,
  }));
  return (
    <RealMap
      points={points}
      circles={circles}
      className={className ?? "h-56 overflow-hidden rounded-xl border border-white/10"}
    />
  );
}

/* ── Signalements (module connecté) ─────────────────────────────────────── */
function Signalements() {
  const reports = useDemoStore((s) => s.reports);
  const setStatus = useDemoStore((s) => s.setReportStatus);
  const assign = useDemoStore((s) => s.assignReport);
  const [cat, setCat] = useState<string>("tous");

  const filtered = useMemo(() => (cat === "tous" ? reports : reports.filter((r) => r.category === cat)), [reports, cat]);

  const columns: Column<Report>[] = [
    {
      key: "title",
      header: "Signalement",
      sortValue: (r) => r.title,
      render: (r) => (
        <div className="flex items-center gap-2">
          <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", CATEGORY_COLOR[r.category])} />
          <div className="min-w-0">
            <p className="truncate font-medium text-white">{r.title}</p>
            <p className="truncate text-xs text-white/45">{r.ref} · {r.address}</p>
          </div>
        </div>
      ),
    },
    { key: "citizen", header: "Citoyen", sortValue: (r) => r.citizen, render: (r) => <span className="text-white/70">{r.citizen}</span>, className: "hidden md:table-cell" },
    { key: "createdAt", header: "Reçu", sortValue: (r) => r.createdAt, render: (r) => <RelativeTime iso={r.createdAt} className="text-white/50" />, className: "hidden sm:table-cell" },
    { key: "status", header: "Statut", sortValue: (r) => r.status, render: (r) => <StatusBadge tone={reportTone[r.status]} dot>{REPORT_STATUS_LABEL[r.status]}</StatusBadge> },
    {
      key: "action",
      header: "Action",
      align: "right",
      render: (r) => {
        const next = NEXT_STATUS[r.status];
        return next ? (
          <Button size="sm" variant="soft" onClick={() => setStatus(r.id, next)}>
            {REPORT_STATUS_LABEL[next]} <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs text-lime"><Check className="h-3.5 w-3.5" /> Clôturé</span>
        );
      },
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {["tous", ...Object.keys(CATEGORY_LABEL)].map((k) => (
          <button
            key={k}
            onClick={() => setCat(k)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium transition",
              cat === k ? "bg-indigo-500/20 text-indigo-200 ring-1 ring-indigo-400/40" : "bg-white/5 text-white/55 hover:text-white",
            )}
          >
            {k === "tous" ? "Tous" : CATEGORY_LABEL[k]}
          </button>
        ))}
        <span className="ml-auto rounded-lg bg-white/5 px-2.5 py-1 text-xs text-white/45">
          Assignation rapide ci-dessous
        </span>
      </div>

      <Card className="overflow-hidden">
        <DataTable
          data={filtered}
          columns={columns}
          search={(r) => `${r.title} ${r.ref} ${r.address} ${r.citizen}`}
          emptyTitle="Aucun signalement"
        />
      </Card>

      <Card>
        <CardHeader title="Assignation à un service" subtitle="Démonstration : déclenche un statut « Reçu »" icon={<Cog className="h-4 w-4" />} />
        <div className="flex flex-wrap gap-2 p-4">
          {reports.filter((r) => r.status === "nouveau").slice(0, 3).map((r) => (
            <div key={r.id} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              <span className="text-sm text-white/80">{r.ref}</span>
              <select
                onChange={(e) => e.target.value && assign(r.id, e.target.value)}
                defaultValue=""
                aria-label={`Assigner ${r.ref}`}
                className="rounded-lg border border-white/12 bg-navy-900 px-2 py-1 text-xs text-white focus:outline-none"
              >
                <option value="" disabled>Assigner à…</option>
                <option>Services techniques</option>
                <option>Propreté urbaine</option>
                <option>Espaces verts</option>
                <option>Éclairage public</option>
              </select>
            </div>
          ))}
          {reports.filter((r) => r.status === "nouveau").length === 0 && (
            <p className="text-sm text-white/45">Aucun nouveau signalement à assigner. Créez-en un depuis l'app mobile 📱</p>
          )}
        </div>
      </Card>
    </div>
  );
}

/* ── Propreté & déchets (module connecté, qualification humaine) ─────────── */
const PRIORITY_RANK: Record<WastePriority, number> = { urgente: 0, moyenne: 1, faible: 2 };
/** Priorité conseillée selon le type — simple aide visuelle, l'agent décide. */
const SUGGESTED_PRIORITY: Record<WasteReport["kind"], WastePriority> = {
  bris_verre: "urgente",
  depot_sauvage: "moyenne",
  poubelle_pleine: "faible",
  encombrants: "faible",
  autre_proprete: "faible",
};
const WASTE_KIND_COLOR: Record<WasteReport["kind"], string> = {
  poubelle_pleine: "bg-sky-400",
  depot_sauvage: "bg-coral",
  bris_verre: "bg-amber-400",
  encombrants: "bg-violet-400",
  autre_proprete: "bg-lime",
};

function Proprete() {
  const [pane, setPane] = useState<"file" | "terrain" | "stats" | "rgpd">("file");
  const pending = useDemoStore((s) => s.wasteReports.filter((w) => w.moderation === "en_attente").length);

  const PANES = [
    { key: "file", label: "File de traitement", icon: Trash2 },
    { key: "terrain", label: "Vue agent terrain", icon: Truck },
    { key: "stats", label: "Stats & points noirs", icon: BarChart3 },
    { key: "rgpd", label: `Modération & RGPD${pending ? ` (${pending})` : ""}`, icon: ShieldAlert },
  ] as const;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {PANES.map((p) => (
          <button
            key={p.key}
            onClick={() => setPane(p.key)}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition",
              pane === p.key ? "bg-indigo-500/20 text-indigo-200 ring-1 ring-indigo-400/40" : "bg-white/5 text-white/55 hover:text-white",
            )}
          >
            <p.icon className="h-3.5 w-3.5" /> {p.label}
          </button>
        ))}
      </div>
      {pane === "file" && <WasteQueue />}
      {pane === "terrain" && <WasteTerrain />}
      {pane === "stats" && <WasteStats />}
      {pane === "rgpd" && <WasteModeration />}
    </div>
  );
}

/* File de traitement : l'œil humain qualifie, assigne et fait avancer */
function WasteQueue() {
  const wasteReports = useDemoStore((s) => s.wasteReports);
  const qualify = useDemoStore((s) => s.qualifyWasteReport);
  const assign = useDemoStore((s) => s.assignWasteAgent);
  const setStatus = useDemoStore((s) => s.setWasteStatus);
  const close = useDemoStore((s) => s.closeWasteReport);
  const redirect = useDemoStore((s) => s.redirectWasteFiliere);

  const queue = useMemo(
    () =>
      wasteReports
        .filter((w) => w.moderation === "validee")
        .slice()
        .sort((a, b) => {
          if ((a.status === "nouveau") !== (b.status === "nouveau")) return a.status === "nouveau" ? -1 : 1;
          const ra = a.priority ? PRIORITY_RANK[a.priority] : 3;
          const rb = b.priority ? PRIORITY_RANK[b.priority] : 3;
          if (ra !== rb) return ra - rb;
          return b.createdAt.localeCompare(a.createdAt);
        }),
    [wasteReports],
  );

  const columns: Column<WasteReport>[] = [
    {
      key: "title",
      header: "Signalement",
      sortValue: (w) => w.title,
      render: (w) => (
        <div className="flex items-center gap-2.5">
          <span className="text-base leading-none">{WASTE_KIND_EMOJI[w.kind]}</span>
          <div className="min-w-0">
            <p className="truncate font-medium text-white">
              {w.title}
              {w.confirmations > 0 && (
                <span className="ml-1.5 inline-flex items-center gap-0.5 rounded-full bg-indigo-500/20 px-1.5 py-0.5 align-middle text-[10px] font-semibold text-indigo-200">
                  <ThumbsUp className="h-2.5 w-2.5" /> +{w.confirmations}
                </span>
              )}
            </p>
            <p className="truncate text-xs text-white/45">
              {w.ref} · {w.address} · {w.anonymous ? "anonyme" : w.citizen}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "priority",
      header: "Priorité",
      sortValue: (w) => (w.priority ? PRIORITY_RANK[w.priority] : 3),
      render: (w) =>
        w.priority ? (
          <StatusBadge tone={wastePriorityTone[w.priority]} dot>{WASTE_PRIORITY_LABEL[w.priority]}</StatusBadge>
        ) : (
          <select
            onChange={(e) => e.target.value && qualify(w.id, e.target.value as WastePriority)}
            defaultValue=""
            aria-label={`Qualifier la priorité de ${w.ref}`}
            className="rounded-lg border border-amber-400/40 bg-navy-900 px-2 py-1 text-xs text-amber-200 focus:outline-none"
          >
            <option value="" disabled>👁️ Qualifier…</option>
            {(Object.keys(WASTE_PRIORITY_LABEL) as WastePriority[]).map((p) => (
              <option key={p} value={p}>
                {WASTE_PRIORITY_LABEL[p]}{SUGGESTED_PRIORITY[w.kind] === p ? " · conseillé" : ""}
              </option>
            ))}
          </select>
        ),
    },
    { key: "createdAt", header: "Reçu", sortValue: (w) => w.createdAt, render: (w) => <RelativeTime iso={w.createdAt} className="text-white/50" />, className: "hidden md:table-cell" },
    { key: "status", header: "Statut", sortValue: (w) => w.status, render: (w) => <StatusBadge tone={wasteTone[w.status]} dot>{WASTE_STATUS_LABEL[w.status]}</StatusBadge> },
    {
      key: "action",
      header: "Action",
      align: "right",
      render: (w) => {
        if (w.status === "resolu") return <span className="inline-flex items-center gap-1 text-xs text-lime"><Check className="h-3.5 w-3.5" /> Clôturé</span>;
        if (w.status === "nouveau") return <span className="text-xs text-white/35">Qualifier d'abord</span>;
        if (w.status === "qualifie")
          return (
            <select
              onChange={(e) => e.target.value && assign(w.id, e.target.value)}
              defaultValue=""
              aria-label={`Assigner ${w.ref}`}
              className="rounded-lg border border-white/12 bg-navy-900 px-2 py-1 text-xs text-white focus:outline-none"
            >
              <option value="" disabled>Assigner à…</option>
              {WASTE_TEAMS.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          );
        if (w.status === "planifie")
          return (
            <Button size="sm" variant="soft" onClick={() => setStatus(w.id, "en_cours")}>
              Démarrer <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          );
        return (
          <Button size="sm" variant="soft" onClick={() => close(w.id)}>
            <Camera className="h-3.5 w-3.5" /> Clôturer
          </Button>
        );
      },
    },
  ];

  const valorisables = queue.filter((w) => (w.kind === "encombrants" || w.kind === "depot_sauvage") && w.status !== "resolu");

  return (
    <div className="space-y-3">
      <Card className="overflow-hidden">
        <DataTable
          data={queue}
          columns={columns}
          search={(w) => `${w.title} ${w.ref} ${w.address} ${w.citizen ?? ""} ${WASTE_KIND_LABEL[w.kind]}`}
          emptyTitle="Aucun signalement propreté"
        />
      </Card>

      <Card>
        <CardHeader title="Filière de valorisation" subtitle="Détourner de la décharge quand c'est possible" icon={<Recycle className="h-4 w-4" />} />
        <div className="flex flex-wrap gap-2 p-4">
          {valorisables.slice(0, 3).map((w) => (
            <div key={w.id} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              <span>{WASTE_KIND_EMOJI[w.kind]}</span>
              <span className="text-sm text-white/80">{w.ref}</span>
              {w.filiere ? (
                <StatusBadge tone={w.filiere === "collecte" ? "neutral" : "success"}>{WASTE_FILIERE_LABEL[w.filiere]}</StatusBadge>
              ) : (
                <select
                  onChange={(e) => e.target.value && redirect(w.id, e.target.value as WasteFiliere)}
                  defaultValue=""
                  aria-label={`Orienter ${w.ref} vers une filière`}
                  className="rounded-lg border border-white/12 bg-navy-900 px-2 py-1 text-xs text-white focus:outline-none"
                >
                  <option value="" disabled>Orienter vers…</option>
                  {(Object.keys(WASTE_FILIERE_LABEL) as WasteFiliere[]).map((f) => (
                    <option key={f} value={f}>{WASTE_FILIERE_LABEL[f]}</option>
                  ))}
                </select>
              )}
            </div>
          ))}
          {valorisables.length === 0 && <p className="text-sm text-white/45">Rien à orienter pour le moment.</p>}
        </div>
      </Card>
    </div>
  );
}

/* Vue agent terrain : la tournée du jour sur le smartphone de l'agent */
function WasteTerrain() {
  const wasteReports = useDemoStore((s) => s.wasteReports);
  const toggleEquipment = useDemoStore((s) => s.toggleWasteEquipment);
  const setStatus = useDemoStore((s) => s.setWasteStatus);
  const close = useDemoStore((s) => s.closeWasteReport);

  const tour = wasteReports
    .filter((w) => w.assignedTo && (w.status === "planifie" || w.status === "en_cours"))
    .slice()
    .sort((a, b) => (a.tourOrder ?? 99) - (b.tourOrder ?? 99));
  const lastDone = wasteReports.find((w) => w.status === "resolu" && w.photoAfter);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader title="Tournée du jour" subtitle="Ce que voit l'agent sur son smartphone" icon={<Truck className="h-4 w-4" />} />
        <div className="space-y-3 p-4">
          {tour.length === 0 && <p className="text-sm text-white/45">Aucune intervention planifiée. Assignez un signalement depuis la file de traitement.</p>}
          {tour.map((w, i) => {
            const universe = Array.from(new Set([...EQUIPMENT_BY_KIND[w.kind], ...w.equipment]));
            return (
              <div key={w.id} className="rounded-2xl border border-white/10 bg-white/5 p-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-500/25 text-sm font-bold text-indigo-200">{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">{WASTE_KIND_EMOJI[w.kind]} {w.title}</p>
                    <p className="truncate text-xs text-white/45">
                      <MapPin className="mr-0.5 inline h-3 w-3" />
                      {w.address}{w.distanceM ? ` · ${w.distanceM} m` : ""} · {w.assignedTo}
                    </p>
                  </div>
                  {w.priority && <StatusBadge tone={wastePriorityTone[w.priority]} dot>{WASTE_PRIORITY_LABEL[w.priority]}</StatusBadge>}
                </div>

                <p className="mb-1.5 mt-3 text-[11px] font-semibold uppercase tracking-wide text-white/35">Matériel à emporter</p>
                <div className="flex flex-wrap gap-1.5">
                  {universe.map((item) => {
                    const on = w.equipment.includes(item);
                    return (
                      <button
                        key={item}
                        onClick={() => toggleEquipment(w.id, item)}
                        className={cn(
                          "flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition",
                          on ? "bg-lime/15 text-lime ring-1 ring-lime/30" : "bg-white/5 text-white/40 ring-1 ring-white/10",
                        )}
                      >
                        {on && <Check className="h-3 w-3" />} {item}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3 flex gap-2">
                  {w.status === "planifie" ? (
                    <Button size="sm" variant="soft" onClick={() => setStatus(w.id, "en_cours")} className="flex-1">
                      Démarrer l'intervention
                    </Button>
                  ) : (
                    <Button size="sm" onClick={() => close(w.id)} className="flex-1">
                      <Camera className="h-3.5 w-3.5" /> Clôturer avec photo du lieu propre
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <CardHeader title="Preuve avant / après" subtitle="La clôture joint une photo du lieu nettoyé" icon={<Camera className="h-4 w-4" />} />
        <div className="p-4">
          {lastDone ? (
            <>
              <p className="mb-2 text-sm text-white/70">{lastDone.ref} — {lastDone.title}</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="relative h-28 overflow-hidden rounded-xl border border-white/10">
                    <Thumb name="signalement-exemple" alt="Photo avant intervention" className="absolute inset-0" sizes="300px" />
                  </div>
                  <p className="mt-1 text-center text-[11px] text-white/40">Avant — photo du citoyen</p>
                </div>
                <div>
                  <div className="flex h-28 flex-col items-center justify-center gap-1 rounded-xl border border-lime/25 bg-gradient-to-br from-lime/15 to-emerald-500/10">
                    <Check className="h-6 w-6 text-lime" />
                    <p className="text-xs font-medium text-lime">Lieu nettoyé</p>
                    {lastDone.resolvedAt && <RelativeTime iso={lastDone.resolvedAt} className="text-[10px] text-white/40" />}
                  </div>
                  <p className="mt-1 text-center text-[11px] text-white/40">Après — photo de l'agent</p>
                </div>
              </div>
              <p className="mt-3 rounded-xl bg-white/5 px-3 py-2 text-xs leading-relaxed text-white/55">
                La photo « après » part automatiquement au citoyen avec la notification de clôture : transparence totale, zéro appel en mairie.
              </p>
            </>
          ) : (
            <p className="text-sm text-white/45">Clôturez une intervention pour voir la preuve avant / après.</p>
          )}
        </div>
      </Card>
    </div>
  );
}

/* Statistiques & points noirs : comptage lisible par un humain, pas de ML */
function WasteStats() {
  const wasteReports = useDemoStore((s) => s.wasteReports);
  const valid = wasteReports.filter((w) => w.moderation === "validee");
  const resolved = valid.filter((w) => w.status === "resolu").length;
  const diverted = valid.filter((w) => w.filiere === "ressourcerie" || w.filiere === "recyclage").length;
  const resolutionRate = valid.length ? Math.round((resolved / valid.length) * 100) : 0;
  const maxTrend = Math.max(...WASTE_WEEKLY_TREND);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <KpiCard label="Délai moyen d'enlèvement (h)" value={26} delta={-18} icon={Clock} spark={[48, 41, 38, 33, 29, 26]} accentClass="text-indigo-300" />
        <KpiCard label="Taux de résolution" value={resolutionRate} suffix=" %" delta={6} icon={Check} spark={[62, 68, 71, 75, 80, resolutionRate]} accentClass="text-lime" />
        <KpiCard label="Détournés de la décharge" value={12 + diverted} delta={24} icon={Recycle} spark={[4, 6, 7, 9, 11, 12 + diverted]} accentClass="text-cyan-300" />
        <KpiCard label="Signalements / semaine" value={WASTE_WEEKLY_TREND[WASTE_WEEKLY_TREND.length - 1]} delta={-14} icon={Trash2} spark={WASTE_WEEKLY_TREND} accentClass="text-sky-300" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Carte des points noirs" subtitle="≥ 3 signalements au même endroit sur 90 jours" icon={<MapPin className="h-4 w-4" />} />
          <div className="p-3">
            <RealMap
              className="h-48 overflow-hidden rounded-xl border border-white/10"
              points={valid.map((w) => ({
                id: w.id,
                ...xyToLatLng(w.x, w.y),
                color: WASTE_KIND_HEX[w.kind],
                title: `${w.title} — ${WASTE_KIND_LABEL[w.kind]}`,
                pulse: w.status === "nouveau",
              }))}
              circles={WASTE_BLACKSPOTS.map((b) => ({
                id: b.place,
                ...xyToLatLng(b.x, b.y),
                color: WASTE_KIND_HEX[b.mainKind],
                radiusM: 90,
                title: `${b.place} · ${b.count90d} signalements / 90 j — ${b.suggestion}`,
              }))}
            />
            <div className="mt-3 flex flex-wrap gap-3">
              {(Object.keys(WASTE_KIND_LABEL) as WasteReport["kind"][]).map((k) => (
                <span key={k} className="flex items-center gap-1.5 text-xs text-white/55">
                  <span className={cn("h-2.5 w-2.5 rounded-full", WASTE_KIND_COLOR[k])} /> {WASTE_KIND_LABEL[k]}
                </span>
              ))}
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Points noirs & suggestions" subtitle="Décisions d'équipement fondées sur le comptage" icon={<Sparkles className="h-4 w-4" />} />
            <div className="divide-y divide-white/5">
              {WASTE_BLACKSPOTS.map((b) => (
                <div key={b.place} className="flex items-start gap-3 px-4 py-3">
                  <span className="text-lg">{WASTE_KIND_EMOJI[b.mainKind]}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white">
                      {b.place} <span className="text-white/40">· {b.count90d} signalements / 90 j</span>
                    </p>
                    <p className="text-xs text-white/45">{b.context}</p>
                    <p className="mt-1 inline-flex rounded-full bg-indigo-500/15 px-2 py-0.5 text-[11px] font-medium text-indigo-200">💡 {b.suggestion}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Signalements par semaine" subtitle="8 dernières semaines — tendance à la baisse" icon={<BarChart3 className="h-4 w-4" />} />
            <div className="flex h-28 items-end gap-2 px-4 pb-4 pt-2">
              {WASTE_WEEKLY_TREND.map((v, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className={cn("w-full rounded-t-md", i === WASTE_WEEKLY_TREND.length - 1 ? "bg-indigo-400" : "bg-white/15")}
                    style={{ height: `${(v / maxTrend) * 100}%` }}
                  />
                  <span className="text-[10px] text-white/35">S-{WASTE_WEEKLY_TREND.length - 1 - i}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* Modération humaine & RGPD : photos vérifiées, anti-délation */
function WasteModeration() {
  const wasteReports = useDemoStore((s) => s.wasteReports);
  const moderate = useDemoStore((s) => s.moderateWasteReport);

  const pending = wasteReports.filter((w) => w.moderation === "en_attente");
  const rejected = wasteReports.filter((w) => w.moderation === "rejetee_hors_sujet" || w.moderation === "rejetee_delation");

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader title="Photos à vérifier" subtitle="Un agent valide avant publication — pas d'automatisme" icon={<ShieldCheck className="h-4 w-4" />} />
        <div className="space-y-3 p-4">
          {pending.length === 0 && <p className="text-sm text-white/45">File vide — toutes les photos ont été vérifiées. 👌</p>}
          {pending.map((w) => (
            <div key={w.id} className="rounded-2xl border border-white/10 bg-white/5 p-3.5">
              <div className="flex gap-3">
                <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl border border-white/10">
                  <Thumb name="signalement-exemple" alt={`Photo du signalement ${w.ref}`} className="absolute inset-0" sizes="200px" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">{WASTE_KIND_EMOJI[w.kind]} {w.title}</p>
                  <p className="truncate text-xs text-white/45">{w.ref} · {w.address}</p>
                  <RelativeTime iso={w.createdAt} className="text-[11px] text-white/35" />
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" onClick={() => moderate(w.id, "validee")}>
                  <Check className="h-3.5 w-3.5" /> Valider
                </Button>
                <Button size="sm" variant="soft" onClick={() => moderate(w.id, "rejetee_hors_sujet")}>
                  Hors sujet
                </Button>
                <Button size="sm" variant="soft" onClick={() => moderate(w.id, "rejetee_delation")}>
                  <Ban className="h-3.5 w-3.5" /> Personne visée
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader title="Rejets récents" subtitle="Motifs transparents, appris par l'usage" icon={<Ban className="h-4 w-4" />} />
          <div className="divide-y divide-white/5">
            {rejected.map((w) => (
              <div key={w.id} className="flex items-center gap-3 px-4 py-3">
                <Ban className="h-4 w-4 shrink-0 text-coral" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-white/80">{w.title}</p>
                  <p className="text-xs text-white/40">{w.ref}</p>
                </div>
                <StatusBadge tone={w.moderation === "rejetee_delation" ? "danger" : "warn"}>
                  {w.moderation === "rejetee_delation" ? "Anti-délation" : "Hors sujet"}
                </StatusBadge>
              </div>
            ))}
            {rejected.length === 0 && <p className="px-4 py-3 text-sm text-white/45">Aucun rejet récent.</p>}
          </div>
        </Card>

        <Card>
          <CardHeader title="Règles de gouvernance" subtitle="RGPD & respect des personnes" icon={<ShieldAlert className="h-4 w-4" />} />
          <ul className="space-y-2 p-4 text-sm text-white/65">
            <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-lime" /> Géolocalisation arrondie (~10 m) — jamais le domicile du déclarant.</li>
            <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-lime" /> Métadonnées EXIF supprimées des photos à l'envoi.</li>
            <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-lime" /> Signalements anonymes acceptés — l'adoption prime sur le fichage.</li>
            <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-lime" /> On signale des déchets, jamais des personnes : tout contenu visant un individu est rejeté.</li>
            <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-lime" /> Données purgées après clôture + délai légal (registre des traitements tenu).</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

/* ── Réservations ───────────────────────────────────────────────────────── */
function Reservations() {
  const bookings = useDemoStore((s) => s.roomBookings);
  const setStatus = useDemoStore((s) => s.setRoomBookingStatus);
  return (
    <Card className="overflow-hidden">
      <CardHeader title="Salles & équipements" subtitle="Validez ou refusez les demandes" icon={<CalendarCheck className="h-4 w-4" />} />
      <div className="divide-y divide-white/5">
        {bookings.map((b) => (
          <div key={b.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-white">{b.resource}</p>
              <p className="text-xs text-white/45">{b.ref} · {shortDate(b.date)} · {b.slot} · {b.applicant} ({b.people} pers.)</p>
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

/* ── Démarches ──────────────────────────────────────────────────────────── */
const PROC_TONE: Record<string, "warn" | "info" | "progress" | "success"> = {
  depose: "warn",
  instruction: "progress",
  complement: "info",
  valide: "success",
};
const PROC_LABEL: Record<string, string> = { depose: "Déposé", instruction: "En instruction", complement: "Complément demandé", valide: "Validé" };
const PROC_FLOW = ["depose", "instruction", "complement", "valide"] as const;

const COMPLEMENT_PRESETS: Record<string, { message: string; doc: string }> = {
  scolaire: { message: "Complément requis : merci de fournir un justificatif de domicile de moins de 3 mois.", doc: "Justificatif de domicile (- 3 mois)" },
  travaux: { message: "Complément requis : merci de joindre un plan de masse coté dans les trois dimensions.", doc: "Plan de masse coté (DP2)" },
  default: { message: "Complément requis : merci de fournir une pièce d'identité en cours de validité.", doc: "Pièce d'identité (recto-verso)" },
};
function complementPreset(type: string) {
  if (/scolaire/i.test(type)) return COMPLEMENT_PRESETS.scolaire;
  if (/travaux|construire/i.test(type)) return COMPLEMENT_PRESETS.travaux;
  return COMPLEMENT_PRESETS.default;
}

function Demarches() {
  const procedures = useDemoStore((s) => s.procedures);
  const setStatus = useDemoStore((s) => s.setProcedureStatus);
  const requestComplement = useDemoStore((s) => s.requestProcedureComplement);
  const [openId, setOpenId] = useState<string | null>(null);
  return (
    <Card className="overflow-hidden">
      <CardHeader title="Suivi des dossiers" subtitle="État civil · urbanisme · inscriptions" icon={<FileText className="h-4 w-4" />} />
      <div className="divide-y divide-white/5">
        {procedures.map((p) => {
          const open = openId === p.id;
          const curIdx = PROC_FLOW.indexOf(p.status as (typeof PROC_FLOW)[number]);
          const pendingUploads = p.documents.filter((d) => d.kind === "upload" && !d.uploaded).length;
          return (
            <div key={p.id} className="px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-white">{p.type}</p>
                  <p className="text-xs text-white/45">{p.ref} · {p.citizen} · déposé le {shortDate(p.createdAt)} · maj <RelativeTime iso={p.updatedAt} /></p>
                </div>
                <StatusBadge tone={PROC_TONE[p.status]} dot>{PROC_LABEL[p.status]}</StatusBadge>
                <button onClick={() => setOpenId(open ? null : p.id)} className="text-xs text-sky-300 hover:underline">
                  {open ? "Fermer" : "Ouvrir"}
                </button>
              </div>
              {open && (
                <div className="mt-3 rounded-xl border border-white/8 bg-white/[0.03] p-3">
                  <div className="flex items-center gap-1.5">
                    {PROC_FLOW.map((s, i) => (
                      <div key={s} className="flex flex-1 items-center gap-1.5">
                        <span className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold", i <= curIdx ? "bg-indigo-500/30 text-indigo-200" : "bg-white/5 text-white/30")}>{i + 1}</span>
                        {i < PROC_FLOW.length - 1 && <span className={cn("h-px flex-1", i < curIdx ? "bg-indigo-400/40" : "bg-white/10")} />}
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-white/60">
                    <p><span className="text-white/40">Déposé le :</span> {shortDate(p.createdAt)}</p>
                    <p><span className="text-white/40">Service :</span> {p.type.includes("travaux") || p.type.includes("construire") ? "Urbanisme" : p.type.includes("scolaire") ? "Affaires scolaires" : "État civil"}</p>
                    <p><span className="text-white/40">Demandeur :</span> {p.citizen}</p>
                    <p><span className="text-white/40">Pièces fournies :</span> {p.documents.filter((d) => d.kind === "upload" && d.uploaded).length}/{p.documents.filter((d) => d.kind === "upload").length}</p>
                  </div>

                  {p.documents.filter((d) => d.kind === "upload").length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {p.documents.filter((d) => d.kind === "upload").map((d) => (
                        <span key={d.id} className={cn("inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px]", d.uploaded ? "bg-lime/15 text-lime ring-1 ring-lime/30" : "bg-white/5 text-white/45 ring-1 ring-white/10")}>
                          {d.uploaded ? <Check className="h-3 w-3" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />} {d.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {p.status !== "valide" && (
                    <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-white/8 pt-3">
                      {p.status === "depose" && (
                        <Button size="sm" variant="soft" onClick={() => setStatus(p.id, "instruction")}>Mettre en instruction</Button>
                      )}
                      {(p.status === "instruction" || p.status === "complement") && (
                        <Button size="sm" onClick={() => setStatus(p.id, "valide")} disabled={pendingUploads > 0} title={pendingUploads > 0 ? "Pièces manquantes" : undefined}>
                          Valider le dossier
                        </Button>
                      )}
                      {p.status !== "complement" && (
                        <Button size="sm" variant="soft" onClick={() => { const preset = complementPreset(p.type); requestComplement(p.id, preset.message, preset.doc); }}>
                          Demander un complément
                        </Button>
                      )}
                      {pendingUploads > 0 && <span className="text-[11px] text-amber-300">{pendingUploads} pièce(s) en attente côté usager</span>}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

/* ── Conformité (signature NeuraWeb) ────────────────────────────────────── */
function Conformite() {
  const [modal, setModal] = useState<null | "rgaa" | "rgpd">(null);
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-5 text-center">
          <div className="relative mx-auto h-24 w-24">
            <svg viewBox="0 0 36 36" className="h-24 w-24 -rotate-90">
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="#C5F277" strokeWidth="3" strokeLinecap="round" strokeDasharray="97.4" strokeDashoffset="7.8" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center font-display text-xl font-bold text-white">92%</span>
          </div>
          <p className="mt-2 text-sm font-semibold text-white">Score RGAA</p>
          <p className="text-xs text-white/45">Conformité partielle — 50 critères audités</p>
        </Card>
        <Card className="p-5">
          <Accessibility className="h-5 w-5 text-indigo-300" />
          <p className="mt-2 text-sm font-semibold text-white">Déclaration d'accessibilité</p>
          <p className="mt-1 text-xs text-white/50">Schéma pluriannuel 2026-2029 publié. Plan d'action annuel suivi par la DSI.</p>
          <button onClick={() => setModal("rgaa")} className="mt-3 inline-block text-xs text-sky-300 hover:underline">Consulter la déclaration →</button>
        </Card>
        <Card className="p-5">
          <ShieldCheck className="h-5 w-5 text-lime" />
          <p className="mt-2 text-sm font-semibold text-white">RGPD & cookies</p>
          <p className="mt-1 text-xs text-white/50">Registre des traitements à jour, bannière cookies conforme CNIL, DPO désigné.</p>
          <button onClick={() => setModal("rgpd")} className="mt-3 inline-block text-xs text-sky-300 hover:underline">Registre des traitements →</button>
        </Card>
      </div>

      <Modal open={modal === "rgaa"} onClose={() => setModal(null)} title="Déclaration d'accessibilité (RGAA)" subtitle="Ville de Néauville — extrait" icon={<Accessibility className="h-5 w-5" />}>
        <div className="space-y-3 text-sm text-white/70">
          <p>Le site et l'application sont en <span className="font-semibold text-white">conformité partielle</span> avec le RGAA 4.1 (taux global : 92 %).</p>
          <div>
            <p className="font-medium text-white">Résultats des tests</p>
            <ul className="mt-1 space-y-1 text-white/60">
              <li>• 50 critères audités — 46 conformes, 4 non applicables ou partiels.</li>
              <li>• Contrastes, navigation clavier et lecteurs d'écran validés.</li>
              <li>• Non-conformités résiduelles : 2 PDF non balisés, 1 carte interactive.</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-white">Schéma pluriannuel 2026-2029</p>
            <p className="text-white/60">Mise en accessibilité progressive des téléservices et des documents, audit annuel externe.</p>
          </div>
          <p className="text-xs text-white/40">Contenu de démonstration — non opposable.</p>
        </div>
      </Modal>

      <Modal open={modal === "rgpd"} onClose={() => setModal(null)} title="Registre des traitements (RGPD)" subtitle="Ville de Néauville — extrait" icon={<ShieldCheck className="h-5 w-5" />}>
        <div className="space-y-2 text-sm text-white/70">
          {[
            { t: "Gestion des signalements", b: "Identité, photo, géoloc", d: "3 ans" },
            { t: "État civil & démarches", b: "Données d'identité", d: "Durée légale" },
            { t: "Réservations d'équipements", b: "Identité, coordonnées", d: "1 an" },
            { t: "Newsletter municipale", b: "Email (consentement)", d: "Jusqu'au retrait" },
          ].map((r) => (
            <div key={r.t} className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
              <p className="font-medium text-white">{r.t}</p>
              <p className="text-xs text-white/55">Données : {r.b} · Conservation : {r.d}</p>
            </div>
          ))}
          <p className="text-xs text-white/40">DPO désigné · base légale : mission de service public. Démonstration.</p>
        </div>
      </Modal>
      <Card className="flex items-start gap-3 p-5">
        <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" />
        <div>
          <p className="text-sm font-semibold text-white">Transparence IA (AI Act, art. 50)</p>
          <p className="mt-1 text-sm text-white/55">
            L'assistant citoyen et les suggestions sont signalés comme générés par IA. Aucune décision
            administrative n'est automatisée : l'IA assiste, l'agent décide. C'est la signature NeuraWeb pour le secteur public.
          </p>
        </div>
      </Card>
    </div>
  );
}

function Contenu() {
  return (
    <Card className="p-6 text-center">
      <Newspaper className="mx-auto h-8 w-8 text-indigo-300" />
      <p className="mt-3 font-semibold text-white">Éditeur d'actualités & agenda</p>
      <p className="mx-auto mt-1 max-w-md text-sm text-white/50">
        Rédigez actualités et événements publiés instantanément sur le site et l'app citoyenne. Module maquetté dans la version finale.
      </p>
      <DemoLink feature="Éditeur d'actualités" className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-indigo-500/20 px-4 py-2 text-sm font-medium text-indigo-200 ring-1 ring-indigo-400/40">
        Ouvrir l'éditeur <ArrowRight className="h-4 w-4" />
      </DemoLink>
    </Card>
  );
}
