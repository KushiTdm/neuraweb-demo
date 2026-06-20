"use client";

import { type LucideIcon } from "lucide-react";
import { VERTICALS } from "@/lib/verticals";
import type { VerticalId } from "@/lib/types";
import { NotificationBell, LiveToast } from "./notifications";
import { cn } from "@/lib/utils";

export interface AppTab {
  key: string;
  label: string;
  icon: LucideIcon;
}

const ACCENT_TEXT: Record<VerticalId, string> = {
  collectivite: "text-indigo-600",
  restaurant: "text-amber-600",
  hotel: "text-teal-600",
};
const ACCENT_BG: Record<VerticalId, string> = {
  collectivite: "bg-indigo-50",
  restaurant: "bg-amber-50",
  hotel: "bg-teal-50",
};
const HEADER_GRADIENT: Record<VerticalId, string> = {
  collectivite: "from-indigo-600 to-sky-500",
  restaurant: "from-amber-500 to-orange-500",
  hotel: "from-teal-600 to-cyan-500",
};

/** Coque d'application mobile (claire) à placer dans <PhoneFrame>. Header + onglets bas. */
export function AppShell({
  vertical,
  tabs,
  active,
  onSelect,
  children,
  hideHeader = false,
}: {
  vertical: VerticalId;
  tabs: AppTab[];
  active: string;
  onSelect: (key: string) => void;
  children: React.ReactNode;
  hideHeader?: boolean;
}) {
  const v = VERTICALS[vertical];
  return (
    <div className="relative flex min-h-full flex-col bg-surface text-navy-900">
      <LiveToast vertical={vertical} audience="app" theme="light" />

      {!hideHeader && (
        <header className={cn("flex items-center gap-2 bg-gradient-to-r px-4 py-3 text-white", HEADER_GRADIENT[vertical])}>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold leading-tight">{v.appName}</p>
            <p className="truncate text-[11px] text-white/80">Application mobile · démo</p>
          </div>
          <div className="ml-auto">
            <NotificationBell vertical={vertical} audience="app" theme="light" />
          </div>
        </header>
      )}

      <main className="flex-1 pb-2">{children}</main>

      <nav
        className="sticky bottom-0 z-20 grid border-t border-navy-900/10 bg-white/95 backdrop-blur"
        style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
      >
        {tabs.map((t) => {
          const Icon = t.icon;
          const on = active === t.key;
          return (
            <button
              key={t.key}
              onClick={() => onSelect(t.key)}
              aria-current={on ? "page" : undefined}
              className="flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium"
            >
              <span className={cn("flex h-7 w-9 items-center justify-center rounded-full transition", on && ACCENT_BG[vertical])}>
                <Icon className={cn("h-4 w-4", on ? ACCENT_TEXT[vertical] : "text-navy-400")} />
              </span>
              <span className={cn(on ? ACCENT_TEXT[vertical] : "text-navy-400")}>{t.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

/* Helpers de mise en page pour le contenu clair des apps */
export function AppSection({ title, action, children, className }: { title?: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("px-4 py-3", className)}>
      {(title || action) && (
        <div className="mb-2 flex items-center justify-between">
          {title && <h2 className="text-sm font-semibold text-navy-900">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function AppCard({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-2xl border border-navy-900/8 bg-white p-3 shadow-sm",
        onClick && "cursor-pointer transition active:scale-[0.99]",
        className,
      )}
    >
      {children}
    </div>
  );
}
