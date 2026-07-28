"use client";

import { create } from "zustand";
import { uid } from "./utils";

export type ToastTone = "info" | "success" | "warn";
export interface Toast {
  id: string;
  message: string;
  tone: ToastTone;
}

interface UIState {
  toasts: Toast[];
  push: (message: string, tone?: ToastTone) => void;
  dismiss: (id: string) => void;
  contactOpen: boolean;
  contactContext?: string;
  /** Origine de l'ouverture : 'contact' (CTA) ou 'assistant' (escalade chat). */
  contactSource?: "contact" | "assistant";
  openContact: (context?: string, source?: "contact" | "assistant") => void;
  closeContact: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  toasts: [],
  push: (message, tone = "info") => {
    const id = uid("toast");
    set((s) => ({ toasts: [...s.toasts, { id, message, tone }] }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 3200);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  contactOpen: false,
  openContact: (context, source = "contact") =>
    set({ contactOpen: true, contactContext: context, contactSource: source }),
  closeContact: () => set({ contactOpen: false }),
}));

/** Raccourci pour afficher un toast depuis n'importe quel handler. */
export function toast(message: string, tone: ToastTone = "info") {
  useUIStore.getState().push(message, tone);
}

/** Ouvre la fenêtre de contact (formulaire de lead réel → /api/lead). */
export function openContact(context?: string, source: "contact" | "assistant" = "contact") {
  useUIStore.getState().openContact(context, source);
}
