"use client";

import { ChatIcon } from "@/components/brand/icons";
import { openContact } from "@/lib/ui-store";
import { cn } from "@/lib/utils";

/**
 * Bouton « contact » unique de la démo : ouvre le vrai formulaire de lead.
 * `solid` = Pale Gray sur fond sombre (comme le bouton principal de neuraweb.fr), `outline` = contour.
 */
export function ContactButton({
  label = "Discuter de votre projet",
  variant = "outline",
  context,
  className,
}: {
  label?: string;
  variant?: "solid" | "outline";
  context?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => openContact(context)}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.98]",
        variant === "solid"
          ? "bg-navy-100 text-navy-950 shadow-lg shadow-black/20 hover:-translate-y-0.5 hover:bg-white"
          : "border border-navy-100/30 text-navy-100 hover:border-navy-100/60 hover:bg-white/10",
        className,
      )}
    >
      <ChatIcon />
      {label}
    </button>
  );
}
