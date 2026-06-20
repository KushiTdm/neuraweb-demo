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
} from "lucide-react";
import { AdminShell, type AdminModule } from "@/components/admin-shell";
import { ActivityFeed } from "@/components/activity-feed";
import { Thumb } from "@/components/asset-image";
import { DemoLink } from "@/components/demo-link";
import { Modal } from "@/components/modal";
import { KpiCard } from "@/components/ui/kpi-card";
import { Card, CardHeader, Button } from "@/components/ui/primitives";
import { DataTable, type Column } from "@/components/ui/data-table";
import { StatusBadge, reportTone, reservationTone } from "@/components/ui/status-badge";
import { RelativeTime } from "@/components/relative-time";
import { useDemoStore } from "@/lib/store";
import {
  REPORT_STATUS_LABEL,
  RESERVATION_STATUS_LABEL,
} from "@/lib/verticals";
import type { Report, ReportStatus } from "@/lib/types";
import { cn, shortDate } from "@/lib/utils";

const MODULES: AdminModule[] = [
  { key: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { key: "signalements", label: "Signalements", icon: TriangleAlert },
  { key: "reservations", label: "Réservations", icon: CalendarCheck },
  { key: "demarches", label: "Démarches", icon: FileText },
  { key: "conformite", label: "Conformité", icon: Accessibility },
  { key: "contenu", label: "Actualités", icon: Newspaper },
];

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
const NEXT_STATUS: Partial<Record<ReportStatus, ReportStatus>> = {
  nouveau: "recu",
  recu: "en_cours",
  en_cours: "resolu",
};

export function CollectiviteAdmin({ standalone = false }: { standalone?: boolean }) {
  const [module, setModule] = useState("dashboard");
  const titleMap: Record<string, string> = {
    dashboard: "Tableau de bord",
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
  const procedures = useDemoStore((s) => s.procedures);
  const open = reports.filter((r) => r.status !== "resolu").length;

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
          <CardHeader title="Carte des signalements" subtitle={`${reports.length} points`} icon={<MapPin className="h-4 w-4" />} action={<button onClick={() => onGo("signalements")} className="text-xs text-sky-300 hover:underline">Tout voir</button>} />
          <div className="p-3">
            <SignalementsMap reports={reports} />
            <div className="mt-3 flex flex-wrap gap-3">
              {Object.entries(CATEGORY_LABEL).map(([k, label]) => (
                <span key={k} className="flex items-center gap-1.5 text-xs text-white/55">
                  <span className={cn("h-2.5 w-2.5 rounded-full", CATEGORY_COLOR[k])} /> {label}
                </span>
              ))}
            </div>
          </div>
        </Card>

        <ActivityFeed vertical="collectivite" />
      </div>

      <Card>
        <CardHeader title="Dernières demandes" subtitle="Signalements & démarches récents" icon={<FileText className="h-4 w-4" />} />
        <div className="divide-y divide-white/5">
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

function SignalementsMap({ reports }: { reports: Report[] }) {
  return (
    <div className="relative h-44 overflow-hidden rounded-xl border border-white/10 bg-navy-950">
      <Thumb name="carte-statique" alt="Plan de la ville" className="absolute inset-0" sizes="600px" imgClassName="opacity-90" />
      <div className="absolute inset-0 bg-navy-950/45" />
      {reports.map((r) => (
        <span
          key={r.id}
          title={`${r.title} — ${CATEGORY_LABEL[r.category]}`}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${r.x}%`, top: `${r.y}%` }}
        >
          <span className={cn("block h-3 w-3 rounded-full ring-2 ring-navy-950", CATEGORY_COLOR[r.category])} />
          {r.status === "nouveau" && <span className={cn("absolute inset-0 animate-ping rounded-full", CATEGORY_COLOR[r.category], "opacity-60")} />}
        </span>
      ))}
    </div>
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
