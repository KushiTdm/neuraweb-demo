"use client";

import { AnimatePresence, motion } from "motion/react";
import { Monitor, Smartphone, Radio } from "lucide-react";
import { useDemoStore } from "@/lib/store";
import type { VerticalId } from "@/lib/types";
import { RelativeTime } from "./relative-time";
import { Card, CardHeader } from "./ui/primitives";
import { cn } from "@/lib/utils";

/** Flux d'activité temps réel — donne le sentiment de « connexion vivante ». */
export function ActivityFeed({ vertical, limit = 8 }: { vertical: VerticalId; limit?: number }) {
  const activity = useDemoStore((s) => s.activity).filter((a) => a.vertical === vertical).slice(0, limit);

  return (
    <Card>
      <CardHeader
        title="Activité en temps réel"
        subtitle="Flux partagé web ↔ mobile"
        icon={<Radio className="h-4 w-4" />}
        action={
          <span className="flex items-center gap-1.5 text-[11px] text-lime">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime/60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-lime" />
            </span>
            Live
          </span>
        }
      />
      <ul className="max-h-72 space-y-1 overflow-y-auto p-2">
        <AnimatePresence initial={false}>
          {activity.map((a) => (
            <motion.li
              key={a.id}
              layout
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2.5 rounded-xl px-2 py-2 hover:bg-white/5"
            >
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                  a.side === "app" ? "bg-cyan-500/15 text-cyan-300" : "bg-indigo-500/15 text-indigo-300",
                )}
              >
                {a.side === "app" ? <Smartphone className="h-3.5 w-3.5" /> : <Monitor className="h-3.5 w-3.5" />}
              </span>
              <p className="min-w-0 flex-1 truncate text-sm text-white/80">{a.label}</p>
              <RelativeTime iso={a.ts} className="shrink-0 text-[11px] text-white/35" />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </Card>
  );
}
