import type { VerticalId } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Icônes maison de la démo — même grammaire que le lanceur du chatbot de neuraweb.fr :
 * grille 32 px, trait arrondi de 2,2 px, `currentColor`, pas de remplissage.
 */
interface IconProps {
  className?: string;
  title?: string;
}

function Base({ className, title, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-6 w-6 shrink-0", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title && <title>{title}</title>}
      {children}
    </svg>
  );
}

/** Hôtel : façade, fenêtres et porte d'entrée. */
export function HotelIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M6 27V7.5A1.5 1.5 0 0 1 7.5 6h17A1.5 1.5 0 0 1 26 7.5V27" />
      <path d="M3.5 27h25" />
      <path d="M11 11.5h2M19 11.5h2M11 17h2M19 17h2" />
      <path d="M14 27v-5.5a2 2 0 0 1 4 0V27" />
    </Base>
  );
}

/** Restaurant : cloche de service posée sur son plateau. */
export function RestaurantIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M5.5 22.5a10.5 10.5 0 0 1 21 0Z" />
      <path d="M3.5 26.5h25" />
      <path d="M16 12V9.5M13.5 9h5" />
    </Base>
  );
}

/** Collectivité : fronton, colonnes et soubassement d'une mairie. */
export function TownHallIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 12.5 16 5l12 7.5Z" />
      <path d="M8 16v8M13 16v8M19 16v8M24 16v8" />
      <path d="M5.5 27.5h21M4 24.5h24" />
    </Base>
  );
}

/** Connexion web ↔ mobile : écran et téléphone reliés. */
export function ConnectIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="3.5" y="6" width="17" height="12" rx="2" />
      <path d="M8 22.5h8M12 18v4.5" />
      <rect x="21.5" y="12" width="7" height="14" rx="1.8" />
      <path d="M25 23.2h.01" />
    </Base>
  );
}

const BY_VERTICAL: Record<VerticalId, (p: IconProps) => React.ReactElement> = {
  hotel: HotelIcon,
  restaurant: RestaurantIcon,
  collectivite: TownHallIcon,
};

export function VerticalIcon({ id, ...props }: IconProps & { id: VerticalId }) {
  const Icon = BY_VERTICAL[id];
  return <Icon {...props} />;
}

/**
 * Lanceur de l'assistant — même bulle et mêmes trois points animés que le chatbot de neuraweb.fr
 * (keyframes `nw-typing`, définies dans globals.css).
 */
export function ChatLauncherIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false" className={cn("h-[30px] w-[30px]", className)}>
      <path
        d="M6 6.5h20a2.5 2.5 0 0 1 2.5 2.5v11a2.5 2.5 0 0 1-2.5 2.5H14l-5.2 4.3a.6.6 0 0 1-1-.46V22.5H6A2.5 2.5 0 0 1 3.5 20V9A2.5 2.5 0 0 1 6 6.5Z"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      <circle className="nw-typing-dot" cx="10.5" cy="14.5" r="1.9" fill="currentColor" style={{ animationDelay: "0ms" }} />
      <circle className="nw-typing-dot" cx="16" cy="14.5" r="1.9" fill="currentColor" style={{ animationDelay: "160ms" }} />
      <circle className="nw-typing-dot" cx="21.5" cy="14.5" r="1.9" fill="currentColor" style={{ animationDelay: "320ms" }} />
    </svg>
  );
}

/** Bulle statique (boutons de contact) : même tracé que le lanceur, sans animation. */
export function ChatIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false" className={cn("h-5 w-5 shrink-0", className)}>
      <path
        d="M6 6.5h20a2.5 2.5 0 0 1 2.5 2.5v11a2.5 2.5 0 0 1-2.5 2.5H14l-5.2 4.3a.6.6 0 0 1-1-.46V22.5H6A2.5 2.5 0 0 1 3.5 20V9A2.5 2.5 0 0 1 6 6.5Z"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      <circle cx="10.5" cy="14.5" r="1.7" fill="currentColor" />
      <circle cx="16" cy="14.5" r="1.7" fill="currentColor" />
      <circle cx="21.5" cy="14.5" r="1.7" fill="currentColor" />
    </svg>
  );
}
