"use client";

import { type LucideIcon } from "lucide-react";
import { VERTICALS } from "@/lib/verticals";
import type { VerticalId } from "@/lib/types";
import { NotificationBell } from "./notifications";
import { VerticalIcon } from "@/components/brand/icons";
import { cn } from "@/lib/utils";

export interface AdminModule {
  key: string;
  label: string;
  icon: LucideIcon;
}

/** Coque de back-office (sombre) : sidebar + topbar + zone de contenu scrollable. */
export function AdminShell({
  vertical,
  modules,
  active,
  onSelect,
  title,
  subtitle,
  children,
  headerRight,
  standalone = false,
}: {
  vertical: VerticalId;
  modules: AdminModule[];
  active: string;
  onSelect: (key: string) => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  headerRight?: React.ReactNode;
  /** true = page autonome plein écran (hauteur viewport) */
  standalone?: boolean;
}) {
  const v = VERTICALS[vertical];
  return (
    <div
      className={cn(
        "glass bg-grid flex overflow-hidden rounded-2xl border border-white/10",
        standalone ? "h-[calc(100vh-7rem)]" : "h-[640px] lg:h-[704px]",
      )}
    >
      {/* sidebar */}
      <nav className="flex w-14 shrink-0 flex-col items-center gap-1 border-r border-white/8 bg-navy-950/40 py-3 sm:w-52 sm:items-stretch sm:px-2.5">
        <div className="mb-3 flex items-center gap-2 px-1.5 sm:px-2">
          <VerticalIcon id={vertical} className={cn("h-6 w-6", v.styles.text)} />
          <span className="hidden min-w-0 sm:block">
            <span className="block truncate text-sm font-semibold text-white">{v.adminName}</span>
            <span className="block truncate text-[11px] text-white/40">{v.name}</span>
          </span>
        </div>
        {modules.map((m) => {
          const Icon = m.icon;
          const on = active === m.key;
          return (
            <button
              key={m.key}
              onClick={() => onSelect(m.key)}
              title={m.label}
              aria-current={on ? "page" : undefined}
              className={cn(
                "flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm transition sm:justify-start",
                "justify-center",
                on ? cn(v.styles.softBg, "font-medium text-white ring-1", v.styles.border) : "text-white/55 hover:bg-white/5 hover:text-white",
              )}
            >
              <Icon className={cn("h-4 w-4 shrink-0", on && v.styles.text)} />
              <span className="hidden sm:inline">{m.label}</span>
            </button>
          );
        })}
        <div className="mt-auto hidden px-2 sm:block">
          <p className="rounded-lg bg-white/5 p-2 text-[10px] leading-snug text-white/35">
            Maquette NeuraWeb — données fictives.
          </p>
        </div>
      </nav>

      {/* main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex shrink-0 items-center gap-3 border-b border-white/8 px-4 py-3">
          <div className="min-w-0">
            <h1 className="truncate font-display text-base font-semibold text-white">{title}</h1>
            {subtitle && <p className="truncate text-xs text-white/45">{subtitle}</p>}
          </div>
          <div className="ml-auto flex items-center gap-2">
            {headerRight}
            <NotificationBell vertical={vertical} audience="admin" theme="dark" />
          </div>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  );
}
