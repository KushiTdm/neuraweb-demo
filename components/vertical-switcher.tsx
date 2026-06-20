"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { VERTICAL_LIST, VERTICALS } from "@/lib/verticals";
import type { VerticalId } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Passe d'un secteur à l'autre sans repasser par le launcher. */
export function VerticalSwitcher({ current }: { current: VerticalId }) {
  const [open, setOpen] = useState(false);
  const cur = VERTICALS[current];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/5 px-3 py-2 text-sm font-medium text-white transition hover:border-sky-400/40"
      >
        <span className="text-base leading-none">{cur.emoji}</span>
        <span className="hidden sm:inline">{cur.name}</span>
        <ChevronDown className={cn("h-4 w-4 text-white/50 transition", open && "rotate-180")} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-white/12 bg-navy-900 p-1.5 shadow-2xl"
        >
          {VERTICAL_LIST.map((v) => (
            <Link
              key={v.id}
              href={`/${v.slug}`}
              role="menuitem"
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 transition",
                v.id === current ? "bg-white/8" : "hover:bg-white/5",
              )}
            >
              <span className="text-lg">{v.emoji}</span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-white">{v.name}</span>
                <span className="block truncate text-xs text-white/45">{v.sector}</span>
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
