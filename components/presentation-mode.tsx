"use client";

import { AnimatePresence, motion } from "motion/react";
import { Play, Square, Clapperboard } from "lucide-react";
import { useDemoStore } from "@/lib/store";
import type { VerticalId } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Bouton « Mode présentation » : joue un scénario de synchro automatiquement. */
export function PresentationModeButton({ vertical, className }: { vertical: VerticalId; className?: string }) {
  const presentation = useDemoStore((s) => s.presentation);
  const start = useDemoStore((s) => s.startPresentation);
  const stop = useDemoStore((s) => s.stopPresentation);
  const running = presentation.running && presentation.vertical === vertical;

  return (
    <button
      onClick={() => (running ? stop() : start(vertical))}
      className={cn(
        "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition active:scale-[0.98]",
        running
          ? "bg-coral text-white shadow-lg shadow-coral/20"
          : "bg-gradient-to-r from-sky-400 to-cyan-500 text-navy-950 shadow-lg shadow-sky-500/20 hover:brightness-110",
        className,
      )}
    >
      {running ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      {running ? "Arrêter" : "Mode présentation"}
    </button>
  );
}

/** Bandeau de sous-titres joué pendant la présentation mains-libres. */
export function PresentationCaption({ vertical }: { vertical: VerticalId }) {
  const presentation = useDemoStore((s) => s.presentation);
  const active = presentation.vertical === vertical && (presentation.running || presentation.caption);
  const show = presentation.vertical === vertical && presentation.caption !== "";

  return (
    <AnimatePresence>
      {active && show && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          className="pointer-events-none fixed left-1/2 top-14 z-[55] w-[min(92vw,38rem)] -translate-x-1/2"
        >
          <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-navy-900/90 px-4 py-3 shadow-2xl backdrop-blur">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-cyan-500 text-navy-950">
              <Clapperboard className="h-4 w-4" />
            </span>
            <p className="text-sm font-medium text-white">{presentation.caption}</p>
            {presentation.total > 0 && (
              <span className="ml-auto shrink-0 text-xs text-white/45">
                {Math.min(presentation.step, presentation.total)}/{presentation.total}
              </span>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
