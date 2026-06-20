"use client";

import Link from "next/link";
import { ArrowLeft, Wifi } from "lucide-react";
import { Logo } from "./brand";
import { VerticalSwitcher } from "./vertical-switcher";
import { PresentationModeButton, PresentationCaption } from "./presentation-mode";
import { SplitView } from "./split-view";
import { VERTICALS } from "@/lib/verticals";
import type { VerticalId } from "@/lib/types";

/** Coque d'un hub vertical : barre + Split View (back-office + surface usager) + mode présentation. */
export function HubShell({
  vertical,
  admin,
  client,
}: {
  vertical: VerticalId;
  admin: React.ReactNode;
  client: React.ReactNode;
}) {
  const v = VERTICALS[vertical];
  const clientWord = v.clientSurface === "phone" ? "l'app mobile" : "le site web";
  return (
    <div className="min-h-screen">
      <PresentationCaption vertical={vertical} />

      <header className="sticky top-9 z-40 border-b border-white/8 bg-navy-950/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5">
          <Link href="/" aria-label="Retour au launcher" className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/12 bg-white/5 text-white/70 transition hover:text-white">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="hidden sm:block">
            <Logo withTag={false} />
          </div>
          <VerticalSwitcher current={vertical} />
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-full border border-lime/25 bg-lime/10 px-2.5 py-1 text-[11px] font-medium text-lime md:inline-flex">
              <Wifi className="h-3.5 w-3.5" /> Synchro temps réel
            </span>
            <PresentationModeButton vertical={vertical} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-5">
        <div className="mb-4 flex items-center gap-2 text-sm text-white/55">
          <span className="text-lg">{v.emoji}</span>
          <p>
            <span className="font-medium text-white">{v.name}</span> — {v.tagline}.
            <span className="ml-1 hidden text-white/40 sm:inline">Agissez sur {clientWord}, observez le back-office (et inversement).</span>
          </p>
        </div>
        <SplitView admin={admin} client={client} surface={v.clientSurface} url={v.clientUrl} clientLabel={v.clientLabel} />
      </main>
    </div>
  );
}
