import { cn } from "@/lib/utils";

export type Tone = "neutral" | "info" | "progress" | "success" | "warn" | "danger";

const TONE_CLASS: Record<Tone, string> = {
  neutral: "bg-white/8 text-white/70 ring-white/15",
  info: "bg-sky-400/15 text-sky-300 ring-sky-400/30",
  progress: "bg-amber-400/15 text-amber-300 ring-amber-400/30",
  success: "bg-lime/15 text-lime ring-lime/30",
  warn: "bg-coral/15 text-coral-soft ring-coral/30",
  danger: "bg-red-500/15 text-red-300 ring-red-500/30",
};

export function StatusBadge({
  children,
  tone = "neutral",
  dot = false,
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        TONE_CLASS[tone],
        className,
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

/* Mappings statut → ton, centralisés */
export const reportTone: Record<string, Tone> = {
  nouveau: "warn",
  recu: "info",
  en_cours: "progress",
  resolu: "success",
};
export const orderTone: Record<string, Tone> = {
  en_attente: "warn",
  en_preparation: "progress",
  prete: "success",
  recuperee: "neutral",
  refusee: "danger",
};
export const hotelReservationTone: Record<string, Tone> = {
  demande: "warn",
  confirmee: "success",
  refusee: "danger",
  arrivee: "info",
  partie: "neutral",
};
export const serviceTone: Record<string, Tone> = {
  nouvelle: "warn",
  en_cours: "progress",
  traitee: "success",
};
export const reservationTone: Record<string, Tone> = {
  demande: "warn",
  validee: "success",
  refusee: "danger",
  annulee: "neutral",
};
export const procedureTone: Record<string, Tone> = {
  depose: "warn",
  instruction: "progress",
  complement: "info",
  valide: "success",
};
export const roomTone: Record<string, Tone> = {
  libre: "success",
  occupee: "info",
  menage: "progress",
};
