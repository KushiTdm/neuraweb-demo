"use client";

import { useState } from "react";
import { Maximize2, Minimize2, Monitor, Smartphone, Globe } from "lucide-react";
import { PhoneFrame } from "./phone-frame";
import { BrowserFrame } from "./browser-frame";
import { cn } from "@/lib/utils";

/**
 * Pattern « Split View » : back-office web + surface usager (app mobile OU site web)
 * côte à côte sur desktop, en onglets sur mobile/tablette. Chaque vue peut s'ouvrir seule.
 */
export function SplitView({
  admin,
  client,
  surface = "phone",
  url,
  clientLabel = surface === "phone" ? "Application mobile" : "Site web client",
}: {
  admin: React.ReactNode;
  client: React.ReactNode;
  surface?: "phone" | "browser";
  url?: string;
  clientLabel?: string;
}) {
  const [tab, setTab] = useState<"admin" | "client">("admin");
  const [full, setFull] = useState<null | "admin" | "client">(null);
  const ClientIcon = surface === "phone" ? Smartphone : Globe;

  const renderClient = (fullBleed?: boolean) =>
    surface === "phone" ? (
      <PhoneFrame fullBleed={fullBleed}>{client}</PhoneFrame>
    ) : (
      <BrowserFrame url={url} fullBleed={fullBleed}>
        {client}
      </BrowserFrame>
    );

  return (
    <>
      {/* ── Desktop : côte à côte ─────────────────────────────────────── */}
      <div className={cn("hidden lg:grid lg:items-start lg:gap-6", surface === "phone" ? "lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_400px]" : "lg:grid-cols-[minmax(0,1fr)_400px] xl:grid-cols-[minmax(0,1fr)_440px]")}>
        <section aria-label="Back-office web" className="relative min-w-0">
          <PanelChrome icon={<Monitor className="h-3.5 w-3.5 text-sky-400" />} label="Back-office web" onExpand={() => setFull("admin")} />
          {admin}
        </section>
        <aside aria-label={clientLabel} className="sticky top-20">
          <div className="mb-2 flex justify-center">
            <PanelChrome icon={<ClientIcon className="h-3.5 w-3.5 text-sky-400" />} label={clientLabel} onExpand={() => setFull("client")} inline />
          </div>
          {renderClient()}
        </aside>
      </div>

      {/* ── Mobile / tablette : onglets ───────────────────────────────── */}
      <div className="lg:hidden">
        <div className="mb-4 flex rounded-xl border border-white/10 bg-white/5 p-1 text-sm">
          <TabButton active={tab === "admin"} onClick={() => setTab("admin")} icon={<Monitor className="h-4 w-4" />}>
            Back-office
          </TabButton>
          <TabButton active={tab === "client"} onClick={() => setTab("client")} icon={<ClientIcon className="h-4 w-4" />}>
            {surface === "phone" ? "App mobile" : "Site client"}
          </TabButton>
        </div>

        {tab === "admin" ? (
          <section aria-label="Back-office web">
            <button onClick={() => setFull("admin")} className="mb-3 inline-flex items-center gap-1.5 text-xs text-sky-300">
              <Maximize2 className="h-3.5 w-3.5" /> Voir en plein écran
            </button>
            {admin}
          </section>
        ) : (
          <section aria-label={clientLabel} className="flex flex-col items-center">
            <button onClick={() => setFull("client")} className="mb-3 inline-flex items-center gap-1.5 text-xs text-sky-300">
              <Maximize2 className="h-3.5 w-3.5" /> Plein écran
            </button>
            {renderClient()}
          </section>
        )}
      </div>

      {/* ── Overlay plein écran ───────────────────────────────────────── */}
      {full && (
        <FullscreenOverlay onClose={() => setFull(null)} label={full === "admin" ? "Back-office web" : clientLabel}>
          {full === "admin" ? (
            <div className="mx-auto max-w-5xl p-4 sm:p-6">{admin}</div>
          ) : surface === "phone" ? (
            <div className="flex h-full items-center justify-center p-4">
              <div className="h-full max-h-[820px] w-full max-w-[420px] overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl">
                <PhoneFrame fullBleed className="h-full">
                  {client}
                </PhoneFrame>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center p-4">
              <div className="flex h-full max-h-[860px] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
                <BrowserFrame fullBleed url={url} className="h-full">
                  {client}
                </BrowserFrame>
              </div>
            </div>
          )}
        </FullscreenOverlay>
      )}
    </>
  );
}

function PanelChrome({ icon, label, onExpand, inline }: { icon: React.ReactNode; label: string; onExpand: () => void; inline?: boolean }) {
  return (
    <div className={cn("mb-3 flex items-center gap-2", inline && "mb-0")}>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-white/60">
        {icon}
        {label}
      </span>
      <button onClick={onExpand} aria-label={`Ouvrir ${label} en plein écran`} className="rounded-full border border-white/10 bg-white/5 p-1.5 text-white/50 transition hover:text-white">
        <Maximize2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function TabButton({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 font-medium transition",
        active ? "bg-navy-100 text-navy-950" : "text-white/60 hover:text-white",
      )}
    >
      {icon}
      {children}
    </button>
  );
}

function FullscreenOverlay({ children, onClose, label }: { children: React.ReactNode; onClose: () => void; label: string }) {
  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-navy-950/95 backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        <span className="text-sm font-medium text-white/70">{label} — plein écran</span>
        <button onClick={onClose} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1 text-xs text-white/80 hover:text-white">
          <Minimize2 className="h-3.5 w-3.5" /> Fermer
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
