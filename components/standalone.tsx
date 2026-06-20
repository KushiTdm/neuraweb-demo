"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "./brand";
import { PhoneFrame } from "./phone-frame";
import { BrowserFrame } from "./browser-frame";
import { PresentationModeButton, PresentationCaption } from "./presentation-mode";
import { VerticalSwitcher } from "./vertical-switcher";
import { VERTICALS } from "@/lib/verticals";
import type { VerticalId } from "@/lib/types";

function TopBar({ vertical }: { vertical: VerticalId }) {
  const v = VERTICALS[vertical];
  return (
    <header className="sticky top-9 z-40 border-b border-white/8 bg-navy-950/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5">
        <Link href={`/${v.slug}`} aria-label="Retour au hub" className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/12 bg-white/5 text-white/70 transition hover:text-white">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="hidden sm:block"><Logo withTag={false} /></div>
        <VerticalSwitcher current={vertical} />
        <div className="ml-auto"><PresentationModeButton vertical={vertical} /></div>
      </div>
    </header>
  );
}

/** Vue back-office seule (plein écran). */
export function StandaloneAdmin({ vertical, children }: { vertical: VerticalId; children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <PresentationCaption vertical={vertical} />
      <TopBar vertical={vertical} />
      <main className="mx-auto max-w-6xl px-4 py-5">{children}</main>
    </div>
  );
}

/** Vue surface usager seule (app mobile dans PhoneFrame, ou site web dans BrowserFrame). */
export function StandaloneApp({ vertical, children }: { vertical: VerticalId; children: React.ReactNode }) {
  const v = VERTICALS[vertical];
  return (
    <div className="min-h-screen">
      <PresentationCaption vertical={vertical} />
      <TopBar vertical={vertical} />
      <main className="mx-auto flex max-w-6xl flex-col items-center px-4 py-6">
        {v.clientSurface === "phone" ? (
          <PhoneFrame>{children}</PhoneFrame>
        ) : (
          <BrowserFrame url={v.clientUrl}>{children}</BrowserFrame>
        )}
      </main>
    </div>
  );
}
