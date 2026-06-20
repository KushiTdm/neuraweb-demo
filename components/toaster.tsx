"use client";

import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Info, AlertTriangle } from "lucide-react";
import { useUIStore } from "@/lib/ui-store";
import { cn } from "@/lib/utils";

const ICON = { info: Info, success: CheckCircle2, warn: AlertTriangle };
const TONE = {
  info: "border-sky-400/30 text-sky-200",
  success: "border-lime/30 text-lime",
  warn: "border-coral/30 text-coral-soft",
};

/** Toasts globaux (confirmations d'actions). Monté dans le layout. */
export function Toaster() {
  const toasts = useUIStore((s) => s.toasts);
  return (
    <div className="no-print pointer-events-none fixed inset-x-0 bottom-20 z-[80] flex flex-col items-center gap-2 px-4 sm:bottom-6">
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = ICON[t.tone];
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              className={cn(
                "pointer-events-auto flex max-w-sm items-center gap-2.5 rounded-2xl border bg-navy-900/95 px-4 py-2.5 text-sm shadow-2xl backdrop-blur",
                TONE[t.tone],
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="text-white/90">{t.message}</span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
