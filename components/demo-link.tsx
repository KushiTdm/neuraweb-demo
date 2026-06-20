"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface DemoLinkProps extends Omit<React.ComponentProps<typeof Link>, "href"> {
  /** Destination réelle. Absente → redirige vers la page stub /demo. */
  href?: string;
  /** Nom de la fonctionnalité, affiché sur /demo si pas de href réel. */
  feature?: string;
}

/**
 * Garantit qu'aucun lien n'est mort : s'il n'y a pas de `href` réel, pointe vers
 * /demo?feature=...&from=... (page stub soignée). Utilisé partout par défaut.
 */
export const DemoLink = forwardRef<HTMLAnchorElement, DemoLinkProps>(function DemoLink(
  { href, feature, className, children, ...rest },
  ref,
) {
  const pathname = usePathname();
  const target =
    href ??
    `/demo?feature=${encodeURIComponent(feature ?? "Fonctionnalité")}&from=${encodeURIComponent(pathname)}`;

  return (
    <Link ref={ref} href={target} className={cn(className)} {...rest}>
      {children}
    </Link>
  );
});
