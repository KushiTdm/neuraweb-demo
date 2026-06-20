"use client";

import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";

/** Feuille modale claire (bottom-sheet) à utiliser DANS un PhoneFrame / BrowserFrame. */
export function LightSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 z-40 flex flex-col justify-end bg-navy-950/40"
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[82%] overflow-y-auto rounded-t-3xl bg-white p-4 text-navy-900"
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <h3 className="min-w-0 font-display text-lg font-bold text-navy-900">{title}</h3>
              <button onClick={onClose} aria-label="Fermer" className="shrink-0 rounded-full bg-navy-100 p-1.5 text-navy-600">
                <X className="h-4 w-4" />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
