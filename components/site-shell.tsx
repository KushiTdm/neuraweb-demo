"use client";

import { type LucideIcon } from "lucide-react";
import { VERTICALS } from "@/lib/verticals";
import type { VerticalId } from "@/lib/types";
import { NotificationBell, LiveToast } from "./notifications";
import { cn } from "@/lib/utils";

export interface SiteTab {
  key: string;
  label: string;
  icon: LucideIcon;
}

const HEADER_GRADIENT: Record<VerticalId, string> = {
  collectivite: "from-indigo-600 to-sky-500",
  restaurant: "from-amber-500 to-orange-500",
  hotel: "from-teal-600 to-cyan-500",
};
const ACCENT_TEXT: Record<VerticalId, string> = {
  collectivite: "text-indigo-700",
  restaurant: "text-amber-700",
  hotel: "text-teal-700",
};
const ACCENT_PILL: Record<VerticalId, string> = {
  collectivite: "bg-indigo-600 text-white",
  restaurant: "bg-amber-500 text-white",
  hotel: "bg-teal-600 text-white",
};

/**
 * Coque de site web client (claire) à placer dans <BrowserFrame>. Navigation en haut
 * (comme un vrai site), pas d'onglets façon app — on ne télécharge rien.
 */
export function SiteShell({
  vertical,
  tabs,
  active,
  onSelect,
  children,
}: {
  vertical: VerticalId;
  tabs: SiteTab[];
  active: string;
  onSelect: (key: string) => void;
  children: React.ReactNode;
}) {
  const v = VERTICALS[vertical];
  return (
    <div className="relative flex min-h-full flex-col bg-surface text-navy-900">
      <LiveToast vertical={vertical} audience="app" theme="light" />

      <header className="sticky top-0 z-20 border-b border-navy-900/8 bg-white/95 backdrop-blur">
        <div className={cn("flex items-center gap-2 bg-gradient-to-r px-4 py-2.5 text-white", HEADER_GRADIENT[vertical])}>
          <span className="text-lg leading-none">{v.emoji}</span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold leading-tight">{v.appName}</p>
            <p className="truncate text-[10px] text-white/85">{v.clientUrl}</p>
          </div>
          <div className="ml-auto">
            <NotificationBell vertical={vertical} audience="app" theme="light" />
          </div>
        </div>
        <nav className="flex gap-1.5 overflow-x-auto px-3 py-2">
          {tabs.map((t) => {
            const on = active === t.key;
            return (
              <button
                key={t.key}
                onClick={() => onSelect(t.key)}
                aria-current={on ? "page" : undefined}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition",
                  on ? ACCENT_PILL[vertical] : cn("bg-navy-900/5 hover:bg-navy-900/10", ACCENT_TEXT[vertical]),
                )}
              >
                <t.icon className="h-3.5 w-3.5" />
                {t.label}
              </button>
            );
          })}
        </nav>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-navy-900/8 bg-white px-4 py-2.5 text-center text-[10px] text-navy-400">
        Site web de démonstration · propulsé par NeuraWeb · données fictives
      </footer>
    </div>
  );
}
