"use client";

import { Signal, Wifi, BatteryFull } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Cadre smartphone responsive (dynamic-island + barre d'état mockée) encapsulant
 * l'app mobile en mode clair. Sur petit viewport, le parent peut le passer en plein écran.
 */
export function PhoneFrame({
  children,
  className,
  fullBleed = false,
}: {
  children: React.ReactNode;
  className?: string;
  /** true = remplit son conteneur (mode plein écran mobile), sinon device flottant */
  fullBleed?: boolean;
}) {
  if (fullBleed) {
    return (
      <div className={cn("relative flex h-full w-full flex-col overflow-hidden bg-surface text-navy-900", className)}>
        <StatusBar />
        <div className="relative flex-1 overflow-y-auto overscroll-contain">{children}</div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative mx-auto w-[332px] max-w-full shrink-0 rounded-[2.75rem] border border-white/10 bg-navy-950 p-2.5 shadow-2xl shadow-black/50",
        className,
      )}
    >
      {/* boutons latéraux */}
      <span className="absolute -left-0.5 top-28 h-12 w-0.5 rounded-full bg-white/15" />
      <span className="absolute -left-0.5 top-44 h-16 w-0.5 rounded-full bg-white/15" />
      <span className="absolute -right-0.5 top-36 h-20 w-0.5 rounded-full bg-white/15" />

      <div className="relative flex h-[700px] max-h-[78vh] flex-col overflow-hidden rounded-[2.25rem] bg-surface text-navy-900">
        {/* dynamic island */}
        <div className="pointer-events-none absolute left-1/2 top-2 z-30 h-7 w-28 -translate-x-1/2 rounded-full bg-navy-950" />
        <StatusBar />
        <div className="relative flex-1 overflow-y-auto overscroll-contain">{children}</div>
      </div>
    </div>
  );
}

function StatusBar() {
  return (
    <div className="relative z-20 flex h-10 shrink-0 items-center justify-between bg-surface px-6 pt-1 text-[11px] font-semibold text-navy-900">
      <span className="tabular-nums">9:41</span>
      <div className="flex items-center gap-1.5">
        <Signal className="h-3.5 w-3.5" />
        <Wifi className="h-3.5 w-3.5" />
        <BatteryFull className="h-4 w-4" />
      </div>
    </div>
  );
}
