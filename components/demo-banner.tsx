"use client";

import { useState } from "react";
import { FlaskConical, RotateCcw, X, Sparkles } from "lucide-react";
import { useDemoStore } from "@/lib/store";

export function DemoBanner() {
  const [open, setOpen] = useState(true);
  const [flash, setFlash] = useState(false);
  const resetDemo = useDemoStore((s) => s.resetDemo);

  const handleReset = () => {
    resetDemo();
    setFlash(true);
    setTimeout(() => setFlash(false), 1400);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="no-print fixed bottom-4 left-4 z-[60] flex items-center gap-2 rounded-full border border-white/15 bg-navy-900/90 px-3 py-1.5 text-xs text-sky-300 shadow-lg backdrop-blur"
      >
        <FlaskConical className="h-3.5 w-3.5" />
        Mode démo
      </button>
    );
  }

  return (
    <div
      role="region"
      aria-label="Bandeau de démonstration"
      className="no-print sticky top-0 z-[60] flex items-center gap-3 border-b border-white/10 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 px-3 py-1.5 text-xs sm:px-4"
    >
      <span className="flex items-center gap-1.5 font-medium text-sky-300">
        <FlaskConical className="h-3.5 w-3.5 shrink-0" />
        <span className="hidden sm:inline">Environnement de démonstration NeuraWeb</span>
        <span className="sm:hidden">Démo NeuraWeb</span>
      </span>
      <span className="hidden text-white/40 md:inline">— données fictives, fonctionnalités simulées</span>

      <div className="ml-auto flex items-center gap-1.5">
        {flash && (
          <span className="flex items-center gap-1 text-lime">
            <Sparkles className="h-3.5 w-3.5" /> Réinitialisée
          </span>
        )}
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 rounded-full border border-white/15 px-2.5 py-1 text-white/80 transition hover:border-sky-400/50 hover:text-white"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Réinitialiser la démo</span>
          <span className="sm:hidden">Reset</span>
        </button>
        <button
          onClick={() => setOpen(false)}
          aria-label="Masquer le bandeau"
          className="rounded-full p-1 text-white/50 transition hover:bg-white/10 hover:text-white"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
